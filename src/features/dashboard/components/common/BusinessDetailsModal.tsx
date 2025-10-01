import BusinessPage from "@/components/pages/BusinessPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // <-- use your styled wrapper instead of raw radix
import type { BusinessDetailsSchema } from "@/services/api/gen";

interface BusinessDetailsModalProps {
  business: BusinessDetailsSchema;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessDetailsModal({
  business,
  isOpen,
  onClose,
}: BusinessDetailsModalProps) {
  if (!business) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full min-w-screen h-screen m-0 rounded-none p-0">
        <DialogHeader className="border-b py-4 px-6">
          <DialogTitle className="text-2xl font-bold">
            Business Details
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {/* leave space for header height */}
          <BusinessPage data={business} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
