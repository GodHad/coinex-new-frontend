'use client';
import React from 'react';
import { ExternalLink, Star, Shield, DollarSign, Clock, Globe, Zap, Gift, Percent } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';

type Exchange = {
  name: string;
  logo: string;
  description: string;
  pros: string[];
  cons: string[];
  rating: number;
  currentPromo?: {
    title: string;
    description: string;
    expiry?: string;
  };
  features: {
    tradingFee: string;
    leverage: string;
    minDeposit: string;
    assets: string;
  };
  affiliateLink: string;
  comingSoon?: boolean;
};

export function Affiliates() {
  const exchanges: Exchange[] = [
    {
      name: 'Coinex',
      logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=200&h=100',
      description: 'CoinEx is a global cryptocurrency exchange that offers trading services for a wide range of digital assets.',
      pros: [
        'Wide range of cryptocurrencies',
        'Competitive fees',
        'No KYC requirement for basic trading',
        'High liquidity'
      ],
      cons: [
        'High withdrawal fees',
        'Limited regulatory compliance',
        'CET token dependency for discounts'
      ],
      rating: 4.8,
      currentPromo: {
        title: 'New User Bonus',
        description: 'CoinEx offers new users a bonus of up to $100 worth of vouchers. To receive the bonus, users must complete tasks in the Newcomer Zone.',
        expiry: '2025-02-15'
      },
      features: {
        tradingFee: '0.2%',
        leverage: 'Up to 100x',
        minDeposit: 'No minimum deposit.',
        assets: '1000+'
      },
      affiliateLink: 'https://www.coinex.com/'
    },
    {
      name: 'Bybit',
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=200&h=100',
      description: 'Leading derivatives exchange known for its robust trading engine and user-friendly interface.',
      pros: [
        'Fast execution speed',
        'Intuitive interface',
        'Good customer support',
        'Regular promotions'
      ],
      cons: [
        'Lower spot trading volume',
        'Limited payment methods',
        'Fewer trading pairs than competitors'
      ],
      rating: 4.6,
      currentPromo: {
        title: 'Welcome Package',
        description: '$30,000 in rewards for new users',
        expiry: '2024-05-15'
      },
      features: {
        tradingFee: '0.075%',
        leverage: 'Up to 100x',
        minDeposit: '$20',
        assets: '250+'
      },
      affiliateLink: 'https://www.bybit.com/register',
      comingSoon: true
    },
    {
      name: 'KuCoin',
      logo: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=200&h=100',
      description: 'Popular exchange offering a wide range of altcoins and trading features.',
      pros: [
        'Large selection of altcoins',
        'Low trading fees',
        'Advanced trading features',
        'Good mobile app'
      ],
      cons: [
        'Interface can be overwhelming',
        'Slower customer support',
        'Limited fiat options'
      ],
      rating: 4.5,
      currentPromo: {
        title: 'Trading Bonus',
        description: 'Earn up to 40% trading fee rebate',
        expiry: '2024-04-15'
      },
      features: {
        tradingFee: '0.1%',
        leverage: 'Up to 100x',
        minDeposit: '$5',
        assets: '600+'
      },
      affiliateLink: 'https://www.kucoin.com/register',
      comingSoon: true
    }
  ];

  const renderRatingStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Exchange Partners</h1>
            <p className="text-gray-600">
              Exclusive deals and promotions from our trusted exchange partners
            </p>
          </div>
          <Tooltip content="All links include affiliate codes to support our platform">
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {exchanges.map((exchange) => (
            <div key={exchange.name} className="relative bg-white rounded-xl shadow-md overflow-hidden">
              {exchange.comingSoon && (
                <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                    <p className="text-gray-800 font-medium">Coming soon!</p>
                  </div>
                </div>
              )}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                <Image
                  src={exchange.logo}
                  alt={exchange.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                  width={100}
                  height={100}
                />
                <div className="absolute inset-0 p-4">
                  <h2 className="text-2xl font-bold text-white">{exchange.name}</h2>
                  <div className="flex items-center gap-1 mt-2">
                    {renderRatingStars(exchange.rating)}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{exchange.description}</p>

                {exchange.currentPromo && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">{exchange.currentPromo.title}</h3>
                        <p className="text-sm text-yellow-700 mt-1">{exchange.currentPromo.description}</p>
                        {exchange.currentPromo.expiry && (
                          <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {exchange.currentPromo.expiry}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Percent className="w-4 h-4" />
                      <span>Trading Fee: {exchange.features.tradingFee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      <span>Leverage: {exchange.features.leverage}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Min Deposit: {exchange.features.minDeposit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>Assets: {exchange.features.assets}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      Pros
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {exchange.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-600 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cons</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {exchange.cons.map((con, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-red-600 rounded-full" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={exchange.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-center font-medium flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}