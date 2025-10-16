import { Badge } from "@/components/ui/badge";
import type { ApprovalStatusFe1Enum } from "@/services/api/gen";

const getStatusBadge = (status: ApprovalStatusFe1Enum) => {
  switch (status.toLowerCase()) {
    case "approve":
      return (
        <Badge className="bg-green-100 text-green-500 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "reject":
      return (
        <Badge className="bg-red-100 text-red-500 hover:bg-red-100">
          Rejected
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-500 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default getStatusBadge;
