import { Dashboard } from "@/components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Dashboard",
    description: "Dashboard",
};

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;