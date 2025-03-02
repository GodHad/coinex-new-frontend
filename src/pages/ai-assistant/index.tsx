import AIChat from "@/components/AIChat";
import Head from "next/head";

export default function AiAssitant({ pageTitle }: { pageTitle: string; }) {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Dashboard`}</title>
                <meta name="description" content="Dashboard page" />
            </Head>
            <AIChat />
        </>
    );
};
