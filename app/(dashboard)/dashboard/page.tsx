import React from "react";
import DashboardCard from "./components/DashboardCard";
import { DashboardCardsData } from "@/utils/dummyData";

const Dashboard: React.FC = () => {
  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold mb-6 animate-slideUp">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DashboardCardsData.map((stat, index) => (
          <div
            key={index}
            className="animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <DashboardCard {...stat} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
