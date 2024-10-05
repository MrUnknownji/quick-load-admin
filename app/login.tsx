import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faLock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { auth, initializeRecaptcha } from "@/firebase/firebaseConfig";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const router = useRouter();
  const { login } = useUser();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const recaptchaId = "recaptcha-container";
    if (!document.getElementById(recaptchaId)) {
      const container = document.createElement("div");
      container.id = recaptchaId;
      document.body.appendChild(container);
    }

    const recaptchaVerifier = initializeRecaptcha(recaptchaId);

    return () => {
      recaptchaVerifier.clear();
      const container = document.getElementById(recaptchaId);
      if (container) {
        container.remove();
      }
    };
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSendOtp = useCallback(async () => {
    try {
      const phoneNumberWithCountryCode = `+91${phoneNumber}`;
      const recaptchaVerifier = initializeRecaptcha("recaptcha-container");
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumberWithCountryCode,
        recaptchaVerifier,
      );
      setVerificationId(confirmationResult.verificationId);
      setShowOtpInput(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
    }
  }, [phoneNumber]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      try {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        const result = await signInWithCredential(auth, credential);
        const firebaseUser = result.user;
        const idToken = await firebaseUser.getIdToken();

        const userData = await login(idToken);
        if (userData && userData.accessToken) {
          localStorage.setItem("accessToken", userData.accessToken);
          localStorage.setItem("refreshToken", userData.refreshToken);
          router.push("/dashboard");
        } else {
          setError("Failed to authenticate. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Invalid OTP or authentication failed. Please try again.");
      }
    },
    [verificationId, otp, login, router],
  );

  const handlePhoneNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      handleSendOtp();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const handlePhoneKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && phoneNumber.length === 10 && !showOtpInput) {
        handleSendOtp();
      }
    };

    const handleOtpKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.length === 6 && showOtpInput) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    const phoneInput = phoneInputRef.current;
    const otpInput = otpInputRef.current;

    if (phoneInput) {
      phoneInput.addEventListener("keydown", handlePhoneKeyDown);
    }

    if (otpInput) {
      otpInput.addEventListener("keydown", handleOtpKeyDown);
    }

    return () => {
      if (phoneInput) {
        phoneInput.removeEventListener("keydown", handlePhoneKeyDown);
      }
      if (otpInput) {
        otpInput.removeEventListener("keydown", handleOtpKeyDown);
      }
    };
  }, [phoneNumber, otp, showOtpInput, handleSendOtp, handleSubmit]);

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
        <form
          onSubmit={showOtpInput ? handleOtpSubmit : handlePhoneNumberSubmit}
        >
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                ref={phoneInputRef}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:border-transparent"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                disabled={showOtpInput}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
              </div>
            </div>
          </div>
          {!showOtpInput && (
            <button
              type="submit"
              className={`w-full font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:ring-opacity-50 transition duration-300 ease-in-out ${
                phoneNumber.length === 10
                  ? "bg-[#3c0b0b] text-white hover:bg-[#4c1b1b]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={phoneNumber.length !== 10}
            >
              Send OTP
            </button>
          )}
          {showOtpInput && (
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  ref={otpInputRef}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:border-transparent"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
          {showOtpInput && (
            <button
              type="submit"
              id="sign-in-button"
              className={`w-full font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c0b0b] focus:ring-opacity-50 transition duration-300 ease-in-out ${
                otp.length === 6
                  ? "bg-[#3c0b0b] text-white hover:bg-[#4c1b1b]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={otp.length !== 6}
            >
              Log In
            </button>
          )}
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
