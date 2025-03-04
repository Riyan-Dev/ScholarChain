"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes"; // Import useTheme
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthService } from "@/services/auth.service"; 
import { redirect } from "next/navigation";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const { theme } = useTheme(); // Get the current theme
  const router = useRouter(); // ✅ Used for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle login
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const credentials: any = { username: email, password: password }; // Assuming username is email

    try {
        await AuthService.login(credentials);
        window.location.href = "/dashboard";
    } catch (error: any) {
        console.log(error.message);
        setError(error.message || "Login failed");
    }
};

  return (
    <div>
    <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-800">
      <div
        className={`relative overflow-hidden w-[768px] max-w-full min-h-[480px] rounded-3xl shadow-lg bg-white dark:bg-gray-900 ${
          isActive ? "active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 ${
            isActive
              ? "translate-x-full opacity-100 z-20 pointer-events-auto"
              : "opacity-0 z-10 pointer-events-none"
          }`}
        >
          <form
            className="h-full flex flex-col items-center justify-center px-10 bg-white dark:bg-gray-900"
            onSubmit={(e) => e.preventDefault()}
          >
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Create Account
            </h1>
            <div className="flex gap-3 my-5">
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              {/* ... other social icons (similarly themed) */}
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              or use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            />
            <button
              className="text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer transition-colors bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 z-20 ${
            isActive
              ? "translate-x-full opacity-0 z-10 pointer-events-none"
              : "translate-x-0 opacity-100 z-20 pointer-events-auto"
          }`}
        >
          <form
            className="h-full flex flex-col items-center justify-center px-10 bg-white dark:bg-gray-900"
            onSubmit={handleLogin}
          >
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Sign In
            </h1>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex gap-3 my-5">
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
                {/* ... other social icons (similarly themed) */}
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                href="#"
                className="border border-gray-300 dark:border-gray-600 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              or use your email password
            </span>
            <input
              type="string"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
            />
            <a href="#" className="text-sm text-gray-700 dark:text-gray-400 my-4">
              Forget Your Password?
            </a>
            <button
              className="text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer transition-colors bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out rounded-l-[150px] z-50 ${
            isActive ? "-translate-x-full rounded-l-none rounded-r-[150px]" : ""
          }`}
        >
          <div
            className={`relative h-full -left-full w-[200%] transition-transform duration-500 ease-in-out  ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            } bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-600 text-white`}
          >
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out ${
                isActive ? "translate-x-0" : "-translate-x-[200%]"
              }`}
            >
              <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Enter your personal details to use all of site features
              </p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>
            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out ${
                isActive ? "translate-x-[200%]" : "translate-x-0"
              }`}
            >
              <h1 className="text-2xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Register with your personal details to use all of site features
              </p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-white/10 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
       
      </div>
      
    </div>
    <div className="absolute bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
    </div>
  );
};


export default LoginPage;







  

  