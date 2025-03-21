/* eslint-disable prettier/prettier */
"use client";

import { useState, useCallback, useEffect } from "react";
import { PlusCircle, Trash2, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchApplication, submitApplication } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

interface Reference {
  name: string;
  designation: string;
  contact_details: string;
  comments: string;
}

interface FormData {
  personal_info: {
    full_name: string;
    dob: string | undefined;
    gender: string;
    nationality: string;
    marital_status: string;
    phone_number: string;
    email_address: string;
    residential_address: string;
    permanent_address: string;
  };
  financial_info: {
    total_family_income: string;
    other_income_sources: string;
    outstanding_loans_or_debts: string;
  };
  academic_info: {
    current_education_level: string;
    college_or_university: string;
    student_id: string;
    program_name_degree: string;
    duration_of_course: string;
    year_or_semester: string;
    gpa: string;
    achievements_or_awards: string[];
  };
  loan_details: {
    loan_amount_requested: string;
    purpose_of_loan: string;
    proposed_repayment_period: string;
    preferred_repayment_frequency: string;
  };
  references: Reference[];
  declaration: string;
  signature: string;
}

interface ApplicationFormComponentProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<{ success: boolean; message: string }>;
}

const defaultFormData: FormData = {
  personal_info: {
    full_name: "",
    dob: undefined,
    gender: "",
    nationality: "",
    marital_status: "",
    phone_number: "",
    email_address: "",
    residential_address: "",
    permanent_address: "",
  },
  financial_info: {
    total_family_income: "",
    other_income_sources: "",
    outstanding_loans_or_debts: "",
  },
  academic_info: {
    current_education_level: "",
    college_or_university: "",
    student_id: "",
    program_name_degree: "",
    duration_of_course: "",
    year_or_semester: "",
    gpa: "",
    achievements_or_awards: [],
  },
  loan_details: {
    loan_amount_requested: "",
    purpose_of_loan: "",
    proposed_repayment_period: "",
    preferred_repayment_frequency: "",
  },
  references: [],
  declaration: "",
  signature: "",
};

export { defaultFormData };

