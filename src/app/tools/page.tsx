import { Tools } from "@/components/TradingTool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Tools",
    description: "Webhooks Tools",
};

const ToolsPage: React.FC = () => {
  return (
    <div>
        <Tools />
    </div>
  );
};

export default ToolsPage;