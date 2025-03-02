import StandardGuide from "@/components/documentation/StandardGuide";
import DocumentationLayout from "@/components/DocumentationLayout";
import Head from "next/head";

const StandardPage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Documentation | Guide | Standard`}</title>
                <meta name="description" content="Documentation | Guide | Standard" />
                
            </Head>
            <DocumentationLayout>
                <StandardGuide />
            </DocumentationLayout>
        </>
    );
};

export default StandardPage;