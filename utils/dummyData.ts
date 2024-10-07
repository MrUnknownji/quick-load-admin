import { DashboardCardProps } from "@/types/types";
import { Users, Package, TrendingUp, DollarSign } from "lucide-react";

export const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];
export const products = [
  { id: 1, name: "Product A", price: 19.99, stock: 100 },
  { id: 2, name: "Product B", price: 29.99, stock: 50 },
];

export const DashboardCardsData: DashboardCardProps[] = [
  {
    title: "Total Users",
    value: "1,234",
    change: "8.5% Up from month",
    icon: Users,
    color: "bg-blue-100",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "3.2% Down from month",
    icon: Package,
    color: "bg-yellow-100",
  },
  {
    title: "Total Rides",
    value: "432",
    change: "12.7% Up from month",
    icon: TrendingUp,
    color: "bg-green-100",
  },
  {
    title: "Total Profit",
    value: "$28,650",
    change: "2.4% Down from month",
    icon: DollarSign,
    color: "bg-red-100",
  },
];

export const USERS = [
  {
    name: "Jane Cooper",
    role: "Merchant-driver",
    phone: "+91 9876554321",
    address: "Sriganganganagar",
    currentLocation: "Shiv chowk",
    verified: true,
  },
  {
    name: "Floyd Miles",
    role: "Driver",
    phone: "+91 9876554322",
    address: "Anoopgarh",
    currentLocation: "xyz",
    verified: true,
  },
  {
    name: "Ronald Richards",
    role: "Merchant",
    phone: "+91 9876554323",
    address: "Suratgarh",
    currentLocation: "abc",
    verified: true,
  },
  {
    name: "Marvin McKinney",
    role: "Undefine",
    phone: "+91 9876554324",
    address: "Hanumangarh",
    currentLocation: "Chuna fatak",
    verified: false,
  },
  {
    name: "Jerome Bell",
    role: "Driver",
    phone: "+91 9876554325",
    address: "Jaipur",
    currentLocation: "Malviy Nagar",
    verified: true,
  },
  {
    name: "Kathryn Murphy",
    role: "Driver",
    phone: "+91 9876554326",
    address: "Jodhpur",
    currentLocation: "abed",
    verified: true,
  },
  {
    name: "Jacob Jones",
    role: "Driver",
    phone: "+91 9876554327",
    address: "Abhohar",
    currentLocation: "mnop",
    verified: true,
  },
  {
    name: "Jacob Jones",
    role: "Driver",
    phone: "+91 9876554327",
    address: "Abhohar",
    currentLocation: "mnop",
    verified: true,
  },
  {
    name: "Kristin Watson",
    role: "Merchant",
    phone: "+91 9876554328",
    address: "Sirsa",
    currentLocation: "ajkds dchdj",
    verified: true,
  },
  {
    name: "Kristin Watson",
    role: "Merchant",
    phone: "+91 9876554328",
    address: "Sirsa",
    currentLocation: "ajkds dchdj",
    verified: true,
  },
];
