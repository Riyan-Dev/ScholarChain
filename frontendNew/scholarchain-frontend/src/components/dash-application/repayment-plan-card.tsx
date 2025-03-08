"use client";

import { useState } from "react";
import { CreditCard, Calendar, DollarSign, Percent } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ApplicationCard } from "./ui/application-card";
import { CardFooterActions } from "./ui/card-footer-actions";

import { cn } from "@/lib/utils";

interface RepaymentPlanCardProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function RepaymentPlanCard({
  onNext,
  onPrevious,
}: RepaymentPlanCardProps) {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [planType, setPlanType] = useState("fixed");

  // Calculate monthly payment (simplified)
  const interestRate = planType === "fixed" ? 0.05 : 0.035;
  const monthlyInterest = interestRate / 12;
  const monthlyPayment =
    (loanAmount * monthlyInterest) /
    (1 - Math.pow(1 + monthlyInterest, -loanTerm));

  return (
    <ApplicationCard
      title="Repayment Plan"
      description="Choose your preferred repayment options"
      icon={CreditCard}
      footer={
        <CardFooterActions
          onNext={onNext}
          onPrevious={onPrevious}
          nextLabel="Submit Application"
        />
      }
    >
      <div className="space-y-6">
        <SliderControl
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={5000}
          max={50000}
          step={1000}
          formatValue={(val) => `$${val.toLocaleString()}`}
          minLabel="$5,000"
          maxLabel="$50,000"
        />

        <SliderControl
          label="Loan Term"
          value={loanTerm}
          onChange={setLoanTerm}
          min={12}
          max={60}
          step={12}
          formatValue={(val) => `${val} months`}
          minLabel="12 months"
          maxLabel="60 months"
        />

        <div className="space-y-3">
          <Label>Repayment Plan Type</Label>
          <RadioGroup
            value={planType}
            onValueChange={setPlanType}
            className="grid grid-cols-1 gap-3"
          >
            <RadioOption
              id="fixed"
              value="fixed"
              selected={planType === "fixed"}
              title="Fixed Rate Plan"
              description="5.0% interest rate with fixed monthly payments"
            />

            <RadioOption
              id="variable"
              value="variable"
              selected={planType === "variable"}
              title="Variable Rate Plan"
              description="3.5% starting interest rate that may change over time"
            />
          </RadioGroup>
        </div>

        <div className="bg-muted/30 space-y-3 rounded-lg p-4">
          <h3 className="font-medium">Payment Summary</h3>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryItem
              icon={DollarSign}
              label="Monthly Payment"
              value={`$${Math.round(monthlyPayment).toLocaleString()}`}
            />
            <SummaryItem
              icon={Percent}
              label="Interest Rate"
              value={`${(interestRate * 100).toFixed(1)}%`}
            />
            <SummaryItem
              icon={Calendar}
              label="First Payment Due"
              value="Apr 1, 2025"
            />
          </div>
        </div>
      </div>
    </ApplicationCard>
  );
}

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-medium">{formatValue(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values: number[]) => onChange(values[0])}
        className="py-4"
      />
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function RadioOption({
  id,
  value,
  selected,
  title,
  description,
}: {
  id: string;
  value: string;
  selected: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start space-y-0 space-x-3 rounded-md border p-4",
        selected && "border-primary bg-primary/5"
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-1" />
      <div className="space-y-1">
        <Label htmlFor={id} className="font-medium">
          {title}
        </Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background rounded-md p-3">
      <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
