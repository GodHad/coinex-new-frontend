import { History } from "@/components/History";
import Head from "next/head";

const HistoryPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | History`}</title>
                <meta name="description" content="History" />
                
            </Head>
            <History />
        </>
    );
};

export default HistoryPage;