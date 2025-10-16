import { Input } from "@/components/ui/input";
import ListBussinessFeat from "@/features/listBussiness";
import { useBusinesses } from "@/hooks/useBusinesses";
import type { BusinessList as BusinessListType } from "@/services/api/gen";
import { Search } from "lucide-react";
import { useState } from "react";
import { BusinessList } from "./BusinessList";
import { BusinessModals } from "./BusinessModals";

type ActiveSheet = "details" | "edit" | "kyc" | null;

export default function DashboardBusinessPage() {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessListType | null>(null);

  const openDetails = (business: BusinessListType) => {
    setSelectedBusiness(business);
    setActiveSheet("details");
  };
  const openEdit = (business: BusinessListType) => {
    setSelectedBusiness(business);
    setActiveSheet("edit");
  };
  const openKyc = (business: BusinessListType) => {
    setSelectedBusiness(business);
    setActiveSheet("kyc");
  };

  const closeSheet = () => {
    setSelectedBusiness(null);
    setActiveSheet(null);
  };

  const { data: businesses, refetch, isLoading } = useBusinesses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBusinesses = businesses?.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Businesses</h1>
        <div className="flex gap-5">
          <ListBussinessFeat refetch={refetch} />
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Enter business name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <BusinessList
        businesses={filteredBusinesses}
        refetch={refetch}
        openDetails={openDetails}
        openEdit={openEdit}
        openKyc={openKyc}
      />

      {filteredBusinesses?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No businesses found matching "{searchTerm}"
          </p>
        </div>
      )}

      <BusinessModals
        refetch={refetch}
        activeSheet={activeSheet}
        selectedBusiness={selectedBusiness}
        closeSheet={closeSheet}
      />
    </div>
  );
}
