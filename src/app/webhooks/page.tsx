import { Webhooks } from "@/components/Webhooks";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | My Webhooks`,
        description: "Manage your webhooks",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const WebhooksPage: React.FC = () => {
  return (
    <div>
      <Webhooks />
    </div>
  );
};

export default WebhooksPage;