'use client';
import React, { useState } from 'react';
import { Crown, Lock, ChevronDown, AlertTriangle, Clock, TrendingUp, LineChart, Eye, EyeOff, Check, Key, Settings } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';

type TimeFrame = '5m' | '1h' | '3h';
type CryptoPair = 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT';

type PremiumSignal = {
  pair: CryptoPair;
  timeframe: TimeFrame;
  description: string;
  image: string;
  stats: {
    winRate: string;
    avgProfit: string;
    signals: string;
  };
  riskLevel: 'High' | 'Medium' | 'Low';
  recommendedLeverage: string;
  enabled?: boolean;
  apiConfigured?: boolean;
};

const getTimeframeDescription = (timeframe: TimeFrame, pair: CryptoPair): string => {
  const base = pair.split('/')[0];
  switch (timeframe) {
    case '5m':
      return `Short-term ${base} scalping signals optimized for quick trades. Higher volatility but more frequent opportunities.`;
    case '1h':
      return `Medium-term ${base} trading signals with balanced risk-reward. Ideal for day trading with clearer trend confirmation.`;
    case '3h':
      return `Long-term ${base} position trading focusing on macro trends. Lower frequency but higher probability setups.`;
  }
};

const getCryptoImage = (pair: CryptoPair): string => {
  switch (pair) {
    case 'BTC/USDT':
      return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400&h=300';
    case 'ETH/USDT':
      return 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400&h=300';
    case 'SOL/USDT':
      return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400&h=300';
  }
};

const createSignalData = (
  pair: CryptoPair,
  timeframe: TimeFrame,
  riskLevel: 'High' | 'Medium' | 'Low',
  recommendedLeverage: string,
  signalsPerMonth: string,
  winRate: string,
  avgProfit: string
): PremiumSignal => ({
  pair,
  timeframe,
  description: getTimeframeDescription(timeframe, pair),
  image: getCryptoImage(pair),
  stats: {
    winRate,
    avgProfit,
    signals: signalsPerMonth
  },
  riskLevel,
  recommendedLeverage
});

const initialPremiumSignals: PremiumSignal[] = [
  // BTC Signals
  createSignalData('BTC/USDT', '5m', 'High', '5x-10x', '100-120/month', '68%', '1.2%'),
  createSignalData('BTC/USDT', '1h', 'Medium', '10x-20x', '40-50/month', '76%', '2.8%'),
  createSignalData('BTC/USDT', '3h', 'Low', '20x-50x', '15-20/month', '82%', '4.5%'),
  
  // ETH Signals
  createSignalData('ETH/USDT', '5m', 'High', '5x-10x', '90-110/month', '65%', '1.5%'),
  createSignalData('ETH/USDT', '1h', 'Medium', '10x-20x', '35-45/month', '72%', '3.2%'),
  createSignalData('ETH/USDT', '3h', 'Low', '20x-50x', '12-15/month', '79%', '5.1%'),
  
  // SOL Signals
  createSignalData('SOL/USDT', '5m', 'High', '3x-8x', '80-100/month', '63%', '1.8%'),
  createSignalData('SOL/USDT', '1h', 'Medium', '8x-15x', '30-40/month', '70%', '3.8%'),
  createSignalData('SOL/USDT', '3h', 'Low', '15x-30x', '10-12/month', '77%', '6.2%')
];

interface PremiumProps {
  isPremium?: boolean;
}

