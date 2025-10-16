import type {
  BusinessAddress,
  BusinessDetailsSchema,
  BusinessMediaItems,
  BusinessPoc,
  BusinessProfile,
  MasterConfiguration,
  SocialMedia,
} from "@/services/api/gen";

export type BasicListBusinessFormPropsT = {
  refetch?: () => void;
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: BusinessProfile;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
  setBusinessId: (id: string) => void;
  setTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  businessId: string;
};

export type AddressListBusinessFormsPropsT = {
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: BusinessAddress;
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export type PocListBusinessFormsPropsT = {
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: BusinessPoc;
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export type KeywordListBusinessFormsPropsT = {
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: MasterConfiguration[];
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export type MediaListBusinessFormsPropsT = {
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: Array<BusinessMediaItems>;
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export type SocialListBusinessFormsPropsT = {
  changeTab: (tab: ListBusinessFormsInitialStateI["defaultTab"]) => void;
  initialValues: Array<SocialMedia>;
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export type ExtraFieldsListBusinessFormsPropsT = {
  initialValues: unknown;
  businessId: string;
  updateFormValues: <K extends keyof ListBusinessFormsInitialStateI>(
    key: K,
    data: Partial<ListBusinessFormsInitialStateI[K]>
  ) => void;
};

export interface ListBusinessSheetProps {
  isOpen: boolean;
  closeModal: () => void;
  businessData?: BusinessDetailsSchema;
  refetch?: () => void;
}

export interface ListBusinessFormsInitialStateI {
  businessId: string;
  defaultTab:
    | "basic"
    | "location"
    | "poc"
    | "domain"
    | "media"
    | "social"
    | "extra";
  BasicListBusinessFormInitialValues: BusinessProfile;
  AddressListBusinessFormInitialValues: BusinessAddress;
  PocListBusinessFormInitialValues: BusinessPoc;
  KeywordListBusinessFormInitialValues: Array<MasterConfiguration>;
  MediaListBusinessFormInitialValues: Array<BusinessMediaItems>;
  SocailListBusinessFormInitialValues: Array<SocialMedia>;
  ExtraFieldsListBusinessFormInitialValues: unknown;
}
