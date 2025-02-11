'use client'
import React, { useState } from 'react';
import { Star, Clock, Gift, Plus, Pencil, Save, Trash2, Image as ImageIcon, Check, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Tooltip } from '../../components/Tooltip';

type Exchange = {
  id: string;
  name: string;
  logo: string;
  description: string;
  pros: string[];
  cons: string[];
  rating: number;
  currentPromo?: {
    title: string;
    description: string;
    expiry: string;
  };
  features: {
    tradingFee: string;
    leverage: string;
    minDeposit: string;
    assets: string;
  };
  affiliateLink: string;
  enabled: boolean;
};

const defaultExchange: Partial<Exchange> = {
  name: '',
  logo: '',
  description: '',
  pros: [],
  cons: [],
  rating: 4.0,
  features: {
    tradingFee: '',
    leverage: '',
    minDeposit: '',
    assets: ''
  },
  enabled: false
};

const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              (hoverRating !== null ? star <= hoverRating : star <= rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export function ExchangePartners() {
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: '1',
      name: 'CoinEx',
      logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=200&h=100',
      description: 'The world\'s largest crypto exchange by trading volume, offering a comprehensive suite of trading services.',
      pros: [
        'High liquidity across all pairs',
        'Extensive feature set',
        'Competitive fees',
        'Advanced trading tools'
      ],
      cons: [
        'Complex for beginners',
        'Limited customer support',
        'Regulatory concerns in some regions'
      ],
      rating: 4.8,
      currentPromo: {
        title: 'New User Bonus',
        description: 'Get up to $100 in trading fee rebates',
        expiry: '2024-04-30'
      },
      features: {
        tradingFee: '0.1%',
        leverage: 'Up to 125x',
        minDeposit: '$10',
        assets: '350+'
      },
      affiliateLink: 'https://www.coinex.com/register?rc=rbcgu',
      enabled: true
    }
  ]);

  const [editingExchange, setEditingExchange] = useState<Exchange | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Exchange>>(defaultExchange);
  const [expandedExchangeId, setExpandedExchangeId] = useState<string | null>(null);

  const handleSaveExchange = () => {
    if (editingExchange) {
      setExchanges(exchanges.map(e => e.id === editingExchange.id ? { ...formData, id: editingExchange.id } as Exchange : e));
      setEditingExchange(null);
    } else {
      setExchanges([...exchanges, { ...formData, id: Math.random().toString(36).substring(7) } as Exchange]);
    }
    setShowNewForm(false);
    setFormData(defaultExchange);
    setExpandedExchangeId(null);
  };

  const handleDeleteExchange = (id: string) => {
    setExchanges(exchanges.filter(e => e.id !== id));
    setExpandedExchangeId(null);
    setEditingExchange(null);
    setFormData(defaultExchange);
  };

  const toggleExchange = (id: string) => {
    setExchanges(exchanges.map(e => 
      e.id === id ? { ...e, enabled: !e.enabled } : e
    ));
  };

  const startEditing = (exchange: Exchange) => {
    setEditingExchange(exchange);
    setFormData({
      ...exchange,
      currentPromo: exchange.currentPromo ? { ...exchange.currentPromo } : undefined,
      features: { ...exchange.features },
      pros: [...exchange.pros],
      cons: [...exchange.cons]
    });
  };

  const cancelEditing = () => {
    setEditingExchange(null);
    setShowNewForm(false);
    setFormData(defaultExchange);
    setExpandedExchangeId(null);
  };

  const renderExchangeForm = () => (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="e.g., CoinEx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="flex-1 rounded-lg border-gray-300"
              placeholder="Enter logo URL..."
            />
            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <StarRating
          rating={formData.rating || 0}
          onChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border-gray-300"
          rows={3}
          placeholder="Enter exchange description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pros</label>
          <div className="space-y-2">
            {formData.pros?.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => {
                    const newPros = [...(formData.pros || [])];
                    newPros[index] = e.target.value;
                    setFormData({ ...formData, pros: newPros });
                  }}
                  className="flex-1 rounded-lg border-gray-300"
                />
                <button
                  onClick={() => {
                    const newPros = formData.pros?.filter((_, i) => i !== index);
                    setFormData({ ...formData, pros: newPros });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setFormData({
                ...formData,
                pros: [...(formData.pros || []), '']
              })}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Pro
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cons</label>
          <div className="space-y-2">
            {formData.cons?.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => {
                    const newCons = [...(formData.cons || [])];
                    newCons[index] = e.target.value;
                    setFormData({ ...formData, cons: newCons });
                  }}
                  className="flex-1 rounded-lg border-gray-300"
                />
                <button
                  onClick={() => {
                    const newCons = formData.cons?.filter((_, i) => i !== index);
                    setFormData({ ...formData, cons: newCons });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setFormData({
                ...formData,
                cons: [...(formData.cons || []), '']
              })}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Con
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trading Fee</label>
            <input
              type="text"
              value={formData.features?.tradingFee}
              onChange={(e) => setFormData({
                ...formData,
                features: { ...(formData.features || {}), tradingFee: e.target.value, leverage: formData.features?.leverage || '', minDeposit: formData.features?.minDeposit || '', assets: formData.features?.assets || '' }
              })}
              className="w-full rounded-lg border-gray-300"
              placeholder="e.g., 0.1%"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Leverage</label>
            <input
              type="text"
              value={formData.features?.leverage}
              onChange={(e) => setFormData({
                ...formData,
                features: { 
                  tradingFee: formData.features?.tradingFee || '', 
                  leverage: e.target.value, 
                  minDeposit: formData.features?.minDeposit || '', 
                  assets: formData.features?.assets || '' 
                }
              })}
              className="w-full rounded-lg border-gray-300"
              placeholder="e.g., Up to 125x"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Deposit</label>
            <input
              type="text"
              value={formData.features?.minDeposit}
              onChange={(e) => setFormData({
                ...formData,
                features: { 
                  tradingFee: formData.features?.tradingFee || '', 
                  leverage: formData.features?.leverage || '', 
                  minDeposit: e.target.value, 
                  assets: formData.features?.assets || '' 
                }
              })}
              className="w-full rounded-lg border-gray-300"
              placeholder="e.g., $10"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Assets</label>
            <input
              type="text"
              value={formData.features?.assets}
              onChange={(e) => setFormData({
                ...formData,
                features: { 
                  tradingFee: formData.features?.tradingFee || '', 
                  leverage: formData.features?.leverage || '', 
                  minDeposit: formData.features?.minDeposit || '', 
                  assets: e.target.value 
                }
              })}
              className="w-full rounded-lg border-gray-300"
              placeholder="e.g., 350+"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Link</label>
        <input
          type="text"
          value={formData.affiliateLink}
          onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
          className="w-full rounded-lg border-gray-300"
          placeholder="Enter affiliate link..."
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={cancelEditing}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveExchange}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Exchange
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Exchange Partners</h2>
              <Tooltip content="Manage exchange partner listings and affiliate programs">
              </Tooltip>
            </div>
            <button
              onClick={() => {
                setShowNewForm(true);
                setFormData(defaultExchange);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Exchange
            </button>
          </div>
        </div>

        {showNewForm && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-4">Add New Exchange</h3>
            {renderExchangeForm()}
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {exchanges.map((exchange) => (
            <div key={exchange.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleExchange(exchange.id)}
                    className={`p-2 rounded-full ${
                      exchange.enabled
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {exchange.enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{exchange.name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < exchange.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{exchange.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedExchangeId(expandedExchangeId === exchange.id ? null : exchange.id)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedExchangeId === exchange.id ? 'transform rotate-180' : ''
                    }`} />
                  </button>
                  <button
                    onClick={() => startEditing(exchange)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExchange(exchange.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedExchangeId === exchange.id && (
                <div className="mt-4 space-y-4">
                  <Image
                    src={exchange.logo}
                    alt={exchange.name}
                    width={200}
                    height={100}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {exchange.pros.map((pro, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {exchange.cons.map((con, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <X className="w-4 h-4 text-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Trading Fee</p>
                      <p className="font-medium">{exchange.features.tradingFee}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Leverage</p>
                      <p className="font-medium">{exchange.features.leverage}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Min Deposit</p>
                      <p className="font-medium">{exchange.features.minDeposit}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Assets</p>
                      <p className="font-medium">{exchange.features.assets}</p>
                    </div>
                  </div>

                  {exchange.currentPromo && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Gift className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-yellow-800">{exchange.currentPromo.title}</h3>
                          <p className="text-sm text-yellow-700 mt-1">{exchange.currentPromo.description}</p>
                          <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {exchange.currentPromo.expiry}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editingExchange?.id === exchange.id && (
                <div className="mt-4 border-t pt-4">
                  {renderExchangeForm()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}