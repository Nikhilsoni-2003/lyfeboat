import type { BusinessList } from "@/services/api/gen";
import { useState } from "react";

type ActiveSheet = "details" | "edit" | "kyc" | null;

export function useBusinessModals() {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessList | null>(
    null
  );
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(
    null
  );
  const [isBusinessLoading, setBusinessLoading] = useState(false);

  const openDetails = (business: BusinessList) => {
    setSelectedBusiness(business);
    setActiveSheet("details");
  };

  const openEdit = (business: BusinessList) => {
    setEditingBusinessId(business.id);
    setSelectedBusiness(business);
    setActiveSheet("edit");
  };

  const openKyc = (business: BusinessList) => {
    setSelectedBusiness(business);
    setActiveSheet("kyc");
  };

  const closeSheet = () => {
    setSelectedBusiness(null);
    setActiveSheet(null);
  };

  return {
    activeSheet,
    selectedBusiness,
    editingBusinessId,
    isBusinessLoading,
    openDetails,
    openEdit,
    openKyc,
    closeSheet,
    setBusinessLoading,
  };
}
