'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Crown, ChevronDown, AlertTriangle, Eye, EyeOff, Check, Key, Settings, ArrowRight, HelpCircle, Users, Lock, BarChart2, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import UserContext from '@/contexts/UserContext';
import { AdminHook } from '@/types/admin-hook';
import { getAdminHooks, insertHook, updateHook } from '@/utils/api';
import { Webhook } from '@/types/hooks';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import { ApiSecurityWarning } from './common/ApiSecurityWarning';

const timeFrames = [
  '5m',
  '15m',
  '30m',
  '45m',
  '1h',
  '2h',
  '3h',
  '4h',
  '1d'
];

const cryptoPairs = [
  'SOL/USDT',
  'BTC/USDT',
  'ETH/USDT',
];

export function Premium() {
  const { user } = useContext(UserContext);
  const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

  const [signals, setSignals] = useState<AdminHook[]>([]);
  const [_signal, setSignal] = useState<AdminHook | null>(null);
  const [webhook, setWebhook] = useState<Webhook>({
    url: '',
    name: '',
    coinExApiKey: '',
    coinExApiSecret: '',
    tradeDirection: 'BOTH',
    adminHook: _signal?._id,
    status: 0,
    amount: 0
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [showApiConfig, setShowApiConfig] = useState<string | null>(null);
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');
  const [apiKeys, setApiKeys] = useState<Record<string, {
    key: string;
    secret: string;
    direction: string;
    amount: string;
    amountUnit: 'USDT' | '%';
  }>>({});
  const [pendingApiConfig, setPendingApiConfig] = useState<{
    pair: string;
    key: string;
    secret: string;
    direction: string;
    amount: string;
    amountUnit: 'USDT' | '%';
  } | null>(null);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);

  const toggleExpandSignal = (_id: string) => {
    if (expandedSignal === _id) {
      setExpandedSignal(null);
    } else {
      setExpandedSignal(_id);
    }
  };

  const toggleSignal = async (id: string | undefined, hook: Webhook | undefined) => {
    if (!id || !hook) return;
    hook.status = 1 - hook.status;
    const result = await updateHook(hook, true);
    if (result) {
      setSignals(signals.map(w => w._id === id ? { ...w, hook: result.hook } : w));
      toast.success(result.message);
    }
  };

  // const saveApiConfig = async () => {
  //   const result = !webhook._id ? await insertHook({ ...webhook, adminHook: _signal?._id }, true) : await updateHook({ ...webhook, adminHook: _signal?._id }, true);
  //   if (result) {
  //     setSignals(prev => prev.map(s => s._id === _signal?._id ? { ...s, hook: result.hook } : s));
  //     toast.success(result.message);
  //   }
  // };

  const saveApiConfig = (pair?: string) => {
    if (!pair) return;
    if (apiKeys[pair]?.key && apiKeys[pair]?.secret) {
      setPendingApiConfig({
        pair,
        key: apiKeys[pair].key,
        secret: apiKeys[pair].secret,
        direction: apiKeys[pair].direction || 'Both',
        amount: apiKeys[pair].amount || '100',
        amountUnit: apiKeys[pair].amountUnit || 'USDT'
      });
      setShowSecurityWarning(true);
    }
  };

  const handleApiConfigConfirm = () => {
    if (pendingApiConfig) {
      setSignals(signals.map(signal =>
        signal.pair === pendingApiConfig.pair
          ? { ...signal, apiConfigured: true }
          : signal
      ));
      setShowApiConfig(null);
      setPendingApiConfig(null);
    }
    setShowSecurityWarning(false);
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
    }
  };

  const renderApiConfig = (signal: AdminHook) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Configure API for {signal.pair}</h3>
            <button
              onClick={() => {
                setSignal(null);

                setWebhook({
                  url: '',
                  name: '',
                  coinExApiKey: '',
                  coinExApiSecret: '',
                  tradeDirection: 'BOTH',
                  status: 0,
                  adminHook: signal._id
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={webhook?.name || ''}
                  onChange={(e) => setWebhook(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                  placeholder="Enter webhook name"
                />
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={webhook?.coinExApiKey || ''}
                  onChange={(e) => setWebhook(prev => ({
                    ...prev,
                    coinExApiKey: e.target.value
                  }))}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                  placeholder="Enter your API key"
                />
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            {signal._id &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecrets[signal._id] ? 'text' : 'password'}
                    value={webhook.coinExApiSecret || ''}
                    onChange={(e) => setWebhook(prev => ({
                      ...prev,
                      coinExApiSecret: e.target.value
                    }))}
                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                    placeholder="Enter your API secret"
                  />
                  <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowSecrets({ ...showSecrets, [signal._id as string]: !showSecrets[signal._id as string] })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets[signal._id] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trade Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={webhook.amount || ''}
                  onChange={(e) => setWebhook(prev => ({
                    ...prev,
                    amount: Number(e.target.value)
                  }))}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                  placeholder="Enter your amount"
                />
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trade Direction
              </label>
              <select
                className="pl-2 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                name="tradeDirection"
                id="tradeDirection"
                value={webhook?.tradeDirection}
                onChange={(e) => setWebhook(prev => ({ ...prev, tradeDirection: e.target.value }))}
              >
                <option value="BOTH">BOTH</option>
                <option value="LONG_ONLY">Long Only</option>
                <option value="SHORT_ONLY">Short Only</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Security Notes:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Enable only trading permissions for these API keys</li>
                    <li>Disable withdrawals for additional security</li>
                    <li>Use IP restrictions when possible</li>
                    <li>Never share your API keys with anyone</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSignal(null)
                  setWebhook({
                    url: '',
                    name: '',
                    coinExApiKey: '',
                    coinExApiSecret: '',
                    tradeDirection: 'BOTH',
                    status: 0,
                    adminHook: signal._id
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => saveApiConfig(signal._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const renderSignalsByPair = () => {
    const sortedSignals = signals.sort((a, b) => {
      if (a.pair !== b.pair) return cryptoPairs.indexOf(a.pair) - cryptoPairs.indexOf(b.pair);
      return timeFrames.indexOf(a.timeframe || '') - timeFrames.indexOf(b.timeframe || '');
    })
    return (
      <div className="mb-12 last:mb-0">
        <div className="grid gap-8 md:grid-cols-3">
          {sortedSignals.map((signal) => (
            <div key={`${signal._id}-${signal.timeframe || '30m'}`} className="relative bg-white rounded-xl shadow-md overflow-hidden group">
              {/* {!isPremium && (
                <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                    <p className="text-gray-800 font-medium">Premium Feature</p>
                  </div>
                </div>
              )} */}
              <div className="relative">
                <Image
                  unoptimized
                  src={signal.imageUrl}
                  alt={signal.pair}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={300}
                />
                <div className="absolute top-4 right-4">
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${signal.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      signal.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }
                  `}>
                    {signal.riskLevel} Risk
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{signal.pair}</h3>
                  <span className="text-sm text-gray-500">{signal.timeframe}</span>
                  {signal?.hook && (
                    <button
                      onClick={() => toggleSignal(signal._id, signal.hook)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${signal.hook.status === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {signal.hook.status === 0 ? 'Enabled' : 'Disabled'}
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">{signal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className={`font-bold ${signal.winRate && signal.winRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>{signal.winRate?.toFixed(2) || 0}%</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Avg. Profit</p>
                    <p className={`font-bold ${signal.avgPnl && signal.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>${signal.avgPnl?.toFixed(2) || 0}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Signal Count</p>
                    <p className="font-bold text-blue-600">{signal.signals}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">24h History</p>
                    <p className="font-bold text-blue-600">{signal.total24 || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 -mx-6 -mb-6 p-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Recommended Leverage:</span>
                    <span className="text-sm text-gray-600">{signal.recommendedLeverage}</span>
                  </div>
                  {/* {signal.timeframe === '30m' && (
                    <p className="text-xs text-gray-500">
                      High volatility - use strict position sizing and isolated margin
                    </p>
                  )} */}
                </div>
              </div>
              <div className="flex justify-center mb-2">
                {(
                  <button
                    onClick={() => {
                      setSignal(signal);
                      if (signal.hook) setWebhook(signal.hook)
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${signal.hook
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      } disabled:bg-yellow-400 disabled:cursor-not-allowed mx-4`}
                    disabled={!isPremium}
                  >
                    {isPremium ?
                      signal.hook ? (
                        <>
                          <Check className="w-4 h-4" />
                          API Configured
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4" />
                          Configure API
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          Upgrade To Premium
                        </>
                      )
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleGetAdminHooks = async () => {
    try {
      const _adminHooks = await getAdminHooks();
      setSignals(_adminHooks);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetAdminHooks();
  }, []);

  const renderPerformanceChart = (data: { labels: string[], values: number[] }) => {
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'PnL %',
          data: data.values,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: { parsed: { y: number } }) {
              return `PnL: ${context.parsed.y.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function (value: string | number) {
              return value + '%';
            }
          }
        }
      }
    };

    return (
      <div className="h-40">
        <Line data={chartData} options={options} />
      </div>
    );
  };

  const renderSignalDetails = (signal: AdminHook) => {
    return (
      <div className="mt-4 border-t pt-4 animate-slide-left">
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2 text-center ${activeTab === 'personal'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            My Results
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 text-center ${activeTab === 'community'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Signal Stats
          </button>
        </div>

        {activeTab === 'personal' && signal.personalStats && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800">Your Investment</h4>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${signal.personalStats.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {signal.personalStats.pnl >= 0 ? '+' : ''}{signal.personalStats.pnlPercent.toFixed(2)}%
                  </span>
                  <Tooltip content="Your total return on investment percentage since subscribing to this signal">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Invested</p>
                  <p className="font-medium">${signal.personalStats.invested.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Current Value</p>
                  <p className="font-medium">${signal.personalStats.currentValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Performance Chart</h4>
              {signal.performanceData && renderPerformanceChart(signal.performanceData)}
            </div>

            {/* Changed from grid to flex column for better mobile display */}
            <div className="flex flex-col space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Total Trades</p>
                    <Tooltip content="Number of trades executed with this signal">
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </Tooltip>
                  </div>
                  <p className="font-medium">{signal.personalStats.trades}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <Tooltip content="Percentage of trades that resulted in profit">
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </Tooltip>
                  </div>
                  <p className="font-medium">{signal.personalStats.winRate}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Avg Hold Time</p>
                    <Tooltip content="Average duration between opening and closing positions">
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </Tooltip>
                  </div>
                  <p className="font-medium">{signal.personalStats.avgHoldTime}</p>
                </div>
              </div>
            </div>

            {signal.recentTrades && signal.recentTrades.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <h4 className="font-medium">Recent Trades</h4>
                  <Tooltip content="Your most recent trades from this signal">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {signal.recentTrades.map((trade, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${trade.type === 'long' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                          {trade.type === 'long' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {trade.type === 'long' ? 'Long' : 'Short'} @ ${trade.entry.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">{trade.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Exit: ${trade.exit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'community' && signal.communityStats && (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <h4 className="font-medium text-indigo-800">Community Overview</h4>
                  <Tooltip content="Statistics from all users following this signal">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-indigo-600">Active Users</p>
                  <p className="font-medium">{signal.communityStats.activeUsers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Total Users</p>
                  <p className="font-medium">{signal.communityStats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Changed from grid to flex column for better spacing */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-1 mb-3">
                  <h4 className="font-medium">Last 24 Hours</h4>
                  <Tooltip content="Performance metrics for the last 24 hours">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trades:</span>
                    <span className="font-medium">{signal.communityStats.last24h.trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium">{signal.communityStats.last24h.winRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total PnL:</span>
                    <span className="font-medium text-green-600 truncate">
                      +${signal.communityStats.last24h.pnl.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-1 mb-3">
                  <h4 className="font-medium">Last 7 Days</h4>
                  <Tooltip content="Performance metrics for the last 7 days">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trades:</span>
                    <span className="font-medium">{signal.communityStats.last7d.trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium">{signal.communityStats.last7d.winRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total PnL:</span>
                    <span className="font-medium text-green-600 truncate">
                      +${signal.communityStats.last7d.pnl.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <h4 className="font-medium">Signal Insights</h4>
                <Tooltip content="Key metrics and insights about this signal's performance">
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </Tooltip>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Best performing during {signal.pair === 'BTC/USDT' ? 'Asian' : signal.pair === 'ETH/USDT' ? 'European' : 'US'} market hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span>Performs best in {signal.pair === 'BTC/USDT' ? 'trending' : signal.pair === 'ETH/USDT' ? 'ranging' : 'volatile'} market conditions</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-gray-500" />
                  <span>Average trade duration: {signal.pair === 'BTC/USDT' ? '4.5 hours' : signal.pair === 'ETH/USDT' ? '6.2 hours' : '45 minutes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span>Recommended max allocation: {signal.pair === 'BTC/USDT' ? '10%' : signal.pair === 'ETH/USDT' ? '15%' : '5%'} of portfolio</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isPremium) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Premium Signals
              <Crown className="w-6 h-6 text-yellow-500" />
            </h1>
          </div>

          {signals.map((signal) => (
            <div
              key={signal.pair}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={signal.imageUrl}
                  alt={signal.pair}
                  className="w-full h-48 object-cover"
                  width={96}
                  height={96}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{signal.pair}</h3>
                  <span className="text-sm text-gray-500">{signal.timeframe}</span>
                </div>
                <p className="text-gray-600 mb-4">{signal.description}</p>
              </div>
            </div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 text-center shadow-xl">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Unlock Premium Features</h2>
              <p className="text-gray-600 mb-6">
                Get access to exclusive premium trading signals and advanced features to maximize your trading potential.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Premium Signals</h3>
                  <p className="text-sm text-gray-600">Access institutional-grade trading signals</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed performance metrics</p>
                </div>
              </div>
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md font-medium"
              >
                Upgrade to Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Premium Signals
            <Crown className="w-6 h-6 text-yellow-500" />
          </h1>
          <Tooltip content="Configure and activate professional-grade trading signals with advanced market analysis." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => (
            <div
              key={signal.pair}
              className="bg-white rounded-lg shadow-md"
            >
              <div className="relative">
                <Image
                  unoptimized
                  src={signal.imageUrl}
                  alt={signal.pair}
                  className="w-full h-48 object-cover"
                  width={96}
                  height={96}
                />
                <div className="absolute top-4 right-4">
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${getRiskLevelColor(signal.riskLevel)}
                  `}>
                    <div className="flex items-center gap-1">
                      {signal.riskLevel} Risk
                      <Tooltip content={`${signal.riskLevel} risk level: ${signal.riskLevel === 'High'
                          ? 'More volatile with higher potential returns but greater risk of loss'
                          : signal.riskLevel === 'Medium'
                            ? 'Balanced risk-reward profile suitable for most traders'
                            : 'Conservative approach with lower returns but higher consistency'
                        }`}>
                        <HelpCircle className="w-3 h-3 text-current opacity-70" />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{signal.pair}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">{signal.timeframe}</span>
                    <Tooltip content={`${signal.timeframe} timeframe: ${signal.timeframe === '5m'
                        ? 'Short-term scalping strategy with frequent trades'
                        : signal.timeframe === '1h'
                          ? 'Medium-term strategy balancing frequency and trend capture'
                          : 'Longer-term strategy focusing on capturing major market moves'
                      }`}>
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </Tooltip>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{signal.description}</p>

                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <Tooltip content="Percentage of trades that result in profit">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <p className={`font-semibold ${signal.winRate && signal.winRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>{signal.winRate?.toFixed(2) || 0}%</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-sm text-gray-500">Avg. Profit</div>
                      <Tooltip content="Average profit per winning trade">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <p className={`font-semibold ${signal.avgPnl && signal.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>${signal.avgPnl?.toFixed(2) || 0}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-sm text-gray-500">Signals</div>
                      <Tooltip content="Total number of signals generated">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <p className="font-semibold text-blue-600">{signal.signals}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-sm text-gray-500">24h History</div>
                      <Tooltip content="History for 24 hours">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <p className="font-semibold text-blue-600">{signal.total24 || 0}</p>
                  </div>
                </div>

                {signal.personalStats && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-blue-700">Your PnL</span>
                        <Tooltip content="Your personal profit and loss from this signal">
                          <HelpCircle className="w-3 h-3 text-blue-400" />
                        </Tooltip>
                      </div>
                      <span className={`font-medium ${signal.personalStats.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {signal.personalStats.pnl >= 0 ? '+' : ''}{signal.personalStats.pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}

                {signal.communityStats && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{signal.communityStats.activeUsers} active users</span>
                      </div>
                      <button
                        onClick={() => toggleExpandSignal(signal._id || '')}
                        className="text-blue-600 text-sm flex items-center gap-1"
                      >
                        {expandedSignal === signal.pair ? 'Hide' : 'Details'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSignal === signal.pair ? 'transform rotate-180' : ''
                          }`} />
                      </button>
                    </div>
                  </div>
                )}

                {!isPremium ? (
                  <button
                    className="w-full py-2 px-4 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center gap-2"
                    disabled
                  >
                    <Lock className="w-4 h-4" />
                    Premium Required
                  </button>
                ) : (
                  <>
                    {!signal.hook ? (
                      <button
                        onClick={() => setShowApiConfig(signal.pair)}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        Configure API
                      </button>
                    ) : (
                      <button
                        onClick={() => setSignals(signals.map(s =>
                          s.pair === signal.pair
                            ? { ...s, enabled: !s.enabled }
                            : s
                        ))}
                        className={`
                          w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors
                          ${signal.enabled
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {signal.enabled ? (
                          <>
                            <Check className="w-4 h-4" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            Enable Signal
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}

                {expandedSignal === signal.pair && renderSignalDetails(signal)}
              </div>
            </div>
          ))}
        </div>

        {showApiConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Configure API Keys for {showApiConfig}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets[showApiConfig] ? 'text' : 'password'}
                      value={apiKeys[showApiConfig]?.key || ''}
                      onChange={(e) => setApiKeys({
                        ...apiKeys,
                        [showApiConfig]: {
                          ...apiKeys[showApiConfig],
                          key: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter your API key"
                    />
                    <button
                      onClick={() => setShowSecrets({
                        ...showSecrets,
                        [showApiConfig]: !showSecrets[showApiConfig]
                      })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showSecrets[showApiConfig] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets[showApiConfig] ? 'text' : 'password'}
                      value={apiKeys[showApiConfig]?.secret || ''}
                      onChange={(e) => setApiKeys({
                        ...apiKeys,
                        [showApiConfig]: {
                          ...apiKeys[showApiConfig],
                          secret: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter your API secret"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Trading Direction
                    </label>
                    <Tooltip content="Choose which trade directions to follow: both long and short, only long (up), or only short (down)">
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                    </Tooltip>
                  </div>
                  <select
                    value={apiKeys[showApiConfig]?.direction || 'Both'}
                    onChange={(e) => setApiKeys({
                      ...apiKeys,
                      [showApiConfig]: {
                        ...apiKeys[showApiConfig],
                        direction: e.target.value
                      }
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Both">Both (Long & Short)</option>
                    <option value="Up Only">Up Only (Long)</option>
                    <option value="Down Only">Down Only (Short)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Trade Amount
                      </label>
                      <Tooltip content="The amount to trade for each signal. Can be a fixed USDT amount or a percentage of your available balance">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      value={apiKeys[showApiConfig]?.amount || '100'}
                      onChange={(e) => setApiKeys({
                        ...apiKeys,
                        [showApiConfig]: {
                          ...apiKeys[showApiConfig],
                          amount: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <Tooltip content="USDT for fixed amount, % for percentage of your available balance">
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </Tooltip>
                    </div>
                    <select
                      value={apiKeys[showApiConfig]?.amountUnit || 'USDT'}
                      onChange={(e) => setApiKeys({
                        ...apiKeys,
                        [showApiConfig]: {
                          ...apiKeys[showApiConfig],
                          amountUnit: e.target.value as 'USDT' | '%'
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="USDT">USDT</option>
                      <option value="%">% of Balance</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowApiConfig(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveApiConfig(showApiConfig)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ApiSecurityWarning
        isOpen={showSecurityWarning}
        onClose={() => setShowSecurityWarning(false)}
        onConfirm={handleApiConfigConfirm}
      />
    </div>
  );
}