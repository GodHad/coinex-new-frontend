import { Affiliates } from "@/components/Affiliates";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Affiliates",
    description: "Affiliates",
};

const AffiliatesPage: React.FC = () => {
  return (
    <div>
      <Affiliates />
    </div>
  );
};

export default AffiliatesPage;