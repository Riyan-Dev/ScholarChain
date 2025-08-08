import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export async function get_ledger() {
  const res = await fetch(`${API_BASE_URL}/blockchain/`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
}

export async function getBlockChainTransactions() {
  const response = await fetch(`${API_BASE_URL}/blockchain/transactions`, {
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
