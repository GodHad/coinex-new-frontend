import { History } from "@/components/History";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | History",
    description: "History details",
};

const HistoryPage: React.FC = () => {
  return (
    <div>
      <History />
    </div>
  );
};

export default HistoryPage;