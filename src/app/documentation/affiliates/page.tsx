import { Affiliates } from "@/components/Affiliates";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Documentation | Affiliates`,
        description: "Documentation | Affiliates",
        icons: {
            icon: pageData.favicon,
        },
    };
}


const AffiliatesPage: React.FC = () => {
  return (
    <div>
      <Affiliates />
    </div>
  );
};

export default AffiliatesPage;