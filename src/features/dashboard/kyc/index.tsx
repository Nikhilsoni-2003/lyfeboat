import type { FileItem } from "@/components/custom-input/FileUpload";
import FileUpload from "@/components/custom-input/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getErrorMessage } from "@/helpers/funtions/validators";
import { v1ConfigurationChildrenRetrieve } from "@/services/api/gen";
import { v1KycAddCreateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "sonner";
import type { KycSheetProps } from "./types";

interface InitialValues {
  mode: string;
  manualOption: string;
  media_items: FileItem[];
}

const KycSheet: React.FC<KycSheetProps & { initialValues: InitialValues }> = ({
  isOpen,
  closeModal,
  businessId,
  initialValues,
}) => {
  const addKyc = useMutation({
    ...v1KycAddCreateMutation(),
    onSuccess: (data) => {
      toast.success("KYC details added successfully ✅");
      form.reset();
      closeModal();
    },
  });

  const { data: options = [] } = useQuery({
    queryKey: ["kyc-modes"],
    queryFn: async () => {
      const { data } = await v1ConfigurationChildrenRetrieve({
        path: { key: "KYC MODES" },
      });
      return data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      if (value.media_items.length === 0) {
        toast.info("Kindly add media items!!");
        return;
      }

      console.log(value);

      const ids = value.media_items
        .map((item) => item.uploadedInstance || item.id)
        .filter((id): id is string => !!id);

      addKyc.mutate({
        body: {
          business: businessId,
          document_type: value.manualOption,
          document_file: ids,
        },
      });
    },
  });

  const modeValue = useStore(form.store, (state) => state.values.mode);

  const selectedMode =
    options.find((opt: any) => opt.id === modeValue)?.key || "";

  const { data: manualOptions = [], refetch } = useQuery({
    queryKey: ["kyc-manual-options"],
    queryFn: async () => {
      const { data } = await v1ConfigurationChildrenRetrieve({
        path: { key: "MANUAL" },
      });
      return data?.data ?? [];
    },
    enabled: selectedMode === "MANUAL",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const manualValue = useStore(
    form.store,
    (state) => state.values.manualOption
  );

  const selectedManualOption =
    manualOptions.find((opt: any) => opt.id === manualValue)?.key || "";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen: boolean) => !isOpen && closeModal()}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Apply For KYC</SheetTitle>
          <SheetDescription>
            Complete the KYC for your business.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-4 space-y-4 px-4 flex-1 flex flex-col justify-between"
        >
          <div className="flex-1">
            <form.Field
              name="mode"
              children={(field) => (
                <div className="space-y-2">
                  <Label required>Domains</Label>

                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val);
                      if (
                        options.find((opt: any) => opt.id === val)?.key ===
                        "MANUAL"
                      ) {
                        form.resetField("manualOption");
                        refetch();
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select KYC Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt: any) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              )}
            />

            {selectedMode === "MANUAL" && (
              <form.Field
                name="manualOption"
                children={(field) => (
                  <div className="space-y-2">
                    <Label required>Manual Option</Label>

                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Manual Option" />
                      </SelectTrigger>
                      <SelectContent>
                        {manualOptions.map((opt: any) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {getErrorMessage(field.state.meta.errors) && (
                      <p className="text-sm text-destructive">
                        {getErrorMessage(field.state.meta.errors)}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {selectedMode === "MANUAL" && selectedManualOption && (
              <form.Field
                name="media_items"
                children={(field) => (
                  <div className="space-y-2">
                    <Label required>Business Catalogue</Label>
                    <FileUpload
                      value={field.state.value || []}
                      onChange={field.handleChange}
                      multiple
                      accept="image/*,application/pdf"
                    />
                  </div>
                )}
              />
            )}
          </div>
          <Button type="submit" className="w-full mb-4">
            Submit
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default memo(KycSheet);
