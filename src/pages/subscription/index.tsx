import { Subscription } from "@/components/Subscription";
import Head from "next/head";

const SubsscriptionPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Subscription`}</title>
                <meta name="description" content="Subscription" />
                
            </Head>
            <Subscription />
        </>
    );
};

export default SubsscriptionPage;