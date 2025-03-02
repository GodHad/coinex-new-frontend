'use client';
import React, { useState } from 'react';
import { Crown, Check, AlertTriangle, Webhook, BarChart2, Activity } from 'lucide-react';
import { CryptoCheckout } from './CryptoCheckout';

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: {
    text: string;
    included: boolean;
  }[];
  webhookLimit: number;
  description: string;
};

export function Subscription() {
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: selectedInterval,
      webhookLimit: 2,
      description: 'Basic webhook functionality for simple automation',
      features: [
        { text: 'Up to 2 standard webhooks', included: true },
        { text: 'Basic API logs', included: true },
        { text: '24h API log retention', included: true },
        { text: 'Standard webhook endpoints', included: true },
        { text: 'Position tracking', included: false },
        { text: 'PnL statistics', included: false },
        { text: 'Premium signals', included: false },
        { text: 'Extended API logs', included: false }
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: selectedInterval === 'month' ? 19 : 190,
      interval: selectedInterval,
      webhookLimit: 20,
      description: 'Enhanced features for serious traders',
      features: [
        { text: 'Up to 20 standard webhooks', included: true },
        { text: 'Basic API logs', included: true },
        { text: '7-day API log retention', included: true },
        { text: 'Standard webhook endpoints', included: true },
        { text: 'Position tracking', included: true },
        { text: 'PnL statistics', included: true },
        { text: 'Premium signals', included: false },
        { text: 'Extended API logs', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: selectedInterval === 'month' ? 49 : 490,
      interval: selectedInterval,
      webhookLimit: 100,
      description: 'Full access to all features and premium signals',
      features: [
        { text: 'Up to 100 standard webhooks', included: true },
        { text: 'Detailed API logs', included: true },
        { text: '30-day API log retention', included: true },
        { text: 'Advanced webhook endpoints', included: true },
        { text: 'Position tracking', included: true },
        { text: 'PnL statistics', included: true },
        { text: 'Premium signals', included: true },
        { text: 'Extended API logs', included: true }
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.id !== 'free') {
      setSelectedPlanId(planId);
      setShowCheckout(true);
    }
  };

  const handleCheckoutSuccess = () => {
    // Here you would integrate with your backend to update the user's subscription
    console.log('Subscription updated:', selectedPlanId);
    setShowCheckout(false);
    setSelectedPlanId(null);
  };

  if (showCheckout && selectedPlanId) {
    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return null;

    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <CryptoCheckout
          amount={plan.price}
          plan={plan.name}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your trading needs. All plans include basic webhook functionality.
          </p>
        </div>

        {/* Important Notice */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Important Information</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a DIY (Do It Yourself) service provided as-is. We do not offer personalized support or trading advice. 
                  Users are responsible for their own trading decisions and implementation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <div className="flex space-x-1">
              <button
                onClick={() => setSelectedInterval('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedInterval === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedInterval('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedInterval === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-green-500">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.id === 'premium' ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {plan.id === 'premium' && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-8">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-2">/{plan.interval}</span>
                    </>
                  )}
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Webhook className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {plan.webhookLimit} webhook{plan.webhookLimit !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${
                          feature.included ? 'text-green-500' : 'text-gray-300'
                        } flex-shrink-0`} />
                        <span className={feature.included ? 'text-gray-600' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    plan.id === 'premium'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.id === 'free'
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {plan.id === 'free' ? (
                    'Get Started'
                  ) : plan.id === 'premium' ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Upgrade to Premium
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Webhook className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Webhook Management</h3>
              <p className="text-gray-600">
                Create and manage webhooks for automated trading. Higher tiers allow for more webhooks and advanced endpoints.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Track your trading performance with detailed statistics and PnL tracking in paid plans.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2">API Monitoring</h3>
              <p className="text-gray-600">
                Monitor your API usage and webhook activity with detailed logs and extended retention periods.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept cryptocurrency payments only (BTC, ETH, SOL) for enhanced privacy and security.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Changes will be effective immediately.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                As this is a self-service platform, we do not offer refunds. You can cancel your subscription at any time.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">How do I get started?</h3>
              <p className="text-gray-600">
                Choose your plan, complete the crypto payment, and your account will be upgraded instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}