import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

type Period = "A.M." | "P.M.";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(h: number, m: number, period: Period) {
  return `${h}:${pad2(m)} ${period}`;
}

function parseTimeString(value?: string | null): {
  hour?: number;
  minute?: number;
  period?: Period;
} {
  if (!value) return {};
  const match = value.match(/^(\d{1,2}):(\d{2})\s+(A\.M\.|P\.M\.)$/);
  if (!match) return {};
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3] as Period;
  if (hour < 1 || hour > 12) return {};
  if (minute < 0 || minute > 59) return {};
  return { hour, minute, period };
}

export type TimeFieldProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number; // defaults to 5
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

/**
 * TimeField (shadcn-styled)
 * - Select hour (1-12), minute, and period (A.M./P.M.)
 * - Emits a formatted string like "9:00 A.M."
 */
export function TimeField({
  id,
  label,
  value,
  onChange,
  minuteStep = 5,
  className,
  placeholder = "Select time",
  required,
  disabled,
  error,
}: TimeFieldProps) {
  const [open, setOpen] = React.useState(false);

  const parsed = React.useMemo(() => parseTimeString(value), [value]);

  const [hour, setHour] = React.useState<number | undefined>(parsed.hour);
  const [minute, setMinute] = React.useState<number | undefined>(parsed.minute);
  const [period, setPeriod] = React.useState<Period | undefined>(parsed.period);

  React.useEffect(() => {
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [parsed.hour, parsed.minute, parsed.period]);

  const hours = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );
  const minutes = React.useMemo(() => {
    const step = Math.min(Math.max(minuteStep, 1), 30);
    const out: number[] = [];
    for (let m = 0; m < 60; m += step) out.push(m);
    return Array.from(new Set(out)).sort((a, b) => a - b);
  }, [minuteStep]);
  const periods: Period[] = ["A.M.", "P.M."];

  function commitIfComplete(next: { h?: number; m?: number; p?: Period }) {
    const h = next.h ?? hour;
    const m = next.m ?? minute;
    const p = next.p ?? period;
    if (h != null && m != null && p != null) {
      onChange(formatTime(h, m, p));
    }
  }

  const display = value || "";
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2">
          <Label htmlFor={id} className="text-sm">
            {label}{" "}
            {required ? <span className="text-destructive">*</span> : null}
          </Label>
        </div>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={open ? `${id}-content` : undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !display && "text-muted-foreground"
            )}
          >
            {display || placeholder}
            <span
              aria-hidden="true"
              className="ml-2 text-muted-foreground select-none"
            >
              ▾
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-content`}
          className="w-[320px] p-3"
          align="start"
          sideOffset={8}
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                className="text-xs font-medium text-muted-foreground"
                htmlFor={id ? `${id}-hour` : undefined}
              >
                Hour
              </Label>
              <Select
                value={hour != null ? String(hour) : ""}
                onValueChange={(v) => {
                  const h = Number(v);
                  setHour(h);
                  commitIfComplete({ h });
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  id={id ? `${id}-hour` : undefined}
                  className="w-full"
                >
                  <SelectValue placeholder="Select hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-xs font-medium text-muted-foreground"
                htmlFor={id ? `${id}-minute` : undefined}
              >
                Minute
              </Label>
              <Select
                value={minute != null ? String(minute) : ""}
                onValueChange={(v) => {
                  const m = Number(v);
                  setMinute(m);
                  commitIfComplete({ m });
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  id={id ? `${id}-minute` : undefined}
                  className="w-full"
                >
                  <SelectValue placeholder="Select minute" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {pad2(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                className="text-xs font-medium text-muted-foreground"
                htmlFor={id ? `${id}-period` : undefined}
              >
                Period
              </Label>
              <Select
                value={period ?? ""}
                onValueChange={(p) => {
                  const next = p as Period;
                  setPeriod(next);
                  commitIfComplete({ p: next });
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  id={id ? `${id}-period` : undefined}
                  className="w-full"
                >
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setHour(undefined);
                setMinute(undefined);
                setPeriod(undefined);
                onChange("");
              }}
            >
              Clear
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const h = hour ?? 9;
                  const m = minute ?? 0;
                  const p = period ?? "A.M.";
                  setHour(h);
                  setMinute(m);
                  setPeriod(p);
                  onChange(formatTime(h, m, p));
                  setOpen(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>

          {error ? (
            <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
