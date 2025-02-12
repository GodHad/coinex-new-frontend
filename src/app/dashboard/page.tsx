import { Dashboard } from "@/components/Dashboard";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Dashboard`,
        description: "Dashboard page",
        icons: {
            icon: pageData.favicon,
        },
    };
}

export default async function DashboardPage() {
  return (
    <div>
      <Dashboard />
    </div>
  );
};
