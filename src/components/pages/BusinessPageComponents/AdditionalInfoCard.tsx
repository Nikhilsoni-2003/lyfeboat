import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";

type ExtraField = {
  id?: string | number;
  key?: string;
  value?: string;
  children?: ExtraField[];
};

type AdditionalInfoCardProps = {
  extraFields: Array<any>;
};

const ExtraFieldRenderer = ({
  field,
  depth = 0,
}: {
  field: ExtraField;
  depth?: number;
}) => {
  const { key, value, children = [] } = field;
  const marginLeft = depth * 20;

  return (
    <div
      className="mb-3 animate-fade-in"
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Card className="p-4 bg-background border-border hover:shadow-md transition-shadow">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <span className="font-medium text-card-foreground">
              {key || "N/A"}:
            </span>
            <span className="ml-2 text-muted-foreground">{value || "N/A"}</span>
          </div>
        </div>
        {children && children.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-primary/20">
            {children.map((child, index) => (
              <ExtraFieldRenderer
                key={child.id || index}
                field={child}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export const AdditionalInfoCard = ({
  extraFields,
}: AdditionalInfoCardProps) => {
  if (!Array.isArray(extraFields) || extraFields.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary rounded-full">
          <Tag className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Additional Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Extended business details and specifications
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {extraFields.map((field: any, index: number) => (
          <ExtraFieldRenderer key={field.id || index} field={field} />
        ))}
      </div>
    </Card>
  );
};
