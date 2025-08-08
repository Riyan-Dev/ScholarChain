/* eslint-disable prettier/prettier */
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type MonthYearPickerProps = {
    value?: Date | undefined
    onChange?: (date: Date) => void
    className?: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function MonthYearPicker({ value, onChange, className }: MonthYearPickerProps) {
    const [date, setDate] = React.useState(value || new Date())
    const [open, setOpen] = React.useState(false)

    // Get the current view year
    console.log(value)
    const [viewYear, setViewYear] = React.useState(date.getFullYear())
    // Update internal state when value changes
    React.useEffect(() => {
        if (value) {
            setDate(value)
            setViewYear(value.getFullYear())
        }
    }, [value])

    // Handle month selection
    const handleSelectMonth = (monthIndex: number) => {
        const newDate = new Date(date)
        newDate.setMonth(monthIndex)
        newDate.setFullYear(viewYear)
        setDate(newDate)
        onChange?.(newDate)
        setOpen(false)
    }

    // Navigate to previous year
    const handlePreviousYear = () => {
        setViewYear(viewYear - 1)
    }

    // Navigate to next year
    const handleNextYear = () => {
        setViewYear(viewYear + 1)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        <span>
                            {MONTHS[date.getMonth()]} {date.getFullYear()}
                        </span>
                    ) : (
                        <span>Pick a month</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="space-y-4 p-3">
                    <div className="flex items-center justify-between">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousYear}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous Year</span>
                        </Button>
                        <div className="font-medium">{viewYear}</div>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextYear}>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next Year</span>
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((month, index) => {
                            const isSelected = date.getMonth() === index && date.getFullYear() === viewYear

                            return (
                                <Button
                                    key={month}
                                    variant={isSelected ? "default" : "outline"}
                                    className={cn("h-9", isSelected && "bg-primary text-primary-foreground")}
                                    onClick={() => handleSelectMonth(index)}
                                >
                                    {month}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

