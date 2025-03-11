/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export interface BuyTokensResponse {
    message: string;
    new_balance?: number;
    error?: string;
}

export async function buyTokens(amount: number): Promise<BuyTokensResponse> {
    const token = AuthService.getToken();

    if (!token) {
        return { message: "User not authenticated", error: "User not authenticated" };
    }

    const url = `${API_BASE_URL}/donator/buy-tokens/?amount=${amount}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: "",
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                message: "Failed to buy tokens",
                error: errorData.detail || `HTTP Error: ${response.status}`,
            };
        }

        const data: BuyTokensResponse = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error during buyTokens:", error);
        return { message: `Network error: ${error.message}`, error: `Network error: ${error.message}` };
    }
}