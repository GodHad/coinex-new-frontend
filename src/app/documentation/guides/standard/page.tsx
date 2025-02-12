import StandardGuide from "@/components/documentation/StandardGuide";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Documentation | Guide | Standard`,
        description: "Documentation | Guide | Standard",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const CoinexPage: React.FC = () => {
  return (
    <div>
      <StandardGuide />
    </div>
  );
};

export default CoinexPage;