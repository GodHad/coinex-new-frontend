import { HistoryType } from "./history";
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
        winRate: number;
    }
    communityStats?: {
        activeUsers: number;
        totalUsers: number;
        last24h: {
            trades: number;
            winRate: number;
            pnl: number;
        };
        last7d: {
            trades: number;
            winRate: number;
            pnl: number;
        };
    }
    recentTrades?: {
        createdAt: string;
        positionState: string;
        data: {
            code: number;
            data: {
                amount: string;
                realized_pnl: string;
                last_filled_price: string;
            }
        }
    }[];
    performanceData?: {
        labels: string[];
        values: number[];
    };
    histories?: HistoryType[];
};