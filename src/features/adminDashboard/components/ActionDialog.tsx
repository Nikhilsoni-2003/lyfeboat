"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApprovalStatusFe1Enum } from "@/services/api/gen";
import { v1ActionsBusinessUpdateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: ApprovalStatusFe1Enum;
  businessId: string;
  businessName: string;
  applicantName: string;
  onSuccess?: () => void;
}

const getActionConfig = (type: ApprovalStatusFe1Enum) => {
  switch (type) {
    case "approved":
      return {
        title: "Approve Request",
        description: "Are you sure you want to approve this request?",
        buttonColor: "bg-green-500 hover:bg-green-600",
        icon: CheckCircle,
      };
    case "rejected":
      return {
        title: "Reject Request",
        description: "Are you sure you want to reject this request?",
        buttonColor: "bg-red-500 hover:bg-red-600",
        icon: XCircle,
      };
    case "need_information":
      return {
        title: "Request More Information",
        description: "Request additional information for this request.",
        buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        icon: AlertCircle,
      };
  }
};

export function ActionDialog({
  open,
  onClose,
  actionType,
  businessId,
  businessName,
  applicantName,
  onSuccess,
}: ActionDialogProps) {
  const [remark, setRemark] = useState("");
  const actionConfig = getActionConfig(actionType);
  const ActionIcon = actionConfig?.icon;

  const updateBusiness = useMutation({
    ...v1ActionsBusinessUpdateMutation(),
    onSuccess: () => {
      toast.success(
        `Request has been ${actionType.replace("_", " ")}d successfully.`
      );
      setRemark("");
      onClose();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!remark.trim()) {
      toast.error("Please provide a remark before submitting.");
      return;
    }
    updateBusiness.mutate({
      path: { business_id: businessId },
      body: { action: actionType, remark },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {ActionIcon && <ActionIcon className="h-5 w-5" />}
            {actionConfig?.title}
          </DialogTitle>
          <DialogDescription>{actionConfig?.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <div className="font-medium">{businessName}</div>
            <div className="text-sm text-muted-foreground">{applicantName}</div>
          </div>

          <div className="space-y-2">
            <Label required htmlFor="remark">
              Remark
            </Label>
            <Textarea
              id="remark"
              placeholder="Enter your remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="min-h-[100px]"
              disabled={updateBusiness.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateBusiness.isPending}
          >
            Cancel
          </Button>
          <Button
            className={actionConfig?.buttonColor}
            onClick={handleSubmit}
            disabled={updateBusiness.isPending}
          >
            {updateBusiness.isPending ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4 mr-2" />
            ) : (
              ActionIcon && <ActionIcon className="h-4 w-4 mr-1" />
            )}
            {updateBusiness.isPending ? "Submitting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
