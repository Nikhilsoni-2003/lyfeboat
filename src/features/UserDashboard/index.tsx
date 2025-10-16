import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BusinessDetailsModal } from "@/features/dashboard/components/common/BusinessDetailsModal";
import Kyc from "@/features/dashboard/kyc";
import ListBussinessFeat from "@/features/listBussiness";
import ListBusinessSheet from "@/features/listBussiness/components/ListBusinessSheet";
import { getStatusInfo } from "@/helpers/funtions/getStatusInfo";
import { useBusinesses } from "@/hooks/useBusinesses";
import type { BusinessList } from "@/services/api/gen";
import { v1KycDetailsRetrieve } from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Edit, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

type ActiveSheet = "details" | "edit" | "kyc" | null;

const UserDashboard = () => {
  const { businessid } = useParams({ from: "/_auth/dashboard/$businessid" });
  const { data: businesses, refetch, isLoading } = useBusinesses();

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<
    BusinessList | undefined
  >(undefined);

  const { data: kycDetails, isLoading: kycLoading } = useQuery({
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

  const filteredBusinesses = businesses?.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetails = (business: BusinessList) => {
    setSelectedBusiness(business);
    setActiveSheet("details");
  };

  const openEdit = (business: BusinessList) => {
    setSelectedBusiness(business);
    setActiveSheet("edit");
  };

  const openKyc = (business: BusinessList) => {
    setSelectedBusiness(business);
    setActiveSheet("kyc");
  };

  const closeSheet = () => {
    setSelectedBusiness(undefined);
    setActiveSheet(null);
  };

  if (businesses)
    return (
      <>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6 h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Your Businesses
            </h1>
            <div className="flex gap-5">
              <div>
                <ListBussinessFeat refetch={refetch} />
              </div>
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

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 pr-2">
              {filteredBusinesses?.map((business) => {
                const statusInfo = getStatusInfo(
                  business?.approval_status ?? ""
                );

                return (
                  <Card key={business.id} className="w-full flex-shrink-0 py-4">
                    <div className="flex flex-col h-full">
                      <div className="flex">
                        <div className="flex-1 p-4 flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3
                                className="font-semibold text-lg text-foreground truncate"
                                title={business.name}
                              >
                                {business.name}
                              </h3>
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p
                              className="text-sm text-muted-foreground truncate"
                              title={business.tagline ?? ""}
                            >
                              <span className="text-foreground font-medium">
                                Remark
                              </span>{" "}
                              : {business.remark}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 p-4 border-l border-r">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">
                                Contact:
                              </span>
                              <span className="text-muted-foreground">
                                {business.contact_no}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">
                                Hours:
                              </span>
                              <span className="text-muted-foreground text-right">
                                {business.opening_time} -{" "}
                                {business.closing_time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between px-4 pt-2 gap-4">
                        <Button
                          variant="outline"
                          className="flex-1 bg-red-100 !text-red-500 border-red-500 hover:bg-red-100"
                          onClick={() => openKyc(business)}
                        >
                          <Edit className="h-4 w-4" /> Complete KYC
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-yellow-100 !text-yellow-500 border-yellow-500 hover:bg-yellow-100"
                          onClick={() => openEdit(business)}
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-emerald-100 !text-emerald-600 border-emerald-600 hover:bg-emerald-100"
                          onClick={() => openDetails(business)}
                        >
                          <MoreHorizontal className="h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredBusinesses?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No businesses found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          {activeSheet === "details" && selectedBusiness && (
            <BusinessDetailsModal
              business={selectedBusiness}
              isOpen={true}
              onClose={closeSheet}
            />
          )}

          {activeSheet === "edit" && selectedBusiness && (
            <ListBusinessSheet
              isOpen={true}
              closeModal={closeSheet}
              businessId={selectedBusiness.id}
              refetch={refetch}
            />
          )}

          {activeSheet === "kyc" && selectedBusiness && !kycLoading && (
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
        </div>
      </>
    );
};

export default UserDashboard;