export function Premium({ isPremium = true }: PremiumProps) {
  const [signals, setSignals] = useState<PremiumSignal[]>(initialPremiumSignals.map(signal => ({
    ...signal,
    enabled: false,
    apiConfigured: false
  })));
  const [showApiConfig, setShowApiConfig] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, { key: string; secret: string }>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSignal = (pair: string, timeframe: string) => {
    setSignals(signals.map(signal => 
      signal.pair === pair && signal.timeframe === timeframe
        ? { ...signal, enabled: !signal.enabled }
        : signal
    ));
  };

  const saveApiConfig = (pair: string) => {
    if (apiKeys[pair]?.key && apiKeys[pair]?.secret) {
      setSignals(signals.map(signal =>
        signal.pair === pair
          ? { ...signal, apiConfigured: true }
          : signal
      ));
      setShowApiConfig(null);
    }
  };

  const getTimeframeIcon = (timeframe: TimeFrame) => {
    switch (timeframe) {
      case '5m':
        return <Clock className="w-4 h-4" />;
      case '1h':
        return <TrendingUp className="w-4 h-4" />;
      case '3h':
        return <LineChart className="w-4 h-4" />;
    }
  };

  const renderApiConfig = (pair: CryptoPair) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Configure API for {pair}</h3>
          <button
            onClick={() => setShowApiConfig(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKeys[pair]?.key || ''}
                onChange={(e) => setApiKeys({
                  ...apiKeys,
                  [pair]: { ...apiKeys[pair], key: e.target.value }
                })}
                className="pl-10 w-full rounded-lg border-gray-300"
                placeholder="Enter your API key"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Secret
            </label>
            <div className="relative">
              <input
                type={showSecrets[pair] ? 'text' : 'password'}
                value={apiKeys[pair]?.secret || ''}
                onChange={(e) => setApiKeys({
                  ...apiKeys,
                  [pair]: { ...apiKeys[pair], secret: e.target.value }
                })}
                className="pl-10 pr-10 w-full rounded-lg border-gray-300"
                placeholder="Enter your API secret"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowSecrets({ ...showSecrets, [pair]: !showSecrets[pair] })}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showSecrets[pair] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
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
              onClick={() => setShowApiConfig(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => saveApiConfig(pair)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignalsByPair = (pair: CryptoPair) => {
    const pairSignals = signals.filter(signal => signal.pair === pair);
    const isConfigured = pairSignals.some(signal => signal.apiConfigured);
    
    return (
      <div className="mb-12 last:mb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{pair} Signals</h2>
          {isPremium && (
            <button
              onClick={() => setShowApiConfig(pair)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isConfigured
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isConfigured ? (
                <>
                  <Check className="w-4 h-4" />
                  API Configured
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  Configure API
                </>
              )}
            </button>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {pairSignals.map((signal) => (
            <div key={`${signal.pair}-${signal.timeframe}`} className="relative bg-white rounded-xl shadow-md overflow-hidden group">
              {!isPremium && (
                <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                    <p className="text-gray-800 font-medium">Premium Feature</p>
                  </div>
                </div>
              )}
              <Image
                src={signal.image}
                alt={signal.pair}
                className="w-full h-48 object-cover"
                width={400}
                height={300}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTimeframeIcon(signal.timeframe)}
                    <h3 className="text-xl font-bold">{signal.timeframe} Chart</h3>
                  </div>
                  {isPremium && signal.apiConfigured && (
                    <button
                      onClick={() => toggleSignal(signal.pair, signal.timeframe)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        signal.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {signal.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">{signal.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="font-bold text-green-600">{signal.stats.winRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Profit</p>
                    <p className="font-bold text-green-600">{signal.stats.avgProfit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Signals</p>
                    <p className="font-bold text-blue-600">{signal.stats.signals}</p>
                  </div>
                </div>

                <div className="bg-gray-50 -mx-6 -mb-6 p-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Recommended Leverage:</span>
                    <span className="text-sm text-gray-600">{signal.recommendedLeverage}</span>
                  </div>
                  {signal.timeframe === '5m' && (
                    <p className="text-xs text-gray-500">
                      High volatility - use strict position sizing and isolated margin
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isPremium) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Premium Trading Signals</h1>
            <p className="text-xl text-gray-600">Access professional-grade trading signals and boost your trading performance</p>
          </div>

          {renderSignalsByPair('BTC/USDT')}
          {renderSignalsByPair('ETH/USDT')}
          {renderSignalsByPair('SOL/USDT')}

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

        {renderSignalsByPair('BTC/USDT')}
        {renderSignalsByPair('ETH/USDT')}
        {renderSignalsByPair('SOL/USDT')}

        {showApiConfig && renderApiConfig(showApiConfig as CryptoPair)}
      </div>
    </div>
  );
}