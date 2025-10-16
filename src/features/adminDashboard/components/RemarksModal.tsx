import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  ApprovalStatusFe1Enum,
  BusinessAdminListAction,
} from "@/services/api/gen";
import { Clock, MessageSquare, User } from "lucide-react";
import { useState } from "react";

interface RemarksModalProps {
  remarks: Array<BusinessAdminListAction>;
  itemId: string;
  getStatusBadge: (action: ApprovalStatusFe1Enum) => React.ReactNode;
  formatDate: (date: string) => string;
}

export function RemarksModal({
  remarks,
  itemId,
  getStatusBadge,
  formatDate,
}: RemarksModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          {remarks.length} {remarks.length === 1 ? "Remark" : "Remarks"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Remarks Timeline ({remarks.length})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {remarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No remarks available</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                {remarks.map((remark, index) => (
                  <div
                    key={index}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(remark.action)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(remark.created_at)}
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-3">
                        <p className="text-sm text-foreground leading-relaxed break-words">
                          {remark.remark}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>
                          {remark.added_by_first_name}{" "}
                          {remark.added_by_last_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
