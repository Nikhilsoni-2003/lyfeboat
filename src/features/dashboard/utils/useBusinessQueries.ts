import type { BusinessList } from "@/services/api/gen";
import {
  v1BusinessDetailsRetrieve,
  v1KycDetailsRetrieve,
} from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type ActiveSheet = "details" | "edit" | "kyc" | null;

interface QueryResult {
  businessData: any | null;
  isBusinessLoading: boolean;
  kycDetails: any | null;
  isKycLoading: boolean;
}

export function useBusinessQueries(
  selectedBusiness: BusinessList | null,
  activeSheet: ActiveSheet
): QueryResult {
  const {
    data: businessData,
    error: businessError,
    isLoading: isBusinessLoading,
  } = useQuery({
    queryKey: ["business-details", selectedBusiness?.id],
    queryFn: () =>
      v1BusinessDetailsRetrieve({
        path: { business_id: selectedBusiness?.id ?? "" },
      }),
    enabled:
      !!selectedBusiness &&
      (activeSheet === "edit" || activeSheet === "details"),
    select: (res) => res.data?.data,
  });

  useEffect(() => {
    if (businessError) {
      console.error(businessError);
      toast.error("Failed to fetch business details.");
    }
  }, [businessError]);

  const {
    data: kycDetails,
    isLoading: isKycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ["kyc-details", selectedBusiness?.id],
    queryFn: async () => {
      if (!selectedBusiness?.id) return null;
      const { data } = await v1KycDetailsRetrieve({
        path: { business_id: selectedBusiness.id },
      });
      return data?.data ?? null;
    },
    enabled: !!selectedBusiness?.id && activeSheet === "kyc",
  });

  useEffect(() => {
    if (kycError) {
      console.error(kycError);
      toast.error("Failed to fetch KYC details.");
    }
  }, [kycError]);

  return {
    businessData,
    isBusinessLoading: activeSheet === "edit" ? isBusinessLoading : false,
    kycDetails,
    isKycLoading: activeSheet === "kyc" ? isKycLoading : false,
  };
}
