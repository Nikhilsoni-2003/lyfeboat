"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

// - Supports options/value as strings OR objects.
// - labelKey/valueKey or getOptionLabel/getOptionValue map arbitrary shapes.
// - Adds "creatable" flow: onCreateOption returns new option (with id), onOptionsChange updates options.
// - Keeps improved a11y/keyboard UX and does not add new colors.

type AnyOption = string | Record<string, any>;

interface MultiSelectProps<T extends AnyOption> {
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  className?: string;
  inputId?: string;
  ariaLabel?: string;
  labelKey?: string;
  valueKey?: string;
  getOptionLabel?: (opt: T) => string;
  getOptionValue?: (opt: T) => string | number;
  creatable?: boolean;
  onCreateOption?: (label: string) => Promise<T> | T;
  onOptionsChange?: (next: T[]) => void;
}

export function MultiSelect<T extends AnyOption>({
  options,
  value,
  onChange,
  placeholder = "Search options...",
  className,
  inputId,
  ariaLabel,
  labelKey = "label",
  valueKey = "value",
  getOptionLabel,
  getOptionValue,
  creatable,
  onCreateOption,
  onOptionsChange,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const listboxId = useId();
  const optionId = (idx: number) => `${listboxId}-option-${idx}`;

  const toLabel = useCallback(
    (opt: T): string => {
      if (typeof opt === "string") return opt;
      if (getOptionLabel) return getOptionLabel(opt);
      const lk = (opt as any)?.[labelKey];
      return lk == null ? "" : String(lk);
    },
    [getOptionLabel, labelKey]
  );

  const toValue = useCallback(
    (opt: T): string | number => {
      if (typeof opt === "string") return opt;
      if (getOptionValue) return getOptionValue(opt);
      const vk = (opt as any)?.[valueKey];
      // Fallback to label if no valueKey present
      return vk == null ? toLabel(opt) : (vk as any);
    },
    [getOptionValue, valueKey, toLabel]
  );

  const eqByValue = useCallback(
    (a: T, b: T) => {
      const va = toValue(a);
      const vb = toValue(b);
      return va === vb;
    },
    [toValue]
  );

  const selectedHas = useCallback(
    (opt: T) => value.some((v) => eqByValue(v, opt)),
    [value, eqByValue]
  );

  const filteredOptions = options.filter((opt) => {
    const label = toLabel(opt);
    const matches = label.toLowerCase().includes(searchTerm.toLowerCase());
    return matches && !selectedHas(opt);
  });

  const highlightMatch = useCallback((text: string, query: string) => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    const before = text.slice(0, i);
    const match = text.slice(i, i + query.length);
    const after = text.slice(i + query.length);
    return (
      <>
        {before}
        <span className="font-medium">{match}</span>
        {after}
      </>
    );
  }, []);

  const handleSelect = (option: T) => {
    if (!selectedHas(option)) {
      onChange([...value, option]);
    }
    setSearchTerm("");
    setActiveIndex(-1);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleRemove = (option: T) => {
    onChange(value.filter((item) => !eqByValue(item, option)));
    inputRef.current?.focus();
  };

  const handleClearAll = () => {
    if (value.length > 0) onChange([]);
    inputRef.current?.focus();
  };

  // Creatable helpers
  const existingLabelEquals = useCallback(
    (label: string) =>
      options.some(
        (opt) =>
          toLabel(opt).trim().toLowerCase() === label.trim().toLowerCase()
      ),
    [options, toLabel]
  );

  const canCreate = !!(
    searchTerm.trim() &&
    (creatable || onCreateOption) &&
    !existingLabelEquals(searchTerm)
  );

  const doCreate = async () => {
    const label = searchTerm.trim();
    if (!label) return;
    try {
      setIsCreating(true);
      let created: T;
      if (onCreateOption) {
        created = await onCreateOption(label);
      } else {
        // If no backend provided:
        // - For strings: create the raw string
        // - For objects: best-effort using labelKey/valueKey
        created = (
          typeof (options?.[0] as any) === "string" ||
          (value.length > 0 && typeof (value?.[0] as any) === "string")
            ? (label as any)
            : ({ [labelKey]: label } as any)
        ) as T;
      }

      // Append to options so it behaves like others (with id if provided by backend)
      onOptionsChange?.([...options, created]);
      // Select it
      onChange([...value, created]);
      setSearchTerm("");
      setActiveIndex(-1);
      setIsOpen(true);
      inputRef.current?.focus();
    } finally {
      setIsCreating(false);
    }
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      setActiveIndex(0);
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        if (filteredOptions.length > 0) {
          setIsOpen(true);
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          e.preventDefault();
        }
        break;
      }
      case "ArrowUp": {
        if (filteredOptions.length > 0) {
          setIsOpen(true);
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          e.preventDefault();
        }
        break;
      }
      case "Enter": {
        if (isOpen) {
          if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
            handleSelect(filteredOptions[activeIndex]);
            e.preventDefault();
          } else if (canCreate) {
            // Create when no option is actively selected
            doCreate();
            e.preventDefault();
          }
        }
        break;
      }
      case "Escape": {
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      }
      case "Backspace": {
        if (searchTerm === "" && value.length > 0) {
          onChange(value.slice(0, -1));
          e.preventDefault();
        }
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <div className="flex flex-wrap gap-1 mb-1 max-h-24 overflow-y-auto pr-6">
          {value.map((item) => {
            const label = toLabel(item);
            const key = String(toValue(item));
            return (
              <Badge
                key={key}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {label}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-0.5 h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  aria-label={`Remove ${label}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id={inputId}
            type="text"
            role="searchbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={isOpen}
            aria-label={ariaLabel}
            placeholder={value.length === 0 ? placeholder : ""}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={onKeyDown}
            className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
          />

          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              aria-label="Clear all selected items"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
              inputRef.current?.focus();
            }}
            aria-label={isOpen ? "Close options" : "Open options"}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Options */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Options"
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 && !canCreate ? (
            <div className="px-3 py-2 text-sm text-muted-foreground select-none">
              No results
            </div>
          ) : (
            <>
              {filteredOptions.map((opt, idx) => {
                const label = toLabel(opt);
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={String(toValue(opt))}
                    id={optionId(idx)}
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer flex items-center justify-between",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} // keep input focused
                    onClick={() => handleSelect(opt)}
                  >
                    <div className="truncate">
                      {highlightMatch(label, searchTerm)}
                    </div>
                    {isActive && <Check className="h-4 w-4 opacity-70" />}
                  </div>
                );
              })}

              {canCreate && (
                <div
                  role="option"
                  aria-selected={false}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer flex items-center gap-2",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => doCreate()}
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    Create{" "}
                    <span className="font-medium">
                      {'"'}
                      {searchTerm}
                      {'"'}
                    </span>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
