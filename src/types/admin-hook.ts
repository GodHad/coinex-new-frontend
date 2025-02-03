import { Webhook } from "./hooks";

export type AdminHook = {
    _id?: string;
    name: string;
    pair: string;
    url?: string;
    timeframe?: string;
    hook?: Webhook;
    winRate?: string;
    avgPnl?: string;
    signals?: number;
};