import StandardGuide from "@/components/documentation/StandardGuide";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Documentation | Guide | Standard",
    description: "Documentation | Guide | Standard",
};

const CoinexPage: React.FC = () => {
  return (
    <div>
      <StandardGuide />
    </div>
  );
};

export default CoinexPage;