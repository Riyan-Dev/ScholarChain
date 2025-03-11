/* eslint-disable prettier/prettier */
// lib/auth.service.ts
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
// import { UserCredential, UserData } from '@/types';
import config from "@/config/config";

const TOKEN_KEY = config.jwtSecret;
const API_BASE_URL = config.fastApi.baseUrl;

interface DecodedToken extends JwtPayload {
  username: string;
  role: string;
}

export const AuthService = {
  login: async (credentials: { username: string; password: string }) => {
    if (!credentials.username || !credentials.password) {
      throw new Error("Username and password are required");
    }
      console.log(credentials)

    const formBody = new URLSearchParams();
    formBody.append("username", credentials.username);
    formBody.append("password", credentials.password);
    formBody.append("grant_type", "password"); // Required by OAuth2PasswordRequestForm
    formBody.append("scope", ""); // Required but can be empty
    formBody.append("client_id", ""); // Optional
    formBody.append("client_secret", ""); // Optional

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      AuthService.setToken(data.access_token);
      return data;
    } catch (error: any) {
      console.error("Login Error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  },

  signup: async (userData: any) => {
    // ... (rest of signup function remains the same)
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        // FULL URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
      const credentials: any = { username: userData.username, password: userData.hashed_password }
      console.log(credentials)

      await AuthService.login(credentials)
      const data = await response.json();
      return data; // Return any data from the signup (e.g., success message)
    } catch (error: any) {
      console.error("Signup Error:", error); // More detailed error
      throw new Error(error.message || "Signup failed"); // Ensure error is re-thrown
    }
  },

  // --- Store Token in Cookie (using js-cookie) ---
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 1, // Expires in 1 day (adjust as needed)
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // CSRF protection
      path: "/", // Available on all paths
    });
  },

  // --- Get Token from Cookie (using js-cookie) ---
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  // --- Remove Token (Logout - using js-cookie) ---
  removeToken: () => {
    Cookies.remove(TOKEN_KEY, { path: "/" }); // Important:  Specify path for consistent removal
  },

  // --- Check if User is Authenticated ---
  isAuthenticated: (): boolean => {
    const token = AuthService.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      // Check for token expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        AuthService.removeToken(); // Remove expired token
        return false;
      }
      return true; // Token exists and is valid
    } catch (error) {
      console.error("Token Decode Error", error);
      return false; // Token is invalid (e.g., malformed)
    }
  },

  // --- Get User Information (from the token) ---
  getUserInfo: (): { username: string; role: string } | null => {
    const token = AuthService.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Check expiration here as well, to be thorough
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        AuthService.removeToken();
        return null;
      }

      return { username: decoded.username, role: decoded.role };
    } catch (error) {
      console.error("Token Decode Error", error);
      return null;
    }
  },

  // --- Get Username ---
  getUsername: (): string | null => {
    const userInfo = AuthService.getUserInfo();
    return userInfo ? userInfo.username : null;
  },

  // --- Get User Role ---
  getUserRole: (): string | null => {
    const userInfo = AuthService.getUserInfo();
    return userInfo ? userInfo.role : null;
  },
};
