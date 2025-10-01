import { Button } from "@/components/ui/button";
import type { BusinessList } from "@/services/api/gen";
import { Edit, MoreHorizontal } from "lucide-react";

interface Props {
  business: BusinessList;
  refetch: () => void;
  openDetails: (b: BusinessList) => void;
  openEdit: (b: BusinessList) => void;
  openKyc: (b: BusinessList) => void;
}

export function BusinessActions({
  business,
  openDetails,
  openEdit,
  openKyc,
}: Props) {
  return (
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
        className="flex-1 bg-yellow-100 !text-yellow-500 border-yellow-500 hover:bg-yellow-100 flex items-center justify-center gap-2"
        onClick={() => openEdit(business)}
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        className="flex-1 bg-emerald-100 !text-emerald-600 border-emerald-600 hover:bg-emerald-100"
        onClick={() => openDetails(business)}
      >
        <MoreHorizontal className="h-4 w-4" /> View Details
      </Button>
    </div>
  );
}
