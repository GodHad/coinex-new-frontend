'use client';
import React, { useContext, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Play, Pause, ExternalLink, AlertTriangle, TrendingUp, Crown, Clock, BarChart2, Lock, ArrowLeftRight, TrendingDown } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import UserContext from '@/contexts/UserContext';
import { Webhook } from '@/types/hooks';
import moment from 'moment';
import { getDashboardOverview, getHooks } from '@/utils/api';
import { toast } from 'react-toastify';

export function Dashboard() {
    const { user, jwtToken } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    const [positions, setPositions] = useState<Webhook[]>([]);

    const standardPositions = positions.filter(pos => !pos.isSubscribed && !pos.status);
    const premiumPositions = positions.filter(pos => pos.isSubscribed && !pos.status);

    const getSourceStats = (source: boolean) => {
        const filteredPositions = positions.filter(pos => pos.isSubscribed === source);
        return {
            totalPnl: filteredPositions.reduce((sum, pos) => sum + (pos.pnl || 0), 0),
            activePositions: filteredPositions.filter(pos => pos.status === 0).length,
            totalPositions: filteredPositions.length,
            totalRisk: filteredPositions.reduce((sum, pos) => sum + (Number(pos.leverage || 1) * Number(pos.entryPrice || 0)), 0)
        };
    };

    const standardStats = getSourceStats(false);
    const premiumStats = getSourceStats(true);

    const [totalStats, setTotalStats] = useState<{
        totalPnl: number;
        activePositions: number;
        totalPositions: number;
        totalRisk: number;
    }>({
        totalPnl: 0,
        activePositions: 0,
        totalPositions: 0,
        totalRisk: 0
    });

    const handleGetOverview = async () => {
        const res = await getDashboardOverview();
        if (res) setTotalStats(res);
    }

    useEffect(() => {
        handleGetOverview();
        handleGetHooks(jwtToken);
    }, [jwtToken]);

    const handleGetHooks = async (jwtToken: string) => {
        try {
            const data = await getHooks(jwtToken);
            setPositions(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }

    }

    const calculateRiskLevel = (totalRisk: number) => {
        if (totalRisk > 10000) return 'High';
        if (totalRisk > 5000) return 'Moderate';
        return 'Low';
    };

    const renderPositionSection = (title: string, sectionPositions: Webhook[], stats: typeof standardStats, showLock = false) => (
        <div className={`relative bg-white rounded-xl shadow-md overflow-hidden ${showLock ? 'min-h-48' : ''}`}>
            {showLock && (
                <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 z-10 flex items-center justify-center">
                    <div className="text-center">
                        <Lock className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                        <p className="text-gray-800 font-medium">Premium Feature</p>
                        <button className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md inline-flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
            )}

            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <Tooltip content={`Active positions from ${title.toLowerCase()}`}>
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-gray-500">PnL: </span>
                            <span className={stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(2)} USDT
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500">Active: </span>
                            <span className="text-gray-900">{stats.activePositions} / {stats.totalPositions}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {sectionPositions.map((position) => (
                    <div key={position._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button
                                    className={`p-2 rounded-full ${position.status === 0
                                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {position.status === 0 ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{position.name}</span>
                                        {position.isSubscribed && <Crown className="w-4 h-4 text-yellow-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        {/* <span>{position.ti}</span>
                                        <span>•</span> */}
                                        <Clock className="w-3 h-3" />
                                        <span>Opened {moment(position.createdAt).format('YYYY-MM-DD hh:mm:ss')}</span>
                                    </div>
                                </div>
                            </div>
                            {position.pnl && position.pnlPercent &&
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)} USDT
                                        </div>
                                        <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            }
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Type</p>
                                <div className="flex items-center gap-1 font-medium">
                                    {
                                        position.tradeDirection === 'BOTH' ? (
                                            <>
                                                <ArrowLeftRight className="w-4 h-4 text-green-500" />
                                                <span className="text-green-600">Both {position.leverage ? position.leverage + "x" : ''}</span>
                                            </>
                                        ) : position.tradeDirection === 'LONG_ONLY' ? (
                                            <>
                                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                                <span className="text-green-600">Long {position.leverage ? position.leverage + "x" : ''}</span>
                                            </>
                                        ) : (
                                            <>
                                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                                                <span className="text-red-600">Short {position.leverage ? position.leverage + "x" : ''}</span>
                                            </>
                                        )}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Entry Price</p>
                                <p className="font-medium">${(position.entryPrice || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="font-medium">${(position.currentPrice || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Size</p>
                                <p className="font-medium">${(position.entryPrice || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {(position.stopLossPrice || position.takeProfitPrice) && (
                            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                                {position.stopLossPrice && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-red-600">Stop Loss</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="font-medium">${position.stopLossPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {position.tradeDirection === 'LONG_ONLY' ? 'Loss' : 'Profit'} at {
                                                ((Math.abs(Number(position.stopLossPrice || 0) - Number(position.entryPrice || 1)) / Number(position.entryPrice || 1)) * 100).toFixed(2)
                                            }%
                                        </div>
                                    </div>
                                )}
                                {position.takeProfitPrice && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-green-600">Take Profit</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="font-medium">${position.takeProfitPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {position.tradeDirection === 'LONG_ONLY' ? 'Profit' : 'Loss'} at {
                                                ((Math.abs(Number(position.takeProfitPrice) - Number(position.entryPrice || 1)) / Number(position.entryPrice || 1)) * 100).toFixed(2)
                                            }%
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 py-10 px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500">Total PnL</h3>
                        {totalStats.totalPnl >= 0 ?
                            <TrendingUp className={`w-5 h-5  text-green-500`} />
                            : <TrendingDown className='w-5 h-5 text-red-500' />
                        }
                    </div>
                    <p className={`text-2xl font-bold ${totalStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalStats.totalPnl >= 0 ? '+' : ''}{totalStats.totalPnl.toFixed(2)} USDT
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All positions</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500">Active Positions</h3>
                        <Play className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">{totalStats.activePositions} / {totalStats.totalPositions}</p>
                    <p className="text-sm text-gray-500 mt-1">Currently trading</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500">Total Risk</h3>
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">${totalStats.totalRisk.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Position value</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500">Risk Level</h3>
                        <BarChart2 className={`w-5 h-5 ${calculateRiskLevel(totalStats.totalRisk) === 'High' ? 'text-red-500' :
                            calculateRiskLevel(totalStats.totalRisk) === 'Moderate' ? 'text-yellow-500' :
                                'text-green-500'
                            }`} />
                    </div>
                    <p className={`text-2xl font-bold ${calculateRiskLevel(totalStats.totalRisk) === 'High' ? 'text-red-600' :
                        calculateRiskLevel(totalStats.totalRisk) === 'Moderate' ? 'text-yellow-600' :
                            'text-green-600'
                        }`}>
                        {calculateRiskLevel(totalStats.totalRisk)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Based on exposure</p>
                </div>
            </div>

            {/* Position Sections */}
            <div className="space-y-6">
                {/* Standard Positions */}
                {renderPositionSection('Standard Signals', standardPositions, standardStats)}

                {/* Premium Positions */}
                {renderPositionSection('Premium Signals', premiumPositions, premiumStats, !isPremium)}

                {/* P2P Positions */}
            </div>
        </div>
    );
}