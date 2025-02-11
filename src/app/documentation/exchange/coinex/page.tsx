import RenderCoinexGuide from "@/components/documentation/Coinex";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Documentation | Coinex",
    description: "Documentation | Coinex",
};

const CoinexPage: React.FC = () => {
  return (
    <div>
      <RenderCoinexGuide />
    </div>
  );
};

export default CoinexPage;