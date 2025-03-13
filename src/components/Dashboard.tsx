'use client';
import React, { useContext, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Play, Pause, ExternalLink, AlertTriangle, TrendingUp, Crown, Clock, BarChart2, Lock, ArrowLeftRight, TrendingDown, ChevronDown, Wallet, CreditCard, DollarSign, RefreshCw, Zap, Users } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import UserContext from '@/contexts/UserContext';
import { Webhook } from '@/types/hooks';
import moment from 'moment';
import { get30DaysChartData, getDashboardOverview, getHooks } from '@/utils/api';
import { toast } from 'react-toastify';
import { ApiAccount } from '@/types/apiAccount';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export function Dashboard() {
    const { user, jwtToken } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());
    const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

    const [positions, setPositions] = useState<Webhook[]>([]);
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

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

    
    const [totalStats, setTotalStats] = useState<{
        totalPnl: number;
        activePositions: number;
        totalPositions: number;
        totalRisk: number;
        pnlStats: {
            daily: number;
            weekly: number;
            monthly: number;
            allTime: number;
        };
        todayPnl: number;
        standard: {
            totalPositions: number;
            activePositions: number;
            totalPnl: number;
            totalRisk: number;
        };
        premium: {
            totalPositions: number;
            activePositions: number;
            totalPnl: number;
            totalRisk: number;
        };
        lastUpdated: Date;
    }>({
        totalPnl: 0,
        activePositions: 0,
        totalPositions: 0,
        totalRisk: 0,
        pnlStats: {
            daily: 0,
            weekly: 0,
            monthly: 0,
            allTime: 0,
        },
        standard: {
            totalPositions: 0,
            activePositions: 0,
            totalPnl: 0,
            totalRisk: 0,
        },
        premium: {
            totalPositions: 0,
            activePositions: 0,
            totalPnl: 0,
            totalRisk: 0,
        },
        todayPnl: 0,
        lastUpdated: new Date()
    });

    const [apiAccounts, setApiAccounts] = useState<ApiAccount[]>([
        {
            id: 'api1',
            name: 'CoinEx Subaccounts',
            exchange: 'CoinEx',
            balance: user?.balance || {
                total: 0,
                available: 0,
                inPosition: 0
            },
            pnl: totalStats.pnlStats,
            positions: [],
            lastUpdated: '2024-03-14 15:45:00'
        },
        // {
        //     id: 'api2',
        //     name: 'CoinEx Trading',
        //     exchange: 'CoinEx',
        //     balance: {
        //         total: 8000,
        //         available: 5700,
        //         inPosition: 2300
        //     },
        //     pnl: {
        //         daily: 444.55,
        //         weekly: -120.35,
        //         monthly: 2345.67,
        //         allTime: 5678.90
        //     },
        //     positions: [],
        //     lastUpdated: '2024-03-14 15:45:00'
        // },
        // {
        //     id: 'api3',
        //     name: 'Bybit Futures',
        //     exchange: 'Bybit',
        //     balance: {
        //         total: 3000,
        //         available: 1800,
        //         inPosition: 1200
        //     },
        //     pnl: {
        //         daily: -75.45,
        //         weekly: 320.78,
        //         monthly: 890.12,
        //         allTime: 1234.56
        //     },
        //     positions: [],
        //     lastUpdated: '2024-03-14 15:45:00'
        // }
    ]);

    useEffect(() => {
        const updatedAccounts = apiAccounts.map(account => {
          return {
            ...account,
            pnl: totalStats.pnlStats,
          };
        });
        setApiAccounts(updatedAccounts);
      }, [totalStats]);

    const standardStats = getSourceStats(false);
    const premiumStats = getSourceStats(true);
    
    const [pnlData, setPnlData] = useState<{
        standard: Record<string, number>;
        premium: Record<string, number>;
    }>({
        standard: {},
        premium: {},
    });

    const handleGetOverview = async () => {
        const res = await getDashboardOverview();
        if (res) setTotalStats(res);
    }

    const handleGetHooks = async (jwtToken: string) => {
        try {
            const data = await getHooks(jwtToken);
            setPositions(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }

    }

    const handleGetPnlData = async () => {
        const res = await get30DaysChartData();
        if (res) setPnlData(res);
    }

    useEffect(() => {
        handleGetOverview();
        handleGetHooks(jwtToken);
        handleGetPnlData();
    }, [jwtToken]);


    const calculateRiskLevel = (totalRisk: number) => {
        if (totalRisk > 10000) return 'High';
        if (totalRisk > 5000) return 'Moderate';
        return 'Low';
    };

    const generateOverallPerformanceData = () => {
        let days = 7;
        if (timeRange === '24h') days = 1;
        if (timeRange === '30d') days = 30;
    
        const labels = Array.from({ length: days }, (_, i) => {
            return moment().subtract(i, 'days').format('YYYY-MM-DD');
        }).reverse();

        const standardData = labels.map(date => pnlData?.standard[date] || 0);
        const premiumData = labels.map(date => pnlData?.premium[date] || 0);
    
        return {
            labels: Array.from({ length: days }, (_, i) => {
                return moment().subtract(i, 'days').format('MMM D');
            }).reverse(),
            datasets: [
                {
                    label: 'Standard Signals',
                    data: standardData,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                },
                {
                    label: 'Premium Signals',
                    data: premiumData,
                    backgroundColor: 'rgba(234, 179, 8, 0.5)',
                    borderColor: 'rgb(234, 179, 8)',
                    borderWidth: 1,
                },
            ],
        };
    };
    

    const renderApiAccountCard = (account: ApiAccount) => {
        const isExpanded = expandedAccountId === account.id;

        // Calculate percentage of available vs in-position funds
        const availablePercentage = (account.balance.available / account.balance.total) * 100;

        return (
            <div key={account.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            {account.exchange === 'Binance' && <Wallet className="w-5 h-5 text-yellow-500" />}
                            {account.exchange === 'CoinEx' && <Wallet className="w-5 h-5 text-blue-500" />}
                            {account.exchange === 'Bybit' && <Wallet className="w-5 h-5 text-purple-500" />}
                        </div>
                        <div>
                            <h3 className="font-medium">{account.name}</h3>
                            <p className="text-sm text-gray-500">{account.exchange}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-medium">${account.balance.total.toLocaleString()}</p>
                            <p className={`text-sm ${totalStats.todayPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${totalStats.todayPnl >= 0 ? '+' : ''}{totalStats.todayPnl.toFixed(2)} today
                            </p>
                        </div>
                        <button
                            onClick={() => setExpandedAccountId(isExpanded ? null : account.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Balance Distribution */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium mb-3">Balance Distribution</h4>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${availablePercentage}%` }}></div>
                                    </div>
                                    <span className="text-sm font-medium whitespace-nowrap">{availablePercentage.toFixed(0)}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Available</p>
                                        <p className="font-medium">${account.balance.available.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">In Position</p>
                                        <p className="font-medium">${account.balance.inPosition.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-medium mb-3">Performance</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-500">Daily</span>
                                            <span className={`text-sm ${account.pnl.daily >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                               ${account.pnl.daily >= 0 ? '+' : ''}{account.pnl.daily.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${account.pnl.daily >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(Math.abs(account.pnl.daily) / (account.balance.total * 0.05) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-500">Weekly</span>
                                            <span className={`text-sm ${account.pnl.weekly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${account.pnl.weekly >= 0 ? '+' : ''}{account.pnl.weekly.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${account.pnl.weekly >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(Math.abs(account.pnl.weekly) / (account.balance.total * 0.1) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-500">Monthly</span>
                                            <span className={`text-sm ${account.pnl.monthly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${account.pnl.monthly >= 0 ? '+' : ''}{account.pnl.monthly.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${account.pnl.monthly >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(Math.abs(account.pnl.monthly) / (account.balance.total * 0.2) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Positions */}
                        {account.positions.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-3">Active Positions</h4>
                                <div className="space-y-2">
                                    {account.positions.map(position => (
                                        <div key={position._id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-full ${position.histories && position.histories[0]?.positionState === 'long' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {position.histories && position.histories[0]?.positionState === 'long' ? (
                                                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{position.name}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${position.status ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {position.status ? 'Active' : 'Paused'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{position.leverage}x • ${position.entryPrice}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${position.pnl ? position.pnl >= 0 ? 'text-green-600' : 'text-red-600' : ''}`}>
                                                    {position.pnl && position.pnl >= 0 ? '+' : ''}{(position.pnl || 0).toFixed(2)} USDT
                                                </p>
                                                <p className={`text-sm ${position.pnl && position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {position.pnl && position.pnl >= 0 ? '+' : ''}{(position.pnlPercent || 0).toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-xs text-gray-500 text-right">
                            Last updated: {moment(totalStats.lastUpdated).format('YYYY-MM-DD hh:mm:ss')}
                        </div>
                    </div>
                )}
            </div>
        );
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
                                    // onClick={() => togglePosition(position.id)}
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
                                        {!position.isSubscribed && <Users className="w-4 h-4 text-blue-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        {/* <span>{position.pair}</span>
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
                                    <button
                                        // onClick={() => setSelectedPositionId(position._id)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
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

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshPositions = () => {
        setIsRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

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

            {/* API Accounts Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">API Accounts & Balances</h2>
                        <Tooltip content="Overview of your exchange accounts and their performance">
                        </Tooltip>
                    </div>
                    <button
                        onClick={refreshPositions}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Wallet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Total Balance</h3>
                                <p className="text-sm text-gray-500">All accounts</p>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            ${(user?.balance?.total || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Total PnL (Daily)</h3>
                                <p className="text-sm text-gray-500">All accounts</p>
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${totalStats.pnlStats.daily >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {totalStats.pnlStats.daily > 0 ? '+' : ''}
                            ${totalStats.pnlStats.daily.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Active Accounts</h3>
                                <p className="text-sm text-gray-500">Connected exchanges</p>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            {1}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {apiAccounts.map(account => renderApiAccountCard(account))}
                </div>
            </div>
            
            {/* Performance Overview Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Performance Overview</h2>
                        <Tooltip content="Daily PnL across all signal types">
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={refreshPositions}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="text-sm">Refresh</span>
                        </button> */}
                        <div className="flex border rounded-lg overflow-hidden">
                            <button
                                onClick={() => setTimeRange('24h')}
                                className={`px-3 py-1 text-sm ${timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                24h
                            </button>
                            <button
                                onClick={() => setTimeRange('7d')}
                                className={`px-3 py-1 text-sm ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                7d
                            </button>
                            <button
                                onClick={() => setTimeRange('30d')}
                                className={`px-3 py-1 text-sm ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                30d
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-80">
                    <Bar
                        data={generateOverallPerformanceData()}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top' as const,
                                },
                                tooltip: {
                                    mode: 'index' as const,
                                    intersect: false,
                                    callbacks: {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        label: function (context: any) {
                                            let label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                            }
                                            return label;
                                        }
                                    }
                                },
                            },
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                                y: {
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.05)',
                                    },
                                    ticks: {
                                        callback: function (value: string | number) {
                                            return '$' + value;
                                        }
                                    }
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Signal Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">Standard Signals</h3>
                            <p className="text-sm text-gray-500">Basic trading signals</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total PnL:</span>
                            <span className={`font-medium ${totalStats.standard.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalStats.standard.totalPnl >= 0 ? '+' : ''}{totalStats.standard.totalPnl.toFixed(2)} USDT
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Positions:</span>
                            <span className="font-medium">{totalStats.standard.activePositions} / {totalStats.standard.totalPositions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Risk:</span>
                            <span className="font-medium">${totalStats.standard.totalRisk.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Crown className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">Premium Signals</h3>
                            <p className="text-sm text-gray-500">Advanced trading signals</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total PnL:</span>
                            <span className={`font-medium ${totalStats.premium.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalStats.premium.totalPnl >= 0 ? '+' : ''}{totalStats.premium.totalPnl.toFixed(2)} USDT
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Positions:</span>
                            <span className="font-medium">{totalStats.premium.activePositions} / {totalStats.premium.totalPositions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Risk:</span>
                            <span className="font-medium">${totalStats.premium.totalRisk.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">P2P Trading</h3>
                            <p className="text-sm text-gray-500">Community trading signals</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total PnL:</span>
                            <span className={`font-medium ${p2pStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {p2pStats.totalPnl >= 0 ? '+' : ''}{p2pStats.totalPnl.toFixed(2)} USDT
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Positions:</span>
                            <span className="font-medium">{p2pStats.activePositions} / {p2pStats.totalPositions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Risk:</span>
                            <span className="font-medium">${p2pStats.totalRisk.toLocaleString()}</span>
                        </div>
                    </div>
                </div> */}
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