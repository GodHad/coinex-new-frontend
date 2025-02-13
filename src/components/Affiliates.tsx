'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, Star, Shield, DollarSign, Clock, Globe, Zap, Gift, Percent } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { Exchange } from '@/types/exchanges-data';
import { getExchangesData } from '@/utils/api';
import { toast } from 'react-toastify';

export function Affiliates() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const handleGetExchangesData = async () => {
    try {
      const result = await getExchangesData();
      if (result?.data) {
        setExchanges(result.data);
      } else {
        console.error("Unexpected API response:", result);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching exchanges:", error);
      toast.error("Failed to fetch exchanges.");
    }
  }

  useEffect(() => {
    handleGetExchangesData();
  }, [])

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
              {!exchange.enabled && (
                <div className="absolute inset-0 backdrop-blur-[7px] bg-black/70 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white font-medium">Coming soon!</p>
                  </div>
                </div>
              )}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                <Image
  unoptimized
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
                      <span>Trading Fee: {exchange.tradingFee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      <span>Leverage: {exchange.leverage}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Min Deposit: {exchange.minDeposit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>Assets: {exchange.assets}</span>
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