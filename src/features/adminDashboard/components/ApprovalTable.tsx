"use client";

import getStatusBadge from "@/components/status-badge/getStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Kyc from "@/features/dashboard/kyc";
import ListBusinessSheet from "@/features/listBussiness/components/ListBusinessSheet";
import {
  v1BusinessDetailsRetrieve,
  v1KycDetailsRetrieve,
  type ApprovalStatusFe1Enum,
  type BusinessAdminList,
} from "@/services/api/gen";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ActionDialog } from "./ActionDialog";
import { RemarksModal } from "./RemarksModal";

interface ApprovalTableProps {
  data: Array<BusinessAdminList>;
  refetch: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ApprovalTable({ data, refetch }: ApprovalTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BusinessAdminList | null>(
    null
  );
  const [actionType, setActionType] =
    useState<ApprovalStatusFe1Enum>("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [kycItem, setKycItem] = useState<BusinessAdminList | null>(null);

  const {
    data: kycDetails,
    isLoading: isKycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ["kyc-details", kycItem?.id],
    queryFn: async () => {
      if (!kycItem?.id) return null;
      const { data } = await v1KycDetailsRetrieve({
        path: { business_id: kycItem.id },
      });
      return data?.data ?? null;
    },
    enabled: !!kycItem?.id,
  });

  const {
    data: businessData,
    error,
    isLoading: isBusinessLoading,
    refetch: businessRefetch,
  } = useQuery({
    queryKey: ["business-details", selectedItem?.id],
    queryFn: () =>
      v1BusinessDetailsRetrieve({
        path: { business_id: selectedItem?.id ?? "" },
      }),
    enabled: !!selectedItem,
    select: (res) => res.data?.data,
  });

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error("Failed to fetch business details.");
    }
  }, [error]);

  const filteredData = data.filter(
    (item) =>
      `${item.first_name} ${item.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (
    item: BusinessAdminList,
    type: ApprovalStatusFe1Enum
  ) => {
    setSelectedItem(item);
    setActionType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const startEditing = (item: BusinessAdminList) => {
    setIsEditing(true);
    setSelectedItem(item);
  };

  const closeKycSheet = () => setKycItem(null);

  const closeSheet = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-end justify-end w-full">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or applicant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/30">
                <TableHead className=" font-medium text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className=" font-medium text-muted-foreground">
                  Applicant
                </TableHead>
                <TableHead className=" font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className=" font-medium text-muted-foreground">
                  Remarks
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`border-border/30 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                >
                  <TableCell className="font-medium py-4">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {item.first_name} {item.last_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(item.approval_status ?? "")}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="w-full">
                      <RemarksModal
                        remarks={item.remarks}
                        itemId={item.id}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-emerald-200 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-300 transition-colors bg-transparent"
                        onClick={() => handleAction(item, "approved")}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors bg-transparent"
                        onClick={() => handleAction(item, "rejected")}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-amber-200 text-amber-500 hover:bg-amber-50 hover:border-amber-300 transition-colors bg-transparent"
                        onClick={() => handleAction(item, "need_information")}
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        More Info
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-foreground-200 text-foreground-500 hover:bg-foreground-50 hover:border-foreground-300 transition-colors bg-transparent"
                        onClick={() => startEditing(item)}
                        disabled={
                          selectedItem?.id === item.id && isBusinessLoading
                        }
                      >
                        {selectedItem?.id === item.id && isBusinessLoading ? (
                          <span className="animate-spin mr-2 h-4 w-4 border-yellow-500 border-t-transparent rounded-full" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-blue-200 text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                        onClick={() => setKycItem(item)}
                        disabled={kycItem?.id === item.id && isKycLoading}
                      >
                        {kycItem?.id === item.id && isKycLoading ? (
                          <span className="animate-spin mr-2 h-4 w-4 border-yellow-500 border-t-transparent rounded-full" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                        KYC
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedItem && (
        <ActionDialog
          open={dialogOpen}
          onClose={closeDialog}
          actionType={actionType}
          businessId={selectedItem.id}
          businessName={selectedItem.name}
          applicantName={`${selectedItem.first_name} ${selectedItem.last_name}`}
          onSuccess={refetch}
        />
      )}
      {selectedItem && !isBusinessLoading && (
        <ListBusinessSheet
          isOpen={isEditing}
          closeModal={closeSheet}
          businessData={businessData}
          refetch={refetch}
        />
      )}
      {kycItem && (
        <Kyc
          isOpen={!!kycItem}
          closeModal={closeKycSheet}
          businessId={kycItem.id}
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
