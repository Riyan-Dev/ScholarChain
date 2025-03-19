"use client";

import { useState } from "react";
import { submitApplication } from "@/services/user.service";
import { useRouter, useSearchParams } from "next/navigation";
import InternalApplicationFormComponent from "./InternalApplicationFormComponent";
import {defaultFormData} from "./InternalApplicationFormComponent";


export default function ApplicationFormPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [onSubmitResult, setOnSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    // Use your defaultFormData to match the FormData interface
    const initialData = defaultFormData;
    
    const handleSubmit = async (data: typeof defaultFormData) => {
        const result = await submitApplication(data);
        setOnSubmitResult(result);
        return result; // Add type assertion
    };

    return <InternalApplicationFormComponent
        initialData={initialData}
        onSubmit={handleSubmit}
    />;
}