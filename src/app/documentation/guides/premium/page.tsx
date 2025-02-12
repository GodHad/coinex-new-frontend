import PremiumGuide from "@/components/documentation/PremiumGuide";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Documentation | Guide | Premium`,
        description: "Documentation | Guide | Premium",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const CoinexPage: React.FC = () => {
  return (
    <div>
      <PremiumGuide />
    </div>
  );
};

export default CoinexPage;