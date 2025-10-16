import getStatusBadge from "@/components/status-badge/getStatusBadge";
import { Card } from "@/components/ui/card";
import type { BusinessList as Business } from "@/services/api/gen";
import { BusinessActions } from "./BusinessActions";

interface Props {
  businesses?: Business[];
  refetch: () => void;
  openDetails: (b: Business) => void;
  openEdit: (b: Business) => void;
  openKyc: (b: Business) => void;
}

export function BusinessList({
  businesses,
  refetch,
  openDetails,
  openEdit,
  openKyc,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 pr-2">
        {businesses?.map((business) => {
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
                        {getStatusBadge(business.approval_status)}
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
                          {business.opening_time} - {business.closing_time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <BusinessActions
                  business={business}
                  refetch={refetch}
                  openDetails={openDetails}
                  openEdit={openEdit}
                  openKyc={openKyc}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
