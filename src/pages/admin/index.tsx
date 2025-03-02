import Head from "next/head";
import { AdminPanel } from "@/components/Admin";
import AdminRoute from "@/components/AdminRoute";

export default function AdminPage({ pageTitle }: { pageTitle: string; }) {
  return (
    <>
      <Head>
        <title>{`${pageTitle || "Webhooks"} | Admin`}</title>
        <meta name="description" content="Admin page" />
      </Head>
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    </>
  );
}
