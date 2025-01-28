import { AdminPanel } from "@/components/Admin";
import AdminRoute from "@/components/AdminRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Admin",
    description: "Admin",
};

const AdminPage: React.FC = () => {
    return (
        <div>
            <AdminRoute>
                <AdminPanel />
            </AdminRoute>
        </div>
    );
};

export default AdminPage;