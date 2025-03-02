import { DeveloperDocs } from "@/components/DeveloperDocs";
import Head from "next/head";

export default function DeveloperDocsPage({ pageTitle }: { pageTitle: string; }) {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Dashboard`}</title>
                <meta name="description" content="Dashboard page" />
            </Head>
            <DeveloperDocs />
        </>
    );
};