export default function InternalApplicationFormComponent({
  initialData,
  onSubmit,
}: ApplicationFormComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const [formData, setFormData] = useState<FormData>(
    initialData || defaultFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["application_form", id], // Corrected: Query key is an array
    queryFn: fetchApplication, // Make sure this function is defined
    refetchOnWindowFocus: false,
  });

  const [incomeSources, setIncomeSources] = useState<
    { source: string; amount: string }[]
  >([{ source: "", amount: "" }]);
  const [debts, setDebts] = useState<{ description: string; amount: string }[]>(
    [{ description: "", amount: "" }]
  );
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.academic_info.achievements_or_awards) {
      setAchievements(data.academic_info.achievements_or_awards);
    } else {
      setAchievements(defaultFormData.academic_info.achievements_or_awards);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const formattedIncomeSources =
        data.financial_info.other_income_sources.map((item: string) => {
          const [source, amountStr] = item.split(":");

          let sourceCleaned = "";
          let amount = "";

          if (source && amountStr) {
            sourceCleaned = source.trim();
            const amountRegex = /(\d+(,\d+)*(\.\d+)?)/;
            const amountMatch = amountStr.match(amountRegex);
            amount = amountMatch ? amountMatch[0] : "";
          }

          return { source: sourceCleaned, amount: amount };
        });

      const formattedDebts = data.financial_info.outstanding_loans_or_debts.map(
        (item: string) => {
          const [description, amountStr] = item.split(": ");
          const amount = amountStr ? amountStr.replace(/[^\d.]/g, "") : ""; // Extract only number and dot
          return {
            description: description ? description.trim() : "",
            amount: amount,
          };
        }
      );

      setIncomeSources(formattedIncomeSources);
      setDebts(formattedDebts);
      setAchievements(data.academic_info.achievements_or_awards);
      setFormData({
        ...data,
        financial_info: {
          ...data.financial_info,
          other_income_sources: [], // Clear the array
          outstanding_loans_or_debts: [], // Clear the array
        },
      });
    }
    console.log(data);
  }, [data]);

  // const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault(); // Prevent the default form submission
  //   await handleSubmit(formData); // Call the async handleSubmit function
  // };

  const handleAddIncomeSource = useCallback(() => {
    setIncomeSources((prevSources) => [
      ...prevSources,
      { source: "", amount: "" },
    ]);
  }, [setIncomeSources]);

  const handleRemoveIncomeSource = useCallback(
    (index: number) => {
      setIncomeSources((prevSources) =>
        prevSources.filter((_, i) => i !== index)
      );
    },
    [setIncomeSources]
  );

  const handleAddDebt = useCallback(() => {
    setDebts((prevDebts) => [...prevDebts, { description: "", amount: "" }]);
  }, [setDebts]);

  const handleRemoveDebt = useCallback(
    (index: number) => {
      setDebts((prevDebts) => prevDebts.filter((_, i) => i !== index));
    },
    [setDebts]
  );

  const handleIncomeSourceChange = useCallback(
    (index: number, field: "source" | "amount", value: string) => {
      setIncomeSources((prevSources) => {
        const newSources = [...prevSources];
        newSources[index][field] = value;
        return newSources;
      });
    },
    [setIncomeSources]
  );

  const handleDebtChange = useCallback(
    (index: number, field: "description" | "amount", value: string) => {
      setDebts((prevDebts) => {
        const newDebts = [...prevDebts];
        newDebts[index][field] = value;
        return newDebts;
      });
    },
    [setDebts]
  );

  const handleAddAchievement = useCallback(() => {
    setAchievements((prev) => [...prev, ""]);
  }, [setAchievements]);

  const handleRemoveAchievement = useCallback(
    (index: number) => {
      setAchievements((prev) => prev.filter((_, i) => i !== index));
    },
    [setAchievements]
  );

  const handleAchievementChange = useCallback(
    (index: number, value: string) => {
      setAchievements((prev) => {
        const newAchievements = [...prev];
        newAchievements[index] = value;
        return newAchievements;
      });
    },
    [setAchievements]
  );

  // Function to check if all required fields are filled
  const checkFormValidity = useCallback(() => {
    const {
      personal_info,
      financial_info,
      academic_info,
      loan_details,
      declaration,
      signature,
    } = formData;

    const isPersonalInfoValid =
      personal_info.full_name !== "" &&
      personal_info.dob !== undefined &&
      personal_info.gender !== "" &&
      // personal_info.nationality !== "" && // Optional fields
      // personal_info.marital_status !== "" &&
      personal_info.phone_number !== "" &&
      personal_info.email_address !== "" &&
      personal_info.residential_address !== "" && // Added back residential_address
      personal_info.permanent_address !== ""; // Added back permanent_address

    const isFinancialInfoValid =
      incomeSources.some((item) => item.source !== "" && item.amount !== "") &&
      debts.some((item) => item.description !== "" && item.amount !== "");

    const isAcademicInfoValid =
      academic_info.current_education_level !== "" && // Added back current_education_level
      academic_info.college_or_university !== "" && // Added back college_or_university
      academic_info.student_id !== "" && // Added back student_id
      academic_info.program_name_degree !== "" && // Added back program_name_degree
      academic_info.duration_of_course !== "" && // Added back duration_of_course
      academic_info.year_or_semester !== "" && // Added back year_or_semester
      academic_info.gpa !== "";

    const isLoanDetailsValid =
      loan_details.loan_amount_requested !== "" && // Added back loan_amount_requested
      loan_details.purpose_of_loan !== "" && // Added back purpose_of_loan
      loan_details.proposed_repayment_period !== "" && // Added back proposed_repayment_period
      loan_details.preferred_repayment_frequency !== "";

    const isDeclarationValid = declaration !== "";

    const isSignatureValid = signature !== "";

    const isValid =
      isPersonalInfoValid &&
      isFinancialInfoValid &&
      isAcademicInfoValid &&
      isLoanDetailsValid &&
      isDeclarationValid &&
      isSignatureValid &&
      achievements.some((item) => item !== "");
    setIsFormValid(isValid);
  }, [formData, incomeSources, debts, achievements]);

  // Use useEffect to check form validity whenever formData changes
  useEffect(() => {
    checkFormValidity();
  }, [formData, incomeSources, debts, achievements, checkFormValidity]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const keys = name.split(".");

      setFormData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        let temp = updatedData;

        for (let i = 0; i < keys.length - 1; i++) {
          temp = temp[keys[i]];
        }

        const keyOrIndex = keys[keys.length - 1];
        if (Array.isArray(temp)) {
          temp[Number.parseInt(keyOrIndex)] = value;
        } else {
          temp[keyOrIndex] = value;
        }

        return updatedData;
      });
    },
    [setFormData]
  );

  const handleSelectChange = useCallback(
    (value: string, name: string) => {
      const keys = name.split(".");

      setFormData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        let temp = updatedData;

        for (let i = 0; i < keys.length - 1; i++) {
          temp = temp[keys[i]];
        }

        const keyOrIndex = keys[keys.length - 1];
        if (Array.isArray(temp)) {
          temp[Number.parseInt(keyOrIndex)] = value;
        } else {
          temp[keyOrIndex] = value;
        }

        return updatedData;
      });
    },
    [setFormData]
  );

  const handleAddReference = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      references: [
        ...prevData.references,
        { name: "", designation: "", contact_details: "", comments: "" },
      ],
    }));
  }, [setFormData]);

  const handleRemoveReference = useCallback(
    (index: number) => {
      setFormData((prevData) => ({
        ...prevData,
        references: prevData.references.filter((_, i) => i !== index),
      }));
    },
    [setFormData]
  );

  const handleDateChange = useCallback(
    (date: Date | undefined, name: string) => {
      const dateString = date ? format(date, "yyyy-MM-dd") : "";
      const keys = name.split(".");

      setFormData((prevData) => {
        const updatedData = JSON.parse(JSON.stringify(prevData));
        let temp = updatedData;

        for (let i = 0; i < keys.length - 1; i++) {
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = dateString;
        return updatedData;
      });
      setOpen(false);
    },
    [setFormData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format income sources
    const formattedIncomeSources = incomeSources.map(
      (source) => `${source.source}: ${source.amount} PKR per year`
    );

    // Format debts
    const formattedDebts = debts.map(
      (debt) => `${debt.description}: ${debt.amount}`
    );

    const updatedFormData = {
      ...formData,
      financial_info: {
        ...formData.financial_info,
        other_income_sources: formattedIncomeSources,
        outstanding_loans_or_debts: formattedDebts,
      },
      academic_info: {
        ...formData.academic_info,
        achievements_or_awards: achievements,
      },
    };

    try {
      const result = await submitApplication(updatedFormData);

      if (result.success) {
        toast.success(result.message);
        <link>
          href{`/dashboard`};
        </link>
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form", {
        description: String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="w-full">
          <Skeleton className="h-48 w-full" />{" "}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 p-8">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Application Form
        </h1>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Please fill out the form below to apply.
        </p>
      </div>
      <Separator className="my-6" />
      <form onSubmit={handleSubmit} className="space-y-8">
        <Accordion
          type="multiple"
          defaultValue={[
            "personal",
            "financial",
            "academic",
            "loan",
            "references",
            "declaration",
          ]}
          className="w-full"
        >
          <AccordionItem value="personal">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              Personal Information
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="personal_info.full_name"
                    value={formData.personal_info.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.personal_info.dob && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.personal_info.dob ? (
                          <span>
                            {format(
                              new Date(formData.personal_info.dob),
                              "PPP"
                            )}
                          </span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formData.personal_info.dob
                            ? new Date(formData.personal_info.dob)
                            : undefined
                        }
                        onSelect={(date) =>
                          handleDateChange(date, "personal_info.dob")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "personal_info.gender")
                    }
                    defaultValue={formData.personal_info.gender}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    name="personal_info.nationality"
                    value={formData.personal_info.nationality}
                    onChange={handleChange}
                    placeholder="Nationality"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "personal_info.marital_status")
                    }
                    defaultValue={formData.personal_info.marital_status}
                  >
                    <SelectTrigger id="maritalStatus">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="personal_info.phone_number"
                    value={formData.personal_info.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    name="personal_info.email_address"
                    value={formData.personal_info.email_address}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="residentialAddress">
                    Residential Address
                  </Label>
                  <Textarea
                    id="residentialAddress"
                    name="personal_info.residential_address"
                    value={formData.personal_info.residential_address}
                    onChange={handleChange}
                    placeholder="Residential Address"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    name="personal_info.permanent_address"
                    value={formData.personal_info.permanent_address}
                    onChange={handleChange}
                    placeholder="Permanent Address"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="financial">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              Financial Information
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalFamilyIncome">Total Family Income</Label>
                  <Input
                    id="totalFamilyIncome"
                    name="financial_info.total_family_income"
                    value={formData.financial_info.total_family_income}
                    onChange={handleChange}
                    placeholder="Total Family Income"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">Other Income Sources</Label>
                  {incomeSources.map((source, index) => (
                    <Card key={index} className="mb-4 border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <Label
                              className="mb-2"
                              htmlFor={`incomeSource-${index}`}
                            >
                              Source
                            </Label>
                            <Input
                              type="text"
                              id={`incomeSource-${index}`}
                              value={source.source}
                              onChange={(e) =>
                                handleIncomeSourceChange(
                                  index,
                                  "source",
                                  e.target.value
                                )
                              }
                              placeholder="Source of Income"
                            />
                          </div>
                          <div>
                            <Label
                              className="mb-2"
                              htmlFor={`incomeAmount-${index}`}
                            >
                              Amount (PKR)
                            </Label>
                            <Input
                              type="number"
                              id={`incomeAmount-${index}`}
                              value={source.amount}
                              onChange={(e) =>
                                handleIncomeSourceChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveIncomeSource(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Source
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddIncomeSource}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Income Source
                  </Button>
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2">Outstanding Loans or Debts</Label>
                  {debts.map((debt, index) => (
                    <Card key={index} className="mb-4 border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <Label
                              className="mb-2"
                              htmlFor={`debtDescription-${index}`}
                            >
                              Description
                            </Label>
                            <Input
                              type="text"
                              id={`debtDescription-${index}`}
                              value={debt.description}
                              onChange={(e) =>
                                handleDebtChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description of Debt"
                            />
                          </div>
                          <div>
                            <Label
                              className="mb-2"
                              htmlFor={`debtAmount-${index}`}
                            >
                              Amount (PKR)
                            </Label>
                            <Input
                              type="number"
                              id={`debtAmount-${index}`}
                              value={debt.amount}
                              onChange={(e) =>
                                handleDebtChange(
                                  index,
                                  "amount",
                                  e.target.value
                                )
                              }
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveDebt(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Debt
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDebt}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Debt
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="academic">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              Academic Information
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentEducationLevel">
                    Current Education Level
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(
                        value,
                        "academic_info.current_education_level"
                      )
                    }
                    defaultValue={
                      formData.academic_info.current_education_level
                    }
                  >
                    <SelectTrigger id="currentEducationLevel">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelors">
                        Bachelor&apos;s Degree
                      </SelectItem>
                      <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeOrUniversity">
                    College or University
                  </Label>
                  <Input
                    id="collegeOrUniversity"
                    name="academic_info.college_or_university"
                    value={formData.academic_info.college_or_university}
                    onChange={handleChange}
                    placeholder="College or University"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    name="academic_info.student_id"
                    value={formData.academic_info.student_id}
                    onChange={handleChange}
                    placeholder="Student ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programNameDegree">Program Name/Degree</Label>
                  <Input
                    id="programNameDegree"
                    name="academic_info.program_name_degree"
                    value={formData.academic_info.program_name_degree}
                    onChange={handleChange}
                    placeholder="Program Name/Degree"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationOfCourse">Duration Of Course</Label>
                  <Input
                    id="durationOfCourse"
                    name="academic_info.duration_of_course"
                    value={formData.academic_info.duration_of_course}
                    onChange={handleChange}
                    placeholder="Duration Of Course"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOrSemester">Year & Semester</Label>
                  <Input
                    id="yearOrSemester"
                    name="academic_info.year_or_semester"
                    value={formData.academic_info.year_or_semester}
                    onChange={handleChange}
                    placeholder="Year Or Semester"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    name="academic_info.gpa"
                    value={formData.academic_info.gpa}
                    onChange={handleChange}
                    placeholder="GPA"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievementsOrAwards">
                    Achievements or Awards
                  </Label>
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="mb-4 border border-gray-200">
                      <CardContent className="pt-6">
                        <div>
                          <Label
                            className="mb-2"
                            htmlFor={`achievement-${index}`}
                          >
                            Achievement {index + 1}
                          </Label>
                          <Textarea
                            id={`achievement-${index}`}
                            value={achievement}
                            onChange={(e) =>
                              handleAchievementChange(index, e.target.value)
                            }
                            placeholder="Achievement or Award"
                            rows={3}
                          />
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveAchievement(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Achievement
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAchievement}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Achievement
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="loan">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              Loan Details
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loanAmountRequested">
                    Loan Amount Requested
                  </Label>
                  <Input
                    id="loanAmountRequested"
                    name="loan_details.loan_amount_requested"
                    value={formData.loan_details.loan_amount_requested}
                    onChange={handleChange}
                    placeholder="Loan Amount Requested"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purposeOfLoan">Purpose Of Loan</Label>
                  <Input
                    id="purposeOfLoan"
                    name="loan_details.purpose_of_loan"
                    value={formData.loan_details.purpose_of_loan}
                    onChange={handleChange}
                    placeholder="Purpose Of Loan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposedRepaymentPeriod">
                    Proposed Repayment Period
                  </Label>
                  <Input
                    id="proposedRepaymentPeriod"
                    name="loan_details.proposed_repayment_period"
                    value={formData.loan_details.proposed_repayment_period}
                    onChange={handleChange}
                    placeholder="Proposed Repayment Period"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredRepaymentFrequency">
                    Preferred Repayment Frequency
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(
                        value,
                        "loan_details.preferred_repayment_frequency"
                      )
                    }
                    defaultValue={
                      formData.loan_details.preferred_repayment_frequency
                    }
                  >
                    <SelectTrigger id="preferredRepaymentFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="biannually">Biannually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="references">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              References
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="space-y-6">
                {formData.references.map((reference, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`referenceName-${index}`}>Name</Label>
                          <Input
                            id={`referenceName-${index}`}
                            name={`references.${index}.name`}
                            value={reference.name}
                            onChange={handleChange}
                            placeholder="Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`referenceDesignation-${index}`}>
                            Designation
                          </Label>
                          <Input
                            id={`referenceDesignation-${index}`}
                            name={`references.${index}.designation`}
                            value={reference.designation}
                            onChange={handleChange}
                            placeholder="Designation"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`referenceContact-${index}`}>
                            Contact Details
                          </Label>
                          <Input
                            id={`referenceContact-${index}`}
                            name={`references.${index}.contact_details`}
                            value={reference.contact_details}
                            onChange={handleChange}
                            placeholder="Contact Details"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`referenceComments-${index}`}>
                            Comments
                          </Label>
                          <Textarea
                            id={`referenceComments-${index}`}
                            name={`references.${index}.comments`}
                            value={reference.comments}
                            onChange={handleChange}
                            placeholder="Comments"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveReference(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Reference
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddReference}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Reference
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="declaration">
            <AccordionTrigger className="text-lg font-semibold text-indigo-700">
              Declaration and Signature
            </AccordionTrigger>
            <AccordionContent style={{ overflow: "auto" }}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="declaration">Declaration</Label>
                  <Textarea
                    id="declaration"
                    name="declaration"
                    value={formData.declaration}
                    onChange={handleChange}
                    placeholder="I hereby declare that all the information provided is true."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <Input
                    id="signature"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    placeholder="Signature"
                    required
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <motion.div className="flex justify-end" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="bg-indigo-700 px-8 text-white hover:bg-indigo-800 cursor-pointer"
            disabled={isSubmitting || !isFormValid} // Disable if submitting or form is invalid
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
