import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface SocialMediaLink {
  platform: string;
  url: string;
}

interface SocialMediaSelectProps {
  value: SocialMediaLink[];
  onChange: (value: SocialMediaLink[]) => void;
}

const socialPlatforms = [
  "Instagram",
  "Twitter",
  "LinkedIn",
  "Facebook",
  "YouTube",
  "Other",
];

export function SocialMediaSelect({ value, onChange }: SocialMediaSelectProps) {
  const [newPlatform, setNewPlatform] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      toast.error("Invalid URL");
      return false;
    }
  };

  const handleAdd = () => {
    if (newPlatform && isValidUrl(newUrl)) {
      const platformToSave =
        newPlatform === "Other"
          ? customPlatform.trim() || "Other"
          : newPlatform;

      onChange([...value, { platform: platformToSave, url: newUrl }]);
      setNewPlatform("");
      setCustomPlatform("");
      setNewUrl("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((link, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between px-3">
                <div className="flex-1">
                  <span className="font-medium">{link.platform}</span>
                  <p className="text-sm text-muted-foreground truncate">
                    {link.url}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform */}
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newPlatform}
                onValueChange={(val) => {
                  setNewPlatform(val);
                  if (val !== "Other") setCustomPlatform("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem
                      key={platform}
                      value={platform}
                      disabled={
                        platform !== "Other" &&
                        value.some((link) => link.platform === platform)
                      }
                    >
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newPlatform === "Other" && <div></div>}
            {newPlatform === "Other" && (
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input
                  type="text"
                  placeholder="Enter custom platform (e.g., TikTok)"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                />
              </div>
            )}
            {/* URL */}
            <div className="space-y-2">
              <Label required>URL</Label>
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/profile"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newPlatform || !newUrl}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Social Media Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
