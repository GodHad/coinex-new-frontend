import RenderCoinexGuide from "@/components/documentation/Coinex";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Documentation | Coinex`,
        description: "Documentation | Coinex",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const CoinexPage: React.FC = () => {
  return (
    <div>
      <RenderCoinexGuide />
    </div>
  );
};

export default CoinexPage;