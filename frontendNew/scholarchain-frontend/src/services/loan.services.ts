import { Loan } from "@/lib/types";
import config from "@/config/config";
import { AuthService } from "./auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export const getLoanData = async (): Promise<Loan> => {
  const res = await fetch(`${API_BASE_URL}/application/get-loan-details/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

export const makeRepayment = async () => {
  const res = await fetch(`${API_BASE_URL}/application/repay/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

export const getAllLoans = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/get-all-loans`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return res.json();
};
