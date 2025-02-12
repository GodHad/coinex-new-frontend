import { History } from "@/components/History";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | History`,
        description: "History details",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const HistoryPage: React.FC = () => {
  return (
    <div>
      <History />
    </div>
  );
};

export default HistoryPage;