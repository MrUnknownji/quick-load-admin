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
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.log("No access token found");
        router.replace("/");
        return;
      }

      if (!user) {
        console.log("No user found");
        router.replace("/");
      } else {
        console.log("Current user:", user);
        // const isAdmin = user.type === "admin";
        const isAdmin = true;
        setIsAuthorized(isAdmin && !!accessToken);

        if (!isAdmin) {
          console.log("User type:", user.type);
        }
      }
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingComponent />
      </div>
    );

  if (!isAuthorized) {
    console.log("Access denied. User:", user);
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
