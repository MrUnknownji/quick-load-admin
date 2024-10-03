"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import LoadingComponent from "./form-components/LoadingComponent";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else {
        console.log("Current user:", user); // For debugging
        const isAdmin = user.type === "admin";
        setIsAuthorized(isAdmin);

        if (!isAdmin) {
          console.log("User type:", user.type); // For debugging
        }
      }
    }
  }, [user, loading, router]);

  if (loading) return <LoadingComponent />;

  if (!isAuthorized) {
    console.log("Access denied. User:", user); // For debugging
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Access Denied
          </h1>
          <p className="text-gray-700">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
