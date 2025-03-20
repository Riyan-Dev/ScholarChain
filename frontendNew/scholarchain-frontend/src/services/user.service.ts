/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { commaSplitString } from "@/helpers/helpers";
import { User } from "@/lib/types";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;



export async function uploadDocuments(
  uploadedDocuments: Record<string, File>
): Promise<any> {
  const res1 = await fetch(`${API_BASE_URL}/user/set-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });
  if (!res1.ok) {
    throw new Error(`HTTP error! Status: ${res1.status}`);
  }
  const formData = new FormData();

  // Append each file under the key "files"
  Object.values(uploadedDocuments).forEach((file) => {
    formData.append("files", file);
  });

  // Append the IDs as a comma-separated string
  const ids = Object.keys(uploadedDocuments).join(",");
  formData.append("ids", ids);

  // Make the POST request to the endpoint
  const response = await fetch(`${API_BASE_URL}/user/upload-documents`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });

  if (!response.ok) {
    // Optionally, extract error details before throwing
    const errorData = await response.text();
    throw new Error(`Upload failed: ${errorData}`);
  }

  return response.json();
}

export const fetchDocumentStatus = async () => {
  const res = await fetch(`${API_BASE_URL}/user/documents-status`, {
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

export const fetchDash = async () => {
  const res = await fetch(`${API_BASE_URL}/user/get-dash`, {
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

export const applicationOverview = async () => {
  const res = await fetch(`${API_BASE_URL}/application/application-overview`, {
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

export const fetchApplication = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const params = new URLSearchParams({
    application_id: id,
  });
  const res = await fetch(
    `${API_BASE_URL}/application/get-by-id/?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

export const fetchPlan = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const params = new URLSearchParams({
    application_id: id,
  });
  const res = await fetch(
    `${API_BASE_URL}/application/get-plan/?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};


export const submitApplication = async (formData: any) => {
  formData.status = "submitted";
  // formData.financial_info.other_income_sources = commaSplitString(
  //   formData.financial_info.other_income_sources
  // );
  // formData.financial_info.outstanding_loans_or_debts = commaSplitString(
  //   formData.financial_info.outstanding_loans_or_debts
  // );
  // formData.academic_info.achievements_or_awards = commaSplitString(
  //   formData.academic_info.achievements_or_awards
  // );
  const res = await fetch(`${API_BASE_URL}/application/submit/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    return { message: "Failed to submit application", success: false };
  }
  return res.json();
};

export const updateStage = async (stage: string) => {
  const res = await fetch(`${API_BASE_URL}/application/update-stage/${stage}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  return res.json();
};

export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/get-all-users`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch applications: ${errorData}`);
    };

    const data: User[] = await response.json();
    return data;
}

export async function getChatResponse(query: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/rag/chat`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch applications: ${errorData}`);
    };

    const data = await response.json();
    return data["response"];
}

export async function updateStore() {
    const response = await fetch(`${API_BASE_URL}/rag/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${AuthService.getToken()}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch applications: ${errorData}`);
    };

    const data = await response.json();
    return data
}

export async function getUserDetails(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AuthService.getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return res.json();
}