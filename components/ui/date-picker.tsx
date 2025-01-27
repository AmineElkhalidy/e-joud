"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithPresetsProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const DatePickerWithPresets = ({
  selectedDate,
  onDateChange,
}: DatePickerWithPresetsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date || null);
    setIsOpen(false); // Close popover after selection
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        {/* Calendar */}
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={selectedDate!}
            onSelect={handleDateSelect}
            className="p-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
