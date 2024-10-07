"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import AuthWrapper from "@/components/withAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarExpanded(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          expanded={sidebarExpanded}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          currentPath={pathname}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthWrapper>
  );
}
