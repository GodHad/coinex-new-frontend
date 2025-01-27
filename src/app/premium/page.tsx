import { Premium } from "@/components/Premium";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Premium Signals",
    description: "Premium Signals",
};

const PremiumPage: React.FC = () => {
  return (
    <div>
        <Premium />
    </div>
  );
};

export default PremiumPage;