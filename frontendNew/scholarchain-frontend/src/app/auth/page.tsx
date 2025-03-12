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
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleRouting = () => {
    const userRole = AuthService.getUserRole();
    if (userRole === "applicant") window.location.href = "/dashboard";
    else if (userRole === "donator") window.location.href = "/donor";
  };
  // ✅ Handle login
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const credentials: any = { username: username, password: password }; // Assuming username is email

    try {
      await AuthService.login(credentials);
      handleRouting();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message || "Login failed");
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const details: any = {
      name: name,
      username: username,
      email: email,
      hashed_password: password,
      role: role,
    }; // Assuming username is email

    try {
      await AuthService.signup(details);
      handleRouting();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message || "Login failed");
    }
  };

  return (
    <div>
      <div className="flex min-h-screen items-center justify-center bg-gray-200 dark:bg-gray-800">
        <div
          className={`relative min-h-[480px] w-[768px] max-w-full overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-gray-900 ${
            isActive ? "active" : ""
          }`}
        >
          {/* Sign Up Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-500 ease-in-out ${
              isActive
                ? "pointer-events-auto z-20 translate-x-full opacity-100"
                : "pointer-events-none z-10 opacity-0"
            }`}
          >
            <form
              className="flex h-full flex-col items-center justify-center bg-white px-10 dark:bg-gray-900"
              onSubmit={handleSignup}
            >
              <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Create Account
              </h1>
              <div className="my-5 flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-google-plus-g"></i>
                </a>
                {/* ... other social icons (similarly themed) */}
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
              <span className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                or use your email for registration
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="">Select Role</option>
                <option value="donator">Donator</option>
                <option value="applicant">Applicant</option>
              </select>
              <button className="mt-3 cursor-pointer rounded-lg bg-gray-600 px-11 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700 dark:bg-gray-500 dark:hover:bg-indigo-600">
                Sign Up
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div
            className={`absolute top-0 left-0 z-20 h-full w-1/2 transition-all duration-500 ease-in-out ${
              isActive
                ? "pointer-events-none z-10 translate-x-full opacity-0"
                : "pointer-events-auto z-20 translate-x-0 opacity-100"
            }`}
          >
            <form
              className="flex h-full flex-col items-center justify-center bg-white px-10 dark:bg-gray-900"
              onSubmit={handleLogin}
            >
              <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                Sign In
              </h1>
              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
              <div className="my-5 flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-google-plus-g"></i>
                </a>
                {/* ... other social icons (similarly themed) */}
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
              <span className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                or use your username password
              </span>
              <input
                type="string"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <a
                href="#"
                className="my-4 text-sm text-gray-700 dark:text-gray-400"
              >
                Forget Your Password?
              </a>
              <button className="mt-3 cursor-pointer rounded-lg bg-gray-600 px-11 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-indigo-700 dark:bg-gray-500 dark:hover:bg-indigo-600">
                Sign In
              </button>
            </form>
          </div>

          {/* Toggle Container */}
          <div
            className={`absolute top-0 left-1/2 z-50 h-full w-1/2 overflow-hidden rounded-l-[150px] transition-all duration-500 ease-in-out ${
              isActive
                ? "-translate-x-full rounded-l-none rounded-r-[150px]"
                : ""
            }`}
          >
            <div
              className={`relative -left-full h-full w-[200%] transition-transform duration-500 ease-in-out ${
                isActive ? "translate-x-1/2" : "translate-x-0"
              } dark: bg-gradient-to-r from-gray-600 to-gray-800 text-white`}
            >
              <div
                className={`absolute flex h-full w-1/2 flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out ${
                  isActive ? "translate-x-0" : "-translate-x-[200%]"
                }`}
              >
                <h1 className="mb-4 text-2xl font-bold">Welcome Back!</h1>
                <p className="my-5 text-sm leading-5 tracking-wide">
                  Enter your personal details to use all of site features
                </p>
                <button
                  onClick={() => setIsActive(false)}
                  className="mt-3 cursor-pointer rounded-lg border border-white bg-transparent px-11 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-white/10"
                >
                  Sign In
                </button>
              </div>
              <div
                className={`absolute right-0 flex h-full w-1/2 flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out ${
                  isActive ? "translate-x-[200%]" : "translate-x-0"
                }`}
              >
                <h1 className="mb-4 text-2xl font-bold">Hello, Friend!</h1>
                <p className="my-5 text-sm leading-5 tracking-wide">
                  Register with your personal details to use all of site
                  features
                </p>
                <button
                  onClick={() => setIsActive(true)}
                  className="mt-3 cursor-pointer rounded-lg border border-white bg-transparent px-11 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-white/10"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LoginPage;
