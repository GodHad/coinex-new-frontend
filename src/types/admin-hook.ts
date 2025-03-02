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
    personalStats?: {
        invested: number;
        currentValue: number;
        pnl: number;
        pnlPercent: number;
        trades: number;
        winRate: string;
        avgHoldTime: string;
    }
    communityStats?: {
        activeUsers: number;
        totalUsers: number;
        last24h: {
            trades: number;
            winRate: string;
            pnl: number;
        };
        last7d: {
            trades: number;
            winRate: string;
            pnl: number;
        };
    }
    recentTrades?: {
        date: string;
        type: 'long' | 'short';
        entry: number;
        exit: number;
        pnl: number;
        pnlPercent: number;
    }[];
    performanceData?: {
        labels: string[];
        values: number[];
    };
};