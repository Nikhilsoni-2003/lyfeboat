import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/helpers/funtions/validators";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PocListBusinessFormSchema } from "../schema/PocListBusinessFormSchema";
import type { PocListBusinessFormsPropsT } from "../types";

const PocListBusinessForm: React.FC<PocListBusinessFormsPropsT> = ({
  changeTab,
  initialValues,
  businessId,
  updateFormValues,
}) => {
  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data, variables) => {
      toast.success("Business updated successfully !!");
      if (data.data.poc_details)
        updateFormValues(
          "PocListBusinessFormInitialValues",
          data.data.poc_details
        );
      changeTab("domain");
    },
  });

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: PocListBusinessFormSchema,
    },
    onSubmit: async ({ value }) => {
      updateBusiness.mutate({
        body: { poc_details: value },
        path: {
          business_id: businessId,
        },
      });
    },
  });
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>POC Information</CardTitle>
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
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Full Name
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Email
                </Label>
                <Input
                  type="email"
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Phone
                </Label>
                <Input
                  type="tel"
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

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
            onClick={() => changeTab("domain")}
          >
            Skip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PocListBusinessForm;
