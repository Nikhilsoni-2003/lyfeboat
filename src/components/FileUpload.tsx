"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, Loader2, Upload, X } from "lucide-react";
import * as React from "react";
import { FilePreviewModal } from "./FilePreviewModal";

interface FileUploadProps {
  label: string;
  accept?: string;
  disabled?: boolean;
  isUploading?: boolean;
  previewImage?: string | null;
  existingFileUrl?: string | null;
  fileName?: string;
  fileType?: string;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  className?: string;
  required?: boolean;
}

export function FileUpload({
  label,
  accept = "image/*,application/pdf",
  disabled = false,
  isUploading = false,
  previewImage,
  existingFileUrl,
  fileName,
  fileType,
  onFileSelect,
  onRemove,
  className,
  required = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayUrl = previewImage;
  const isPdf =
    fileType === "pdf" ||
    (displayUrl && displayUrl.toLowerCase().includes(".pdf"));
  const isImage =
    fileType === "image" ||
    (displayUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(displayUrl));

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop() || "file";
      return filename;
    } catch {
      return "file";
    }
  };

  const displayFileName =
    fileName ||
    (existingFileUrl ? getFileNameFromUrl(existingFileUrl) : "Uploaded file");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "cursor-wait",
          previewImage || existingFileUrl
            ? "border-solid border-border"
            : "border-muted-foreground/25"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {displayUrl ? (
          <div className="relative p-4">
            <div className="flex items-center gap-4">
              {/* Preview on the left */}
              <div className="flex-shrink-0">
                {isPdf ? (
                  <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center border">
                    <span className="text-red-600 text-xs font-semibold">
                      PDF
                    </span>
                  </div>
                ) : (
                  <img
                    src={displayUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* File info and actions on the right */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {displayFileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {existingFileUrl && !previewImage
                    ? "Existing file"
                    : isPdf
                      ? "PDF Document"
                      : "Image file"}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={handlePreview}
                  disabled={isUploading}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onRemove && !isUploading && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Drop your file here, or{" "}
                    <span className="text-primary underline">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: Images, PDFs up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {displayUrl && (
        <FilePreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fileUrl={displayUrl}
          fileName={displayFileName}
          fileType={fileType || (isPdf ? "pdf" : "image")}
        />
      )}
    </div>
  );
}
