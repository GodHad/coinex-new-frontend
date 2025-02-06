'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Crown, ChevronDown, AlertTriangle, Eye, EyeOff, Check, Key, Settings } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import UserContext from '@/contexts/UserContext';
import { AdminHook } from '@/types/admin-hook';
import { getAdminHooks, insertHook, updateHook } from '@/utils/api';
import { Webhook } from '@/types/hooks';
import { toast } from 'react-toastify';

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

const getTimeframeDescription = (timeframe: string, pair: string): string => {
  const base = pair.split('/')[0];
  switch (timeframe) {
    case '5m':
    case '15m':
    case '30m':
      return `Short-term ${base} scalping signals optimized for quick trades. Higher volatility but more frequent opportunities.`;
    case '45m':
    case '1h':
    case '2h':
    case '3h':
      return `Medium-term ${base} trading signals with balanced risk-reward. Ideal for day trading with clearer trend confirmation.`;
    case '4h':
    case '1d':
      return `Long-term ${base} position trading focusing on macro trends. Lower frequency but higher probability setups.`;
    default:
      return '';
  }
};

const getCryptoImage = (pair: string): string => {
  switch (pair) {
    case 'BTC/USDT':
      return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400&h=300';
    case 'ETH/USDT':
      return 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400&h=300';
    case 'SOL/USDT':
      return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400&h=300';
    default: return ''
  }
};

export function Premium() {
  const { user } = useContext(UserContext);
  const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

  const [signals, setSignals] = useState<AdminHook[]>([]);
  const [_signal, setSignal] = useState<AdminHook | null>(null);
  const [webhook, setWebhook] = useState<Webhook>({
    url: '',
    name: '30m ' + _signal?.pair,
    coinExApiKey: '',
    coinExApiSecret: '',
    tradeDirection: 'BOTH',
    adminHook: _signal?._id,
    status: 0,
    amount: 0
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSignal = async (id: string | undefined, hook: Webhook | undefined) => {
    if (!id || !hook) return;
    hook.status = 1 - hook.status;
    const result = await updateHook(hook, true);
    if (result) {
      setSignals(signals.map(w => w._id === id ? { ...w, hook: result.hook } : w));
      toast.success(result.message);
    }
  };

  const saveApiConfig = async () => {
    const result = !webhook._id ? await insertHook({ ...webhook, adminHook: _signal?._id }, true) : await updateHook({ ...webhook, adminHook: _signal?._id }, true);
    if (result) {
      setSignals(prev => prev.map(s => s._id === _signal?._id ? { ...s, hook: result.hook } : s));
      toast.success(result.message);
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
                onClick={() => saveApiConfig()}
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
                  src={getCryptoImage(signal.pair)}
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
                  <p className="text-gray-600 text-sm">{getTimeframeDescription(signal.timeframe || '', signal.pair)}</p>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center mb-4">
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="font-bold text-green-600">{signal.winRate || 0}%</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Avg. Profit</p>
                    <p className="font-bold text-green-600">${signal.avgPnl || 0}</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-500">Signals</p>
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
                    <span className="text-sm text-gray-600">10x</span>
                  </div>
                  {signal.timeframe === '30m' && (
                    <p className="text-xs text-gray-500">
                      High volatility - use strict position sizing and isolated margin
                    </p>
                  )}
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
  }, [])

  if (!isPremium) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Premium Trading Signals</h1>
            <p className="text-xl text-gray-600">Access professional-grade trading signals and boost your trading performance</p>
          </div>

          {renderSignalsByPair()}

          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center mt-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Crown className="w-8 h-8" />
              Upgrade to Premium
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              Get instant access to all premium signals and advanced features
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">Premium Signals</h3>
                <p className="text-sm text-blue-100">Access to all trading pairs</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">Priority Support</h3>
                <p className="text-sm text-blue-100">24/7 dedicated assistance</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-blue-100">Detailed performance metrics</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-bold">Premium Trading Signals</h1>
          <Tooltip content="Configure and activate professional-grade trading signals with advanced market analysis." />
        </div>

        {renderSignalsByPair()}

        {_signal && renderApiConfig(_signal)}
      </div>
    </div>
  );
}