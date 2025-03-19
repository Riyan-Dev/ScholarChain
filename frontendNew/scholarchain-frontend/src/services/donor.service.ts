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
                "Content-Type": "application/json",
                Authorization: `Bearer ${AuthService.getToken()}`,
                Accept: "application/json",

            },
            body: JSON.stringify({nothing: ""})
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

export interface DonateTokensResponse {
    message: string;
    transaction_hash?: string;
    status?: string;
    error?: string;
}

export async function donateTokens(amount: number, transaction_hash: string): Promise<DonateTokensResponse> {
    const token = AuthService.getToken();

    if (!token) {
        return { message: "User not authenticated", error: "User not authenticated" };
    }

    const url = `${API_BASE_URL}/donator/donate/?amount=${amount}`;
    const body = JSON.stringify({
        transaction_hash: transaction_hash,
        status: "success"
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                message: "Failed to donate tokens",
                error: errorData.detail || `HTTP error: ${response.status}`,
            };
        }

        const data: DonateTokensResponse = await response.json();
        return data;

    } catch (error: any) {
        console.error("Error during donateTokens:", error);
        return { message: `Network error: ${error.message}`, error: error.message };
    }
}