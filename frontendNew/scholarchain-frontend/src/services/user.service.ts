/* eslint-disable prettier/prettier */
import config from "@/config/config";
import { AuthService } from "@/services/auth.service";

const API_BASE_URL = config.fastApi.baseUrl;

export async function uploadDocuments(
  uploadedDocuments: Record<string, File>
): Promise<any> {
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
