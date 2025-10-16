import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validateAadhar,
  validateDateOfBirth,
  validateEmail,
} from "@/helpers/funtions/validators";
import { useConf } from "@/hooks/useConf";
import { cn } from "@/lib/utils";
import {
  v1MediaPresignedUploadCreate,
  type UserProfile,
} from "@/services/api/gen";
import { v1ProfileProfileDetailCreateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Camera, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProfileFormProps {
  onOpenChange: (open: boolean) => void;
  closeModal: () => void;
  initialValues?: UserProfile;
}

export function ProfileForm({
  onOpenChange,
  initialValues,
  closeModal,
}: ProfileFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialValues?.user_profile?.profile_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const context = useRouteContext({ from: "__root__" });
  const { useProfileModalStore, useUserStore } = context;
  const { setIsProfileCompleted } = useUserStore();
  const { data: genderConf } = useConf("GENDER");

  const updateProfile = useMutation({
    ...v1ProfileProfileDetailCreateMutation(),
    onSuccess: (data, variables) => {
      toast.success("Profile updated successfully !!");
      useProfileModalStore.setState({ initialValues: data.data });
      setIsProfileCompleted(true);
      closeModal();
      form.reset();
      setPreviewImage(initialValues?.user_profile?.profile_url || null);
      setImageFile(null);
    },
  });

  const form = useForm({
    defaultValues: {
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
      email: initialValues?.email || "",
      gender: initialValues?.user_profile?.gender || "",
      aadhaar_number: initialValues?.user_profile?.aadhaar_number || "",
      dob: initialValues?.user_profile?.dob || "",
    },
    onSubmit: async ({ value }) => {
      updateProfile.mutate({
        body: {
          email: value.email,
          first_name: value.first_name,
          last_name: value.last_name,
          user_profile: {
            aadhaar_number: value.aadhaar_number,
            dob: value.dob,
            gender: value.gender,
            profile: imageFile,
          },
        },
      });
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, error } = await v1MediaPresignedUploadCreate({
        body: {
          type: "up",
          content_type: file.type,
        },
      });

      if (error || !data?.data?.url) {
        toast.error("Failed to generate upload URL");
        setIsUploading(false);
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
        toast.error("Image could not be uploaded");
        setIsUploading(false);
        return;
      }

      setImageFile(img_instance);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Image uploaded successfully ✅");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong while uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewImage || undefined} />
            <AvatarFallback className="text-lg">
              {form.state.values.first_name ? (
                getInitials(form.state.values.first_name)
              ) : (
                <Camera className="h-8 w-8" />
              )}
            </AvatarFallback>
          </Avatar>

          {previewImage && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            {isUploading
              ? "Uploading…"
              : previewImage
                ? "Change Photo"
                : "Upload Photo"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <form.Field
        name="first_name"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "First Name is required"
              : value.length < 2
                ? "First Name must be at least 2 characters"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive"
              )}
              placeholder="Enter your First Name"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="last_name"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Name is required"
              : value.length < 2
                ? "Last Name must be at least 2 characters"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive"
              )}
              placeholder="Enter your full Last Name"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Email is required"
              : !validateEmail(value)
                ? "Please enter a valid email address"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive"
              )}
              placeholder="Enter your email address"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="gender"
        validators={{
          onChange: ({ value }) => (!value ? "Gender is required" : undefined),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) =>
                field.handleChange(value as "male" | "female" | "other")
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  field.state.meta.errors.length > 0 && "border-destructive"
                )}
              >
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                {(genderConf ?? []).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="aadhaar_number"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Aadhar number is required"
              : !validateAadhar(value)
                ? "Please enter a valid 12-digit Aadhar number"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="aadhaar_number">Aadhar Number *</Label>
            <Input
              id="aadhaar_number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                field.handleChange(value);
              }}
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive"
              )}
              placeholder="Enter your 12-digit Aadhar number"
              maxLength={12}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="dob"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Date of birth is required"
              : !validateDateOfBirth(value)
                ? "Please enter a valid date of birth"
                : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length > 0 && "border-destructive"
              )}
              max={new Date().toISOString().split("T")[0]}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !form.state.canSubmit || form.state.isSubmitting || isUploading
          }
          className="flex-1"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : initialValues
              ? "Update Profile"
              : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
