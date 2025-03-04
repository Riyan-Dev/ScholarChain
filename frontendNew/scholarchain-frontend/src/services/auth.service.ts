// lib/auth.service.ts
import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from "jwt-decode";

const TOKEN_KEY = 'auth_token';

interface DecodedToken extends JwtPayload {
    username: string;
    role: string;
}

export const AuthService = {
    // --- Login (assuming you have an API endpoint) ---
    login: async (credentials: any) => { // Replace any
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
				const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed'); // Provide specific error messages
            }

            const data = await response.json();
            AuthService.setToken(data.token); // Store the token
			return data
        } catch (error: any) {
            console.error("Login Error:", error.message);
			throw new Error(error.message || "Login failed");
        }
    },

    // --- Signup (assuming you have an API endpoint) ---
    signup: async (userData: any) => { // Replace 'any' with a proper type
        try{
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Signup failed');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
			console.error("Signup Error:", error); // More detailed error
			throw new Error(error.message || "Signup failed"); // Ensure error is re-thrown
		}

    },

    // --- Store Token in Cookie ---
    setToken: (token: string) => {
        cookies().set(TOKEN_KEY, token, {
            httpOnly: true,   // Important for security
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // CSRF protection
            path: '/',         // Available on all paths
            maxAge: 60 * 60 * 24,       // Expires in 1 day (adjust as needed), in seconds
        });
    },

    // --- Get Token from Cookie ---
    getToken: (): string | undefined => {
        return cookies().get(TOKEN_KEY)?.value;
    },

    // --- Remove Token (Logout) ---
    removeToken: () => {
        cookies().delete(TOKEN_KEY);
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
            console.error("Token Decode Error", error)
            return false; // Token is invalid (e.g., malformed)
        }
    },

    // --- Get User Information (from the token) ---
    getUserInfo: (): { username: string; role: string } | null => {
        const token = AuthService.getToken();
        if (!token) {
            return null;
        }
        try{
            const decoded: DecodedToken = jwtDecode(token);

            // Check expiration here as well, to be thorough
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                AuthService.removeToken();
                return null;
            }

            return { username: decoded.username, role: decoded.role };
        } catch(error) {
            console.error("Token Decode Error", error);
            return null
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