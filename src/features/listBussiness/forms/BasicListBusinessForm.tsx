import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { TimeField } from "@/components/custom-input/TimeField";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/helpers/funtions/validators";
import { useConf } from "@/hooks/useConf";
import { usePlans } from "@/hooks/usePlans";
import { cn } from "@/lib/utils";
import { v1MediaPresignedUploadCreate } from "@/services/api/gen";
import {
  v1BusinessDetailsUpdateMutation,
  v1BusinessProfileCreateMutation,
} from "@/services/api/gen/@tanstack/react-query.gen";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import type { BusinessProfile } from "../../../services/api/gen/types.gen";
import type { BasicListBusinessFormPropsT } from "../types";

const BasicListBusinessForm: React.FC<BasicListBusinessFormPropsT> = ({
  refetch,
  changeTab,
  initialValues,
  updateFormValues,
  setBusinessId,
  businessId,
  setTab,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: plans } = usePlans();

  const { data: paymentConf } = useConf("PAYMENT MODES");

  const addBusiness = useMutation({
    ...v1BusinessProfileCreateMutation(),
    onSuccess: (data, variables) => {
      toast.success("Business added successfully !!");
      if (data.data.profile)
        updateFormValues(
          "BasicListBusinessFormInitialValues",
          data.data.profile
        );
      if (data.data.id) {
        setBusinessId(data.data.id);
        setTab("location");
      }
      refetch && refetch();
      form.reset();
      setPreviewImage(null);
      setImageFile(null);
    },
  });

  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data, variables) => {
      toast.success("Business updated successfully !!");
      if (data.data.profile)
        updateFormValues(
          "BasicListBusinessFormInitialValues",
          data.data.profile
        );
      changeTab("location");
      if (refetch) {
        console.log("first");
        refetch();
      }
    },
  });

  const form = useForm({
    defaultValues: initialValues satisfies BusinessProfile,
    onSubmit: async ({ value }) => {
      const payload: BusinessProfile = {
        ...value,
        logo: imageFile ?? "",
      };

      if (businessId) {
        updateBusiness.mutate({
          body: {
            profile: payload,
          },
          path: { business_id: businessId },
        });
      } else {
        addBusiness.mutate({
          body: payload,
        });
      }
    },
  });

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, error } = await v1MediaPresignedUploadCreate({
        body: {
          type: "bl",
          content_type: file.type,
          extra: { business_id: businessId },
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="space-y-6"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={previewImage || initialValues.logo_url || undefined}
                />
                <AvatarFallback className="text-lg">
                  <Camera className="h-8 w-8" />
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

            <Label className="mb-2">Business Logo</Label>

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
                    ? "Change Logo"
                    : "Upload Logo"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              validators={{
                onChange: z.string().min(1, "Business name is required"),
                onSubmit: z
                  .string()
                  .min(1, "Business contact number is required"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label required htmlFor={field.name}>
                    Business Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter business name"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />
            <form.Field
              name="tagline"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Business Tagline</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter business tagline"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="contact_no"
              validators={{
                onChange: z
                  .string()
                  .min(10, "Business contact number must have 10 charachters"),
                onSubmit: z
                  .string()
                  .min(10, "Business contact number must have 10 charachters"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label required htmlFor={field.name}>
                    Business Contact No
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter contact number"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="whatsapp_no"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>WhatsApp Contact No</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="opening_time"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Please pick a time";
                  const ok = /^\d{1,2}:\d{2}\s+(A\.M\.|P\.M\.)$/.test(value);
                  return ok ? undefined : "Invalid time format";
                },
                onSubmit: ({ value }) => {
                  if (!value) return "Please pick a time";
                  const ok = /^\d{1,2}:\d{2}\s+(A\.M\.|P\.M\.)$/.test(value);
                  return ok ? undefined : "Invalid time format";
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col space-y-2">
                  <TimeField
                    id="opening-time"
                    label="Opening time"
                    required
                    value={field.state.value}
                    onChange={field.handleChange}
                    minuteStep={5}
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="closing_time"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Please pick a time";
                  const ok = /^\d{1,2}:\d{2}\s+(A\.M\.|P\.M\.)$/.test(value);
                  return ok ? undefined : "Invalid time format";
                },
                onSubmit: ({ value }) => {
                  if (!value) return "Please pick a time";
                  const ok = /^\d{1,2}:\d{2}\s+(A\.M\.|P\.M\.)$/.test(value);
                  return ok ? undefined : "Invalid time format";
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col space-y-2">
                  <TimeField
                    id="closing-time"
                    label="Closing time"
                    required
                    value={field.state.value}
                    onChange={field.handleChange}
                    error={field.state.meta.errors?.[0]}
                    minuteStep={5}
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Business Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe your business"
                  rows={4}
                />
              </div>
            )}
          />

          <form.Field
            name="establishment"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Business establishment date is required";

                // Check format (YYYY-MM-DD)
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
                  return "Invalid date format (YYYY-MM-DD)";

                const selectedDate = new Date(value);
                const today = new Date();

                // Prevent future dates
                if (selectedDate > today)
                  return "Establishment date cannot be in the future";

                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label required>Business Establishment</Label>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    field.state.meta.errors.length > 0 && "border-destructive"
                  )}
                  max={new Date().toISOString().split("T")[0]}
                />
                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="payment_mode"
            validators={{
              onSubmit: ({ value }) => {
                const allowedIds = (paymentConf ?? []).map((p) => p.id);

                if (!value) {
                  return "Please select a payment method";
                }

                if (!allowedIds.includes(value)) {
                  return "Invalid payment method";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label required>Payment Method</Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="flex gap-4"
                >
                  {(paymentConf ?? []).map((p) => (
                    <div className="flex items-center space-x-2" key={p.id}>
                      <RadioGroupItem value={p.id} id={p.id} />
                      <Label htmlFor={p.id}>{p.key}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="plan"
            validators={{
              onSubmit: ({ value }) => {
                const allowedIds = (plans ?? []).map((p) => p.id);

                if (!value) {
                  return "Please select a plan";
                }

                if (!allowedIds.includes(value)) {
                  return "Invalid plan";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label required>Plan</Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="flex gap-4"
                >
                  {(plans ?? []).map((p) => (
                    <div className="flex items-center space-x-2" key={p.id}>
                      <RadioGroupItem value={p.id} id={p.id} />
                      <Label htmlFor={p.id}>{p.name}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="email"
              validators={{
                onChange: z
                  .string()
                  .min(1, "Business email is required")
                  .email("Please enter a valid email address"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label required htmlFor={field.name}>
                    Business Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter business email"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="website"
              validators={{
                onChange: z
                  .string()
                  .refine(
                    (val) =>
                      val === "" || z.string().url().safeParse(val).success,
                    { message: "Please enter a valid URL" }
                  ),
                onSubmit: z
                  .string()
                  .refine(
                    (val) =>
                      val === "" || z.string().url().safeParse(val).success,
                    { message: "Please enter a valid URL" }
                  ),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Business Website</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://example.com"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !form.state.canSubmit || form.state.isSubmitting || isUploading
            }
            onClick={() => form.handleSubmit()}
          >
            {businessId ? "Update" : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicListBusinessForm;
