import PremiumGuide from "@/components/documentation/PremiumGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Documentation | Guide | Premium",
    description: "Documentation | Guide | Premium",
};

const CoinexPage: React.FC = () => {
  return (
    <div>
      <PremiumGuide />
    </div>
  );
};

export default CoinexPage;