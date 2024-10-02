import React from "react";
import { LineChart } from "lucide-react";
import { DashboardCardProps } from "@/types/types";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const isPositive = change.includes("Up");
  const [percentage, direction, , timePeriod] = change.split(" ");

  const getColorValue = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-100": "#DBEAFE",
      "bg-yellow-100": "#FEF3C7",
      "bg-green-100": "#D1FAE5",
      "bg-red-100": "#FEE2E2",
    };
    return colorMap[colorClass] || colorClass;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col space-y-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:transform hover:scale-105 group">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
          {title}
        </h3>
        <div
          className="p-3 rounded-full transition-transform duration-300 group-hover:rotate-12"
          style={{ backgroundColor: getColorValue(color) }}
        >
          <Icon size={28} />
        </div>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <div className="flex items-center space-x-1">
        <LineChart
          size={16}
          className={`${isPositive ? "text-green-500" : "text-red-500"} transition-transform duration-300 group-hover:scale-110`}
          style={{ transform: isPositive ? "rotate(0deg)" : "rotate(180deg)" }}
        />
        <p className="text-sm">
          <span
            className={`${isPositive ? "text-green-500" : "text-red-500"} font-semibold`}
          >
            {percentage}
          </span>{" "}
          {direction} from{" "}
          <span
            className={`${isPositive ? "text-green-500" : "text-red-500"} font-semibold`}
          >
            {timePeriod}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
