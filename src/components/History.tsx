'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Crown, ArrowUpRight, ArrowDownRight, ArrowRightLeft, CheckCircle2, XCircle, Users, Send } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import UserContext from '@/contexts/UserContext';
import { HistoryType } from '@/types/history';
import { Pagination } from '@/types/pagination';
import { getHistories, resentHistory } from '@/utils/api';
import { Webhook } from '@/types/hooks';
import moment from 'moment';

export function History() {
    const { user } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    const [selectedFilter, setSelectedFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
    const [selectedSource, setSelectedSource] = useState<'all' | 'standard' | 'premium' | 'p2p'>('all');

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'premium':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'p2p':
                return <Users className="w-4 h-4 text-blue-500" />;
            default:
                return <ArrowRightLeft className="w-4 h-4 text-gray-500" />;
        }
    };

    const getSourceStyle = (source: string) => {
        switch (source) {
            case 'premium':
                return 'bg-yellow-100 text-yellow-800';
            case 'p2p':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDirectionIcon = (direction: string) => {
        switch (direction) {
            case 'LONG_ONLY':
                return <ArrowUpRight className="w-4 h-4 text-green-500" />;
            case 'SHORT_ONLY':
                return <ArrowDownRight className="w-4 h-4 text-red-500" />;
            case 'BOTH':
                return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusIcon = (status: number | undefined) => {
        if (status === 0)
            return <CheckCircle2 className="w-4 h-4" />;
        return <XCircle className="w-4 h-4" />;
    };

    const getStatusStyle = (status: number | undefined) => {
        console.log(status)
        if (status === 0)
            return 'bg-green-100 text-green-700';
        return 'bg-red-100 text-red-700';
    };

    const [histories, setHistories] = useState<HistoryType[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0
    });

    const handleGetHistories = async () => {
        const result = await getHistories({
            perPage: pagination.perPage,
            currentPage: pagination.currentPage,
            source: selectedSource,
            filter: selectedFilter,
        });

        if (result) {
            setHistories(result.histories);
            setPagination(result.pagination);
        }
    }

    const handleResent = async (id: string) => {
        const result = await resentHistory(id);

        if (result) {
            setHistories(prev => prev.map(history => history._id === result.history._id ? result.history : history));
        }
    }

    useEffect(() => {
        handleGetHistories();
    }, [pagination.perPage, pagination.currentPage, selectedSource, selectedFilter])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Trading History</h1>
                    <Tooltip content="View your complete trading history and performance metrics">
                    </Tooltip>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <select
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value as 'all' | 'standard' | 'premium' | 'p2p')}
                            className="bg-white border rounded-lg px-3 py-1.5 text-sm"
                        >
                            <option value="all">All Sources</option>
                            <option value="standard">Standard</option>
                            {isPremium && <option value="premium">Premium</option>}
                            {isPremium && <option value="p2p">P2P</option>}
                        </select>
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'success' | 'error' | 'warning')}
                            className="bg-white border rounded-lg px-3 py-1.5 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="error">Error</option>
                            <option value="warning">Warning</option>
                        </select>
                    </div>
                    {!isPremium && (
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-md hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md inline-flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Upgrade to Premium
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold">Trading Activity</h2>
                            <Tooltip content="Your trading history from all sources">
                            </Tooltip>
                        </div>
                        {isPremium ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                <Crown className="w-4 h-4" />
                                Premium History
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500">
                                Last 24 hours (Upgrade to Premium for full history)
                            </span>
                        )}
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {histories.length > 0 ? histories.map((history) => (
                        <div key={history._id} className="p-4 hover:bg-gray-50 transition-colors">
                            {isPremium ? (
                                // Premium view with full details
                                <>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{(history.hook as Webhook).name}</span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSourceStyle(history.source || '')}`}>
                                                {getSourceIcon(history.source || '')}
                                                {(history.source || '').toUpperCase()}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                {getDirectionIcon(history.tradeDirection || 'BOTH')}
                                                {history.tradeDirection || 'BOTH'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500">{moment(history.createdAt).format('YYYY-MM-DD hh:mm:ss')}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(history.data?.code)}`}>
                                                {getStatusIcon(history.data?.code)}
                                                {history.data?.code === 0 ? 'Success' : 'Failed'}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 uppercase">{history.action}</span>
                                            <span className="text-sm text-gray-500">•</span>
                                            <span className="text-sm text-gray-600">
                                                {
                                                    !history.positionState ? history.action :
                                                        history.positionState === 'neutral' ? 'Position Closed' :
                                                            history.positionState === 'short' ? (history.action === 'buy' ? 'Short Position Closed' : 'Long Position Opened') : (
                                                                history.action === 'sell' ? 'Short Position Opened' : 'Long Position Closed'
                                                            )
                                                }
                                            </span>
                                        </div>
                                        {
                                            history.data?.code !== 0 &&
                                            <button
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(history.data?.code)}`}
                                                disabled={!!history.isResended}
                                                onClick={() => handleResent(history._id || '')}
                                            >
                                                <Send className='w-4 h-4' />
                                                {history.isResended ? 'Already Resent' : 'Resend'}
                                            </button>
                                        }
                                    </div>
                                    {history.data?.code === 0 && history.data.data && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Net PnL</p>
                                                    <p className={`font-medium ${Number(history.data.data.realized_pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {Number(history.data.data.realized_pnl) >= 0 ? '+' : ''}{Number(history.data.data.realized_pnl).toLocaleString()} USDT
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">ROI</p>
                                                    <p className={`font-medium ${Number(history.data.data.realized_pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {Number(history.data.data.realized_pnl) >= 0 ? '+' : ''}{(Number(history.data.data.realized_pnl) / Number(history.data.data.filled_value)).toFixed(3)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Position Size</p>
                                                    <p className="font-medium">${history.data.data.filled_value}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Leverage</p>
                                                    {/* <p className="font-medium">{history.trade.leverage}x</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Simplified standard view
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{(history.hook as Webhook).name}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(history.data?.code)}`}>
                                                    {getStatusIcon(history.data?.code)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{moment(history.createdAt).format('YYYY-MM-DD hh:mm:ss')}</p>
                                        </div>
                                    </div>
                                    {history.data?.data.realized_pnl && (
                                        <div className="text-right">
                                            <p className={`font-medium ${Number(history.data.data.realized_pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Number(history.data.data.realized_pnl) >= 0 ? '+' : ''}{history.data.data.realized_pnl} USDT
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {history.symbol}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                        :
                        <div className="w-full gap-1 px-4 py-4 text-center">
                            No histories
                        </div>
                    }
                </div>
                {!isPremium && histories.length > 0 && (
                    <div className="p-6 bg-gradient-to-b from-transparent to-gray-50 text-center border-t border-gray-100">
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                            <p className="text-gray-600 mb-4">
                                Get access to detailed trade analytics, advanced performance metrics, and complete trading history with Premium.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-3 bg-gray-100 rounded-lg text-center">
                                    <p className="font-medium">Detailed Analytics</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg text-center">
                                    <p className="font-medium">Full History</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg text-center">
                                    <p className="font-medium">Advanced Metrics</p>
                                </div>
                            </div>
                            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 rounded-md hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md inline-flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Upgrade to Premium
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}