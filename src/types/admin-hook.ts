import { Webhook } from "./hooks";

export type AdminHook = {
    _id?: string;
    name: string;
    pair: string;
    description?: string;
    imageUrl: string;
    riskLevel: string;
    url?: string;
    timeframe?: string;
    recommendedLeverage?: string;
    hook?: Webhook;
    winRate?: number;
    avgPnl?: number;
    signals?: number;
    total24?: number;
    enabled?: boolean;
};