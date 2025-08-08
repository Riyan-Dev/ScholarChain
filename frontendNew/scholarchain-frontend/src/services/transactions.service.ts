/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export async function getLocalTransactions() {
  const response = await fetch(`${API_BASE_URL}/user/transactions/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to fetch applications: ${errorData}`);
  }

  const data = await response.json();
  return data;
}