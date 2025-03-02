import { Webhooks } from "@/components/Webhooks";
import Head from "next/head";

const WebhooksPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | My Webhooks`}</title>
                <meta name="description" content="Manage your webhooks" />
                
            </Head>
            <Webhooks />
        </>
    );
};

export default WebhooksPage;