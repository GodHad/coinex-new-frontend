import { AdminHook } from "./admin-hook";
import { HistoryType } from "./history";

export type Webhook = {
    _id?: string;
    name: string;
    url: string;
    coinExApiKey: string;
    coinExApiSecret: string;
    status: number;
    tradeDirection: string;
    isSubscribed?: boolean;
    adminHook?: string | AdminHook;
    amount?: number;
    histories?: HistoryType[];
};