import { AdminPanel } from "@/components/Admin";
import AdminRoute from "@/components/AdminRoute";
import { getOverview } from "@/utils/api";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Webhooks | Admin",
    description: "Admin",
};

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