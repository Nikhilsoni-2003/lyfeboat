import BasicListBusinessForm from "@/features/listBussiness/forms/BasicListBusinessForm";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import DomainListBusinessForm from "../forms/DomainListBusinessForm";
import ExtraFieldsListBusinessForm from "../forms/ExtraFieldsListBusinessForm";
import LocationListBusinessForm from "../forms/LocationBasicListBusinessForm";
import MediaListBusinessForm from "../forms/MediaListBusinessForm";
import PocListBusinessForm from "../forms/PocListBusinessForm";
import SocialListBusinessForm from "../forms/SocialListBusinessForm";
import type {
  ListBusinessFormsInitialStateI,
  ListBusinessSheetProps,
} from "../types";

const initialValues: ListBusinessFormsInitialStateI = {
  defaultTab: "basic",
  businessId: "",
  BasicListBusinessFormInitialValues: {
    name: "",
    description: "",
    logo: "",
    logo_url: "",
    contact_no: "",
    whatsapp_no: "",
    tagline: "",
    opening_time: "",
    closing_time: "",
    establishment: "",
    payment_mode: "",
    email: "",
    website: "",
    plan: "",
    remark: "",
  },
  AddressListBusinessFormInitialValues: {
    address_line_1: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  },
  PocListBusinessFormInitialValues: {
    name: "",
    email: "",
    phone: "",
  },
  KeywordListBusinessFormInitialValues: [],
  MediaListBusinessFormInitialValues: [],
  SocailListBusinessFormInitialValues: [],
  ExtraFieldsListBusinessFormInitialValues: [],
};

const ListBusinessSheet: React.FC<ListBusinessSheetProps> = ({
  isOpen,
  closeModal,
  businessData,
  refetch,
}) => {
  const [state, setState] =
    useState<ListBusinessFormsInitialStateI>(initialValues);

  const changeTab = (value: string) => {
    const tab = value as ListBusinessFormsInitialStateI["defaultTab"];
    if (!state.businessId && tab !== "basic") {
      toast.info("Please add basic business details to continue.", {
        id: "business-required",
      });
      return;
    }
    setState((prev) => ({ ...prev, defaultTab: tab }));
  };

  const updateFormValues = <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => {
    setState((prev) => {
      if (Array.isArray(data)) {
        return {
          ...prev,
          [key]: [...data],
        };
      }

      if (typeof data === "object" && data !== null) {
        return {
          ...prev,
          [key]: {
            ...(typeof prev[key] === "object" && prev[key] !== null
              ? prev[key]
              : {}),
            ...data,
          },
        };
      }

      return {
        ...prev,
        [key]: data,
      };
    });
  };

  const setBusinessId = (id: string) => {
    setState((prev) => ({ ...prev, businessId: id }));
  };

  const setTab = (tab: ListBusinessFormsInitialStateI["defaultTab"]) => {
    setState((prev) => ({ ...prev, defaultTab: tab }));
  };

  useEffect(() => {
    if (businessData) {
      setState((prev) => ({
        ...prev,
        businessId: businessData.id ?? initialValues.businessId,
        BasicListBusinessFormInitialValues:
          businessData.profile ??
          initialValues.BasicListBusinessFormInitialValues,
        AddressListBusinessFormInitialValues:
          businessData.address ??
          initialValues.AddressListBusinessFormInitialValues,
        PocListBusinessFormInitialValues:
          businessData.poc_details ??
          initialValues.PocListBusinessFormInitialValues,
        KeywordListBusinessFormInitialValues:
          businessData.keyword ??
          initialValues.KeywordListBusinessFormInitialValues,
        MediaListBusinessFormInitialValues:
          businessData.media_url ??
          initialValues.MediaListBusinessFormInitialValues,
        SocailListBusinessFormInitialValues:
          businessData.social_media ??
          initialValues.SocailListBusinessFormInitialValues,
        ExtraFieldsListBusinessFormInitialValues:
          businessData.extra_fields ??
          initialValues.ExtraFieldsListBusinessFormInitialValues,
      }));
    }
  }, [businessData]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen: boolean) => !isOpen && closeModal()}
    >
      <SheetContent className="min-w-[700px]">
        <SheetHeader>
          <SheetTitle>List Business</SheetTitle>
          <SheetDescription>
            Complete this form to list your business.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="pb-4 px-4 space-y-2">
            <Tabs value={state.defaultTab} onValueChange={changeTab}>
              <TabsList className="min-w-full">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="poc">POC</TabsTrigger>
                <TabsTrigger value="domain">Domain</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="social">Socials</TabsTrigger>
                <TabsTrigger value="extra">Extra</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <BasicListBusinessForm
                  changeTab={changeTab}
                  refetch={refetch}
                  initialValues={state.BasicListBusinessFormInitialValues}
                  updateFormValues={updateFormValues}
                  setBusinessId={setBusinessId}
                  businessId={state.businessId}
                  setTab={setTab}
                />
              </TabsContent>
              <TabsContent value="location">
                <LocationListBusinessForm
                  changeTab={changeTab}
                  initialValues={state.AddressListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
              <TabsContent value="poc">
                <PocListBusinessForm
                  changeTab={changeTab}
                  initialValues={state.PocListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
              <TabsContent value="domain">
                <DomainListBusinessForm
                  changeTab={changeTab}
                  initialValues={state.KeywordListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
              <TabsContent value="media">
                <MediaListBusinessForm
                  changeTab={changeTab}
                  initialValues={state.MediaListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
              <TabsContent value="social">
                <SocialListBusinessForm
                  changeTab={changeTab}
                  initialValues={state.SocailListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
              <TabsContent value="extra">
                <ExtraFieldsListBusinessForm
                  initialValues={state.ExtraFieldsListBusinessFormInitialValues}
                  businessId={state.businessId}
                  updateFormValues={updateFormValues}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ListBusinessSheet;
