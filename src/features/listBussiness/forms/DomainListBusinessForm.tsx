import MultiSelect from "@/components/custom-input/MultiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/helpers/funtions/validators";
import {
  v1ConfigAddKeywordsCreate,
  v1ConfigurationChildrenRetrieve,
  type MasterConfiguration,
} from "@/services/api/gen";
import { v1BusinessDetailsUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeywordsSchema } from "../schema/KeywordListBusinessFormSchema";
import type { KeywordListBusinessFormsPropsT } from "../types";

const DomainListBusinessForm: React.FC<KeywordListBusinessFormsPropsT> = ({
  changeTab,
  initialValues,
  businessId,
  updateFormValues,
}) => {
  const queryClient = useQueryClient();

  const { data: options = [], isLoading } = useQuery({
    queryKey: ["keywords"],
    queryFn: async () => {
      const { data } = await v1ConfigurationChildrenRetrieve({
        path: { key: "KEYWORDS" },
      });
      return data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateBusiness = useMutation({
    ...v1BusinessDetailsUpdateMutation(),
    onSuccess: (data) => {
      toast.success("Business added successfully !!");
      if (data.data.keyword) {
        updateFormValues(
          "KeywordListBusinessFormInitialValues",
          data.data.keyword
        );
      }
      changeTab("media");
    },
  });

  const createKeyword = async (label: string): Promise<MasterConfiguration> => {
    const { data } = await v1ConfigAddKeywordsCreate({
      body: { keywords: label },
    });

    if (!data?.data) {
      toast.error("Failed to create keyword");
      throw new Error("Failed to create keyword");
    }

    const newKeyword: MasterConfiguration = {
      id: data.data.id,
      key: data.data.key,
    };

    queryClient.setQueryData<MasterConfiguration[]>(
      ["keywords"],
      (old = []) => [...old, newKeyword]
    );

    queryClient.invalidateQueries({ queryKey: ["keywords"] });

    return newKeyword;
  };

  const form = useForm({
    defaultValues: {
      keywords: initialValues,
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: KeywordsSchema },
    onSubmit: async ({ value }) => {
      updateBusiness.mutate({
        body: { keywords: value.keywords.map((k) => k.id) },
        path: { business_id: businessId },
      });
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Domain Information</CardTitle>
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
            name="keywords"
            children={(field) => (
              <div className="space-y-2">
                <Label required>Domains</Label>

                <MultiSelect<MasterConfiguration>
                  options={options}
                  value={field.state.value}
                  labelKey="key"
                  valueKey="id"
                  onChange={field.handleChange}
                  onCreateOption={createKeyword}
                  onOptionsChange={() => {}}
                  placeholder={
                    isLoading ? "Loading..." : "Search and select keywords..."
                  }
                />

                {getErrorMessage(field.state.meta.errors) && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(field.state.meta.errors)}
                  </p>
                )}
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

export default DomainListBusinessForm;
