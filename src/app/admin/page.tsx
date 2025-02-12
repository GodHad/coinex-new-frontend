import { AdminPanel } from "@/components/Admin";
import AdminRoute from "@/components/AdminRoute";
import { getOverview, getPageData } from "@/utils/api";
import { Metadata } from "next";
import { cookies } from "next/headers";

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
    const jwtToken = (await cookies()).get('jwtToken')?.value;
    const result = await getOverview(jwtToken || '');

    return (
        <div>
            <AdminRoute>
                <AdminPanel overview={result} />
            </AdminRoute>
        </div>
    );
};