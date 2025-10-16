import {
  v1MediaPresignedUploadCreate,
  type TypeEnum,
} from "@/services/api/gen";

type UploadOptions = {
  type: TypeEnum;
  contentType?: string;
  extra?: Record<string, any>;
  onSuccess?: (imgInstance: string) => void;
  onPreview?: (previewUrl: string) => void;
  onError?: (msg: string) => void;
  onStart?: () => void;
  onComplete?: () => void;
};

export const handleFileUpload = async (file: File, options: UploadOptions) => {
  const {
    type,
    contentType = file.type,
    extra,
    onSuccess,
    onPreview,
    onError,
    onStart,
    onComplete,
  } = options;

  if (!file) {
    onError?.("No file selected");
    return;
  }

  onStart?.();

  try {
    const { data, error } = await v1MediaPresignedUploadCreate({
      body: {
        type,
        content_type: contentType,
        extra,
      },
    });

    if (error || !data?.data?.url) {
      onError?.("Failed to generate upload URL");
      return;
    }

    const { url, img_instance } = data.data;

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      onError?.("Image could not be uploaded");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPreview?.(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    onSuccess?.(img_instance);
  } catch (err) {
    console.error("Upload error:", err);
    onError?.("Something went wrong while uploading image");
  } finally {
    onComplete?.();
  }
};
