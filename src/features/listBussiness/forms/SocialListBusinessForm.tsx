import {
  SocialMediaSelect,
  type SocialMediaLink,
} from "@/components/custom-input/SocialMediaSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { SocialMedia } from "@/services/api/gen";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import type { SocialListBusinessFormsPropsT } from "../types";

const toUI = (items: SocialMedia[]): SocialMediaLink[] => {
  return items.map((s) => ({
    platform: s.platform.toString(),
    url: s.url ?? "",
  }));
};

const toBackend = (
  items: SocialMediaLink[]
): { platform: string; url: string }[] =>
  Array.isArray(items)
    ? items.map((s) => ({
        platform: s.platform,
        url: s.url,
      }))
    : [];

const SocialListBusinessForm: React.FC<SocialListBusinessFormsPropsT> = ({
  changeTab,
  initialValues,
  businessId,
  updateFormValues,
}) => {
  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data) => {
      toast.success("Business added successfully !!");
      if (data.data.social_media) {
        updateFormValues(
          "SocailListBusinessFormInitialValues",
          data.data.social_media
        );
      }
      changeTab("extra");
    },
  });

  const form = useForm({
    defaultValues: {
      socialMediaPages: toUI(initialValues || []),
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      if (value.socialMediaPages.length === 0) {
        toast.info("Kindly add platforms!!");
        return;
      }
      updateBusiness.mutate({
        body: { social_media: toBackend(value.socialMediaPages) },
        path: { business_id: businessId },
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
            name="socialMediaPages"
            children={(field) => (
              <div className="space-y-2">
                <Label required>Social Media Pages</Label>
                <SocialMediaSelect
                  value={field.state.value || []}
                  onChange={field.handleChange}
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
            onClick={() => changeTab("extra")}
          >
            Skip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialListBusinessForm;
