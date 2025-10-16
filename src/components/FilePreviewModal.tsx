"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink } from "lucide-react";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName = "File",
  fileType = "image",
}: FilePreviewModalProps) {
  const isPdf = fileType === "pdf" || fileUrl.toLowerCase().includes(".pdf");
  const isImage =
    fileType === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2 mr-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="h-8 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-4">
          <div className="w-full h-[70vh] bg-muted rounded-lg overflow-hidden">
            {isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0"
                title={fileName}
              />
            ) : isImage ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={fileUrl || "/placeholder.svg"}
                  alt={fileName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title={fileName}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
