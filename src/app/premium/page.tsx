import { Premium } from "@/components/Premium";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Premium Signals`,
        description: "Premium Signals",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const PremiumPage: React.FC = () => {
  return (
    <div>
        <Premium />
    </div>
  );
};

export default PremiumPage;