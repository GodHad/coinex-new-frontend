import RenderCoinexGuide from "@/components/documentation/Coinex";
import DocumentationLayout from "@/components/DocumentationLayout";
import Head from "next/head";

const CoinexPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Documentation | Coinex`}</title>
                <meta name="description" content="Documentation | Coinex" />
                
            </Head>
            <DocumentationLayout>
                <RenderCoinexGuide />
            </DocumentationLayout>
        </>
    );
};

export default CoinexPage;