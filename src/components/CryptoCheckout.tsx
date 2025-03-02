import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, Clock, AlertTriangle, ArrowRight, Shield, X } from 'lucide-react';

interface CryptoCheckoutProps {
  amount: number;
  plan: string;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = {
  name: string;
  symbol: string;
  network: string;
  address: string;
  amount: string;
  exchangeRate: number;
  confirmations: number;
  requiredConfirmations: number;
  estimatedTime: string;
};

export function CryptoCheckout({ amount, plan, onClose, onSuccess }: CryptoCheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirming' | 'completed' | 'expired'>('pending');

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      network: 'Bitcoin',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      amount: '0.00321',
      exchangeRate: 65000,
      confirmations: 0,
      requiredConfirmations: 2,
      estimatedTime: '10-20 minutes'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      network: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amount: '0.0423',
      exchangeRate: 3500,
      confirmations: 0,
      requiredConfirmations: 12,
      estimatedTime: '3-5 minutes'
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      network: 'Solana',
      address: '7ZFAqtfs1tqwCBhwqG6eaYjvjvNbqJJxqJmetaHBqBjZ',
      amount: '2.145',
      exchangeRate: 95,
      confirmations: 0,
      requiredConfirmations: 32,
      estimatedTime: '< 1 minute'
    }
  ];

  useEffect(() => {
    if (paymentStatus === 'pending' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStatus]);

  useEffect(() => {
    if (selectedMethod && paymentStatus === 'pending') {
      // Simulate payment detection
      const timer = setTimeout(() => {
        setPaymentStatus('confirming');
        // Simulate confirmations
        setTimeout(() => {
          setPaymentStatus('completed');
          onSuccess();
        }, 5000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [selectedMethod, paymentStatus]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (paymentStatus === 'confirming') {
      // Show confirmation before closing during payment
      if (window.confirm('A payment is being processed. Are you sure you want to cancel?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (paymentStatus === 'completed') {
    return (
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your payment has been confirmed and your account has been upgraded to {plan}.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Expired</h2>
        <p className="text-gray-600 mb-6">
          The payment session has expired. Please start a new checkout process.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Start New Payment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-auto relative">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Close checkout"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Upgrade to {plan}</h2>
        <p className="text-gray-600">
          ${amount.toFixed(2)} USD
        </p>
        {!selectedMethod && (
          <p className="text-sm text-gray-500 mt-2">
            Select your preferred payment method
          </p>
        )}
      </div>

      {!selectedMethod ? (
        <>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.symbol}
                onClick={() => setSelectedMethod(method)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="font-medium">{method.symbol}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">Network: {method.network}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel Payment
          </button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <QrCode className="w-32 h-32 mx-auto mb-4 text-white" />
            <p className="text-gray-400 text-sm mb-2">Scan QR code or copy address</p>
            <div className="bg-gray-800 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selectedMethod.address}
                  readOnly
                  className="w-full bg-transparent text-white text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(selectedMethod.address)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-white">
              <p className="text-2xl font-mono mb-1">{selectedMethod.amount} {selectedMethod.symbol}</p>
              <p className="text-sm text-gray-400">≈ ${amount.toFixed(2)} USD</p>
            </div>
          </div>

          {paymentStatus === 'confirming' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Payment Detected</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Waiting for {selectedMethod.requiredConfirmations} confirmations...
                  </p>
                  <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(selectedMethod.confirmations / selectedMethod.requiredConfirmations) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Network</span>
              <span className="font-medium">{selectedMethod.network}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Expected Confirmation Time</span>
              <span className="font-medium">{selectedMethod.estimatedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Required Confirmations</span>
              <span className="font-medium">{selectedMethod.requiredConfirmations}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedMethod(null)}
              className="w-full py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Choose Another Payment Method
            </button>
            <button
              onClick={handleClose}
              className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}