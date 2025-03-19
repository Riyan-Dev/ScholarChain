/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export interface AdminDash {
    total_donations: number,
    available_funds: number,
    active_loans: number,
    total_applications: number,
}

export async function getAdminDash() {
        const response = await fetch(`${API_BASE_URL}/user/get-dash?`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AuthService.getToken()}`,
                "Content-Type": "application/json",
            },

        });
    
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to fetch admin dashboard: ${errorData}`);
        };

        const dashData: AdminDash = await response.json()
        return dashData
}

