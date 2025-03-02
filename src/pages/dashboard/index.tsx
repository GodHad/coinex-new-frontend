import { Dashboard } from "@/components/Dashboard";
import Head from "next/head";

export default function DashboardPage({ pageTitle }: { pageTitle: string; }) {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Dashboard`}</title>
                <meta name="description" content="Dashboard page" />
            </Head>
            <Dashboard />
        </>
    );
};
