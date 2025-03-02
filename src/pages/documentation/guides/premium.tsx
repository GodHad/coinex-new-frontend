import PremiumGuide from "@/components/documentation/PremiumGuide";
import DocumentationLayout from "@/components/DocumentationLayout";
import Head from "next/head";

const PremiumPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Documentation | Guide | Premium`}</title>
                <meta name="description" content="Documentation | Guide | Premium" />
                
            </Head>
            <DocumentationLayout>
                <PremiumGuide />
            </DocumentationLayout>
        </>
    );
};

export default PremiumPage;