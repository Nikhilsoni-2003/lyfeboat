import type { ApprovalStatusEnum } from "@/services/api/gen";

export const getStatusInfo = (status: ApprovalStatusEnum) => {
  switch (status) {
    case "approve":
      return {
        label: "Approved",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-100 text-base",
      };
    case "rejected":
      return {
        label: "Rejected",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      };
    case "pending":
      return {
        label: "Pending",
        variant: "secondary" as const,
        className: "bg-yellow-100/50 text-yellow-500 hover:bg-yellow-100",
      };
    case "kyc_pending":
      return {
        label: "KYC Pending",
        variant: "destructive" as const,
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      };
    default:
      return { label: "Unknown", variant: "outline" as const, className: "" };
  }
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
