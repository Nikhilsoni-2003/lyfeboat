import Kyc from "@/features/dashboard/kyc";
import ListBusinessSheet from "@/features/listBussiness/components/ListBusinessSheet";
import type { BusinessList } from "@/services/api/gen";
import { useBusinessQueries } from "../../utils/useBusinessQueries";
import { BusinessDetailsModal } from "../common/BusinessDetailsModal";

interface Props {
  refetch: () => void;
  activeSheet: "details" | "edit" | "kyc" | null;
  selectedBusiness: BusinessList | null;
  closeSheet: () => void;
}

export function BusinessModals({
  refetch,
  activeSheet,
  selectedBusiness,
  closeSheet,
}: Props) {
  const { businessData, kycDetails, isBusinessLoading, isKycLoading } =
    useBusinessQueries(selectedBusiness, activeSheet);

  return (
    <>
      {activeSheet === "details" && businessData && (
        <BusinessDetailsModal
          business={businessData}
          isOpen={true}
          onClose={closeSheet}
        />
      )}

      {activeSheet === "edit" && selectedBusiness && !isBusinessLoading && (
        <ListBusinessSheet
          isOpen={true}
          closeModal={closeSheet}
          businessData={isBusinessLoading ? null : businessData}
          refetch={refetch}
        />
      )}

      {activeSheet === "kyc" && selectedBusiness && !isKycLoading && (
        <Kyc
          isOpen={true}
          closeModal={closeSheet}
          businessId={selectedBusiness.id}
          initialValues={{
            mode: kycDetails?.document_type.parent ?? "",
            manualOption: kycDetails?.document_type.id ?? "",
            media_items:
              (kycDetails?.document_urls ?? []).map((m, i) => ({
                id: String(i),
                name: `media-${i + 1}`,
                size: 0,
                type: "application/octet-stream",
                url: m,
                status: "success",
                progress: 100,
              })) ?? [],
          }}
        />
      )}
    </>
  );
}
