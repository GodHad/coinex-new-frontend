import { Tools } from "@/components/TradingTool";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Tools`,
        description: "Webhooks Tools",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const ToolsPage: React.FC = () => {
  return (
    <div>
        <Tools />
    </div>
  );
};

export default ToolsPage;