import { Webhook } from "./hooks"

export type HistoryType = {
    _id?: string;
    hook: Webhook | string;
    symbol: string;
    amount: string;
    positionState?: string;
    action: string;
    data?: {
        code: number;
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: any;
    };
    source?: string;
    tradeDirection?: string;
    isResended?: boolean;
    createdAt: Date;
}