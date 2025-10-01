import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/helpers/funtions/validators";
import type { BusinessAddress } from "@/services/api/gen";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LocationListBusinessFormSchema } from "../schema/LocationBasicListBusinessFormSchema";
import type { AddressListBusinessFormsPropsT } from "../types";

const LocationListBusinessForm: React.FC<AddressListBusinessFormsPropsT> = ({
  changeTab,
  initialValues,
  businessId,
  updateFormValues,
}) => {
  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data, variables) => {
      toast.success("Business updated successfully !!");
      if (data.data.address)
        updateFormValues(
          "AddressListBusinessFormInitialValues",
          data.data.address
        );
      changeTab("poc");
    },
  });

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: LocationListBusinessFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: BusinessAddress = {
        ...value,
      };

      updateBusiness.mutate({
        body: { address: payload },
        path: { business_id: businessId },
      });
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Locatoin Information</CardTitle>
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
          <form.Field name="address_line_1">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Address Line 1
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

          <form.Field name="city">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  City
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

          <form.Field name="state">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  State
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

          <form.Field name="country">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Country
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

          <form.Field name="postal_code">
            {(field) => (
              <div className="space-y-1">
                <Label required htmlFor={field.name}>
                  Postal Code
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
            onClick={() => changeTab("poc")}
          >
            Skip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationListBusinessForm;
