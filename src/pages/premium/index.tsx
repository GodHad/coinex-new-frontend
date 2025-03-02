import { Premium } from "@/components/Premium";
import Head from "next/head";

const PremiumPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Premium Signals`}</title>
                <meta name="description" content="Premium Signals" />
                
            </Head>
            <Premium />
        </>
    );
};

export default PremiumPage;