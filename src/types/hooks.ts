import { User } from "@/contexts/UserContext";
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
    leverage?: string;
    entryPrice?: string;
    stopLossPrice?: string;
    takeProfitPrice?: string;
    currentPrice?: string;
    histories?: HistoryType[];
    creator?: User;
    pnl?: number;
    pnlPercent?: number;
    createdAt?: Date;
    updatedAt?: Date;
};