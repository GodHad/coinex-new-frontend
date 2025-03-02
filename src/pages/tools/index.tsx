import { Tools } from "@/components/TradingTool";
import Head from "next/head";

const ToolsPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Documentation | Affiliates`}</title>
                <meta name="description" content="Documentation | Affiliates" />
                
            </Head>
            <Tools />
        </>
    );
};

export default ToolsPage;