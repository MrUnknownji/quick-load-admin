import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
// import { useUser } from "../hooks/useUser";
// import { apiClient } from "../api/apiClient";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // const response = await apiClient.post("/auth/login", {
      //   username,
      //   password,
      // });
      // const { accessToken, refreshToken } = response.data;

      // Store tokens in localStorage
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);

      // Use the login function from useUser hook
      // const loggedInUser = await login(accessToken);

      // if (loggedInUser) {
      router.push("/dashboard");
      // } else {
      // setError("Failed to login. Please try again.");
      // }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c0b0b] to-[#4c1b1b]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 relative">
            <Image
              src="/images/logo-light.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-[#3c0b0b]">
          Admin Login
        </h1>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#3c0b0b] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4c1b1b] focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
