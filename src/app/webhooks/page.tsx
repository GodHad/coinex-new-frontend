import { Webhooks } from "@/components/Webhooks";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | My webhooks",
    description: "Manage your webhooks",
};

const WebhooksPage: React.FC = () => {
  return (
    <div>
      <Webhooks />
    </div>
  );
};

export default WebhooksPage;