import { AdminPanel } from "@/components/Admin";
import AdminRoute from "@/components/AdminRoute";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Admin`,
        description: "Admin page",
        icons: {
            icon: pageData.favicon,
        },
    };
}

export default async function AdminPage() {

    return (
        <div>
            <AdminRoute>
                <AdminPanel />
            </AdminRoute>
        </div>
    );
};