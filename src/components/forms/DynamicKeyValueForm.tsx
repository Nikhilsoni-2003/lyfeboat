import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  children: KeyValueItem[];
}

interface DynamicKeyValueProps {
  value: KeyValueItem[];
  onChange: (value: KeyValueItem[]) => void;
  level?: number;
}

export function DynamicKeyValue({
  value = [],
  onChange,
  level = 0,
}: DynamicKeyValueProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const generateId = () =>
    `kv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addItem = () => {
    const newItem: KeyValueItem = {
      id: generateId(),
      key: "",
      value: "",
      children: [],
    };
    onChange([...value, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<KeyValueItem>) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addChildItem = (parentId: string) => {
    const newChild: KeyValueItem = {
      id: generateId(),
      key: "",
      value: "",
      children: [],
    };

    onChange(
      value.map((item) =>
        item.id === parentId
          ? { ...item, children: [...item.children, newChild] }
          : item
      )
    );

    setExpandedItems((prev) => new Set([...prev, parentId]));
  };

  const updateChildItems = (parentId: string, children: KeyValueItem[]) => {
    onChange(
      value.map((item) => (item.id === parentId ? { ...item, children } : item))
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const indentClass = level > 0 ? `ml-${Math.min(level * 4, 16)}` : "";

  return (
    <div className="overflow-x-auto">
      <div className={`space-y-3 min-w-[300px] ${indentClass}`}>
        {value.map((item) => (
          <Card key={item.id} className="relative w-full max-w-[700px]">
            <CardContent>
              <div className="flex flex-col items-start gap-3">
                <div className="w-full flex gap-3">
                  {item.children.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.id)}
                      className="p-1 h-8 w-8 mt-1"
                    >
                      {expandedItems.has(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        value={item.key}
                        onChange={(e) =>
                          updateItem(item.id, { key: e.target.value })
                        }
                        placeholder="Enter key"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={item.value}
                        onChange={(e) =>
                          updateItem(item.id, { value: e.target.value })
                        }
                        placeholder="Enter value"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addChildItem(item.id)}
                      className="h-8 w-8 p-0"
                      title="Add child"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {item.children.length > 0 && expandedItems.has(item.id) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="mb-2">
                    <Label className="text-sm text-muted-foreground">
                      Children (Level {level + 2})
                    </Label>
                  </div>
                  <DynamicKeyValue
                    value={item.children}
                    onChange={(children) => updateChildItems(item.id, children)}
                    level={level + 1}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {level === 0 ? "Key-Value Pair" : "Item"}
        </Button>
      </div>
    </div>
  );
}
