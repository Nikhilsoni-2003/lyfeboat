import type { FileItem } from "@/components/custom-input/FileUpload";
import FileUpload from "@/components/custom-input/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { toast } from "sonner";
import type { MediaListBusinessFormsPropsT } from "../types";

const MediaListBusinessForm: React.FC<MediaListBusinessFormsPropsT> = ({
  changeTab,
  initialValues,
  businessId,
  updateFormValues,
}) => {
  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data) => {
      toast.success("Business updated successfully ✅");
      if (data.data.media_url) {
        updateFormValues(
          "MediaListBusinessFormInitialValues",
          data.data.media_url
        );
      }
      form.reset();
      changeTab("social");
    },
  });

  const form = useForm({
    defaultValues: {
      media_items: (initialValues ?? []).map((m, i) => ({
        id: m.id,
        name: `media-${i + 1}`,
        size: 0,
        type: "application/octet-stream",
        url: m.media,
        status: "success",
        progress: 100,
      })) as FileItem[],
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      if (value.media_items.length === 0) {
        toast.info("Kindly add media items!!");
        return;
      }
      const ids = value.media_items
        .map((item) => item.uploadedInstance || item.id)
        .filter((id): id is string => !!id);

      await updateBusiness.mutateAsync({
        path: { business_id: businessId },
        body: { media_items: ids },
      });
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="media_items"
            children={(field) => (
              <div className="space-y-2">
                <Label required>Business Catalogue</Label>
                <FileUpload
                  value={field.state.value || []}
                  onChange={field.handleChange}
                  multiple
                  accept="*"
                />
              </div>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={updateBusiness.isPending}
          >
            {updateBusiness.isPending ? "Saving..." : "Save & Continue"}
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => changeTab("social")}
          >
            Skip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MediaListBusinessForm;
