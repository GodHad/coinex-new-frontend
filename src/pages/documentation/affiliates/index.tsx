import DocumentationLayout from "@/components/DocumentationLayout";
import { Affiliates } from "@/components/Affiliates";
import Head from "next/head";

const AffiliatesPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Documentation | Affiliates`}</title>
                <meta name="description" content="Documentation | Affiliates" />
            </Head>
            <DocumentationLayout>
                <Affiliates />
            </DocumentationLayout>
        </>
    );
};

export default AffiliatesPage;