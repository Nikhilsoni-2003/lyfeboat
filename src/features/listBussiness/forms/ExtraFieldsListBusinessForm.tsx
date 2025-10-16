import { DynamicKeyValue } from "@/components/forms/DynamicKeyValueForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExtraFieldsListBusinessFormsPropsT } from "../types";

const ExtraFieldsListBusinessForm: React.FC<
  ExtraFieldsListBusinessFormsPropsT
> = ({ initialValues, businessId, updateFormValues }) => {
  const form = useForm({
    defaultValues: {
      dynamicFields: initialValues || [],
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const dynamicFields = value.dynamicFields;

      const isEmpty =
        !Array.isArray(dynamicFields) || dynamicFields.length === 0;

      const allEmpty =
        Array.isArray(dynamicFields) &&
        dynamicFields.every(
          (field) =>
            (!field.key || field.key.trim() === "") &&
            (!field.value || field.value.trim() === "")
        );

      if (isEmpty || allEmpty) {
        toast.info("Kindly add key-value pairs!!");
        return;
      }

      updateBusiness.mutate({
        body: { extra_fields: dynamicFields },
        path: { business_id: businessId },
      });
    },
  });

  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data) => {
      toast.success("Business updated successfully !!");

      if (data.data.extra_fields) {
        form.reset({ dynamicFields: data.data.extra_fields });
        updateFormValues(
          "ExtraFieldsListBusinessFormInitialValues",
          data.data.extra_fields
        );
      }
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add custom key-value pairs with nested children
        </p>
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
            name="dynamicFields"
            children={(field) => (
              <div className="space-y-2">
                <Label required>Dynamic Fields</Label>
                <DynamicKeyValue
                  value={
                    Array.isArray(field.state.value) ? field.state.value : []
                  }
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
            {updateBusiness.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExtraFieldsListBusinessForm;
