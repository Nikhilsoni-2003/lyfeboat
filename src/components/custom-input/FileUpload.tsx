"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { v1MediaPresignedUploadCreate } from "@/services/api/gen";
import { Download, Eye, File, Play, RotateCw, Upload, X } from "lucide-react";
import type { ReactElement } from "react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadedInstance?: string;
  status?: "idle" | "uploading" | "success" | "error";
  progress?: number;
}

interface FileUploadProps {
  value: FileItem[];
  onChange: React.Dispatch<React.SetStateAction<FileItem[]>>;
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxVideoSize?: number;
  existingLinks?: string[];
}

export default function FileUpload({
  value,
  onChange,
  multiple = false,
  accept = "*",
  maxFileSize = 2 * 1024 * 1024,
  maxVideoSize = 5 * 1024 * 1024,
  existingLinks = [],
}: FileUploadProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const createdObjectUrls = useRef<Record<string, string>>({});

  useEffect(() => {
    if (existingLinks.length > 0 && value.length === 0) {
      const existingFiles: FileItem[] = existingLinks.map((url, index) => ({
        id: `existing-${index}`,
        name: url.split("/").pop() || `File ${index + 1}`,
        size: 0,
        type: getFileTypeFromUrl(url),
        url,
        status: "success",
        progress: 100,
      }));
      onChange(existingFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingLinks]);

  useEffect(() => {
    return () => {
      Object.values(createdObjectUrls.current).forEach((u) =>
        URL.revokeObjectURL(u)
      );
      createdObjectUrls.current = {};
    };
  }, []);

  function getFileTypeFromUrl(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return "application/octet-stream";

    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoTypes = ["mp4", "webm", "ogg", "mov", "avi"];
    const pdfTypes = ["pdf"];

    if (imageTypes.includes(extension)) return `image/${extension}`;
    if (videoTypes.includes(extension)) return `video/${extension}`;
    if (pdfTypes.includes(extension)) return "application/pdf";

    return "application/octet-stream";
  }

  const validateFileSize = (file: File): boolean => {
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? maxVideoSize : maxFileSize;

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      toast.error(
        `File size exceeds ${maxSizeMB}MB limit for ${isVideo ? "videos" : "files"}`
      );
      return false;
    }
    return true;
  };

  const uploadFileWithProgress = (
    file: File,
    onProgress: (p: number) => void
  ): Promise<{ img_instance?: string | null; error?: unknown }> => {
    return new Promise(async (resolve) => {
      try {
        const { data, error } = await v1MediaPresignedUploadCreate({
          body: {
            type: "up",
            content_type: file.type,
          },
        });

        if (error || !data?.data?.url) {
          resolve({
            img_instance: null,
            error: new Error("Failed to generate upload URL"),
          });
          return;
        }

        const { url, img_instance } = data.data;

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress(100);
            resolve({ img_instance, error: null });
          } else {
            resolve({ img_instance: null, error: new Error("Upload failed") });
          }
        };

        xhr.onerror = () => {
          resolve({
            img_instance: null,
            error: new Error("Upload network error"),
          });
        };

        xhr.send(file);
      } catch (err) {
        resolve({ img_instance: null, error: err });
      }
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(validateFileSize);
    if (validFiles.length !== files.length) {
      if (validFiles.length === 0) return;
    }

    const timestamp = Date.now();
    const newFileItems: FileItem[] = validFiles.map((file, index) => ({
      id: `new-${timestamp}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: "idle",
      progress: 0,
    }));

    onChange((prev) =>
      multiple ? [...prev, ...newFileItems] : [...newFileItems]
    );

    for (const fileItem of newFileItems) {
      if (!fileItem.file) continue;

      onChange((prev) =>
        prev.map((p) =>
          p.id === fileItem.id ? { ...p, status: "uploading", progress: 0 } : p
        )
      );

      const { img_instance, error } = await uploadFileWithProgress(
        fileItem.file,
        (p) => {
          onChange((prev) =>
            prev.map((it) =>
              it.id === fileItem.id ? { ...it, progress: p } : it
            )
          );
        }
      );

      if (error || !img_instance) {
        onChange((prev) =>
          prev.map((it) =>
            it.id === fileItem.id ? { ...it, status: "error" } : it
          )
        );
        toast.error(`${fileItem.name} failed to upload`);
      } else {
        onChange((prev) =>
          prev.map((it) =>
            it.id === fileItem.id
              ? {
                  ...it,
                  status: "success",
                  uploadedInstance: img_instance,
                  progress: 100,
                }
              : it
          )
        );
        toast.success(`${fileItem.name} uploaded successfully ✅`);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    const created = createdObjectUrls.current[id];
    if (created) {
      URL.revokeObjectURL(created);
      delete createdObjectUrls.current[id];
    }
    onChange((prev) => prev.filter((item) => item.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const isImage = (type: string) => type.startsWith("image/");
  const isVideo = (type: string) => type.startsWith("video/");
  const isPdf = (type: string) => type === "application/pdf";

  const openPreview = (fileItem: FileItem) => {
    setPreviewFile(fileItem);

    setTimeout(() => modalCloseRef.current?.focus(), 0);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    if (previewFile) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewFile]);

  const getFileUrl = (fileItem: FileItem): string | null => {
    if (fileItem.url) return fileItem.url;
    if (fileItem.file) {
      if (!createdObjectUrls.current[fileItem.id]) {
        createdObjectUrls.current[fileItem.id] = URL.createObjectURL(
          fileItem.file
        );
      }
      return createdObjectUrls.current[fileItem.id];
    }
    return null;
  };

  const retryUpload = async (fileItem: FileItem) => {
    if (!fileItem.file) {
      toast.error("Cannot retry for existing file");
      return;
    }

    onChange((prev) =>
      prev.map((it) =>
        it.id === fileItem.id ? { ...it, status: "uploading", progress: 0 } : it
      )
    );

    const { img_instance, error } = await uploadFileWithProgress(
      fileItem.file,
      (p) => {
        onChange((prev) =>
          prev.map((it) =>
            it.id === fileItem.id ? { ...it, progress: p } : it
          )
        );
      }
    );

    if (error || !img_instance) {
      onChange((prev) =>
        prev.map((it) =>
          it.id === fileItem.id ? { ...it, status: "error" } : it
        )
      );
      toast.error(`${fileItem.name} failed to upload`);
    } else {
      onChange((prev) =>
        prev.map((it) =>
          it.id === fileItem.id
            ? {
                ...it,
                status: "success",
                uploadedInstance: img_instance,
                progress: 100,
              }
            : it
        )
      );
      toast.success(`${fileItem.name} uploaded successfully ✅`);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden
      />

      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            {multiple ? "Upload multiple files" : "Upload a file"}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Max size: {(maxFileSize / (1024 * 1024)).toFixed(1)}MB for files,{" "}
            {(maxVideoSize / (1024 * 1024)).toFixed(1)}MB for videos
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Choose files"
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((fileItem) => {
            const fileUrl = getFileUrl(fileItem);
            const isUploading = fileItem.status === "uploading";
            const isError = fileItem.status === "error";

            return (
              <Card key={fileItem.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {isImage(fileItem.type) && fileUrl ? (
                        <img
                          src={fileUrl || "/placeholder.svg"}
                          alt={fileItem.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : isVideo(fileItem.type) ? (
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                          <Play className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <File className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{fileItem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileItem.size)}
                        {fileItem.status === "uploading" &&
                          ` • Uploading... ${fileItem.progress ?? 0}%`}
                        {fileItem.status === "success" && " • Uploaded ✅"}
                        {fileItem.status === "error" && " • Upload failed"}
                      </p>

                      {fileItem.status === "uploading" && (
                        <div className="w-40 h-2 bg-muted-foreground/10 rounded mt-1 overflow-hidden">
                          <div
                            style={{ width: `${fileItem.progress ?? 0}%` }}
                            className="h-full rounded bg-primary"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {(isVideo(fileItem.type) || isPdf(fileItem.type)) &&
                      fileUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openPreview(fileItem)}
                          aria-label={`Preview ${fileItem.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                    {fileItem.url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(fileItem.url, "_blank")}
                        aria-label={`Download ${fileItem.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}

                    {fileItem.status === "error" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(fileItem)}
                        aria-label={`Retry ${fileItem.name}`}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(fileItem.id)}
                      disabled={isUploading}
                      aria-label={`Remove ${fileItem.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {previewFile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closePreview}
          role="presentation"
        >
          <div
            className="bg-background p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-label={`Preview ${previewFile.name}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{previewFile.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                ref={modalCloseRef}
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isImage(previewFile.type) && getFileUrl(previewFile) && (
              <img
                src={getFileUrl(previewFile)!}
                alt={previewFile.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}

            {isVideo(previewFile.type) && getFileUrl(previewFile) && (
              <video
                controls
                className="max-w-full max-h-[70vh]"
                src={getFileUrl(previewFile)!}
              >
                Your browser does not support the video tag.
              </video>
            )}

            {isPdf(previewFile.type) && getFileUrl(previewFile) && (
              <object
                data={getFileUrl(previewFile)!}
                type="application/pdf"
                className="w-full h-[70vh]"
              >
                <p>
                  PDF preview is not available.{" "}
                  <a
                    href={getFileUrl(previewFile)!}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in new tab
                  </a>
                </p>
              </object>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
