import { Webhook } from "./hooks";

export type ApiAccount = {
    id: string;
    name: string;
    exchange: string;
    balance: {
        total: number;
        available: number;
        inPosition: number;
    };
    pnl: {
        daily: number;
        weekly: number;
        monthly: number;
        allTime: number;
    };
    positions: Webhook[];
    lastUpdated: string;
};