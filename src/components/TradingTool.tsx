'use client';
import React, { useState } from 'react';
import { Calculator, BarChart2, ArrowRightLeft, Settings, AlertTriangle, DollarSign, Percent, ChevronDown, ArrowRight, Info } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

type CalculatorType = 'position' | 'risk' | 'pnl' | 'leverage' | null;

export function Tools() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(null);
  const [showLeverageInfo, setShowLeverageInfo] = useState(false);

  // Position Size Calculator State
  const [positionCalc, setPositionCalc] = useState({
    accountBalance: '',
    riskPercentage: '',
    entryPrice: '',
    stopLoss: ''
  });

  // Risk/Reward Calculator State
  const [riskCalc, setRiskCalc] = useState({
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: ''
  });

  // PnL Calculator State
  const [pnlCalc, setPnlCalc] = useState({
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    leverage: '',
    isLong: true
  });

  // Leverage Calculator State
  const [leverageCalc, setLeverageCalc] = useState({
    collateral: '',
    leverage: '',
    entryPrice: '',
    positionSize: ''
  });

  const calculatePositionSize = () => {
    const balance = parseFloat(positionCalc.accountBalance);
    const risk = parseFloat(positionCalc.riskPercentage);
    const entry = parseFloat(positionCalc.entryPrice);
    const stop = parseFloat(positionCalc.stopLoss);

    if (balance && risk && entry && stop) {
      const riskAmount = (balance * (risk / 100));
      const priceDiff = Math.abs(entry - stop);
      const positionSize = (riskAmount / priceDiff) * entry;
      return positionSize.toFixed(4);
    }
    return '0';
  };

  const calculateRiskReward = () => {
    const entry = parseFloat(riskCalc.entryPrice);
    const stop = parseFloat(riskCalc.stopLoss);
    const target = parseFloat(riskCalc.takeProfit);
    const size = parseFloat(riskCalc.positionSize);

    if (entry && stop && target && size) {
      const risk = Math.abs(entry - stop) * size;
      const reward = Math.abs(target - entry) * size;
      const ratio = (reward / risk).toFixed(2);
      return {
        risk: risk.toFixed(2),
        reward: reward.toFixed(2),
        ratio
      };
    }
    return { risk: '0', reward: '0', ratio: '0' };
  };

  const calculatePnL = () => {
    const entry = parseFloat(pnlCalc.entryPrice);
    const exit = parseFloat(pnlCalc.exitPrice);
    const size = parseFloat(pnlCalc.positionSize);
    const leverage = parseFloat(pnlCalc.leverage);

    if (entry && exit && size && leverage) {
      const direction = pnlCalc.isLong ? 1 : -1;
      const priceDiff = (exit - entry) * direction;
      const pnl = (priceDiff / entry) * size * leverage;
      const roi = (pnl / (size / leverage)) * 100;
      return {
        pnl: pnl.toFixed(2),
        roi: roi.toFixed(2)
      };
    }
    return { pnl: '0', roi: '0' };
  };

  const calculateLeverage = () => {
    const collateral = parseFloat(leverageCalc.collateral);
    const leverage = parseFloat(leverageCalc.leverage);
    const entry = parseFloat(leverageCalc.entryPrice);

    if (collateral && leverage && entry) {
      const maxPosition = collateral * leverage;
      const liquidationPrice = entry * (1 - (1 / leverage));
      return {
        maxPosition: maxPosition.toFixed(2),
        liquidationPrice: liquidationPrice.toFixed(2)
      };
    }
    return { maxPosition: '0', liquidationPrice: '0' };
  };

  const renderPositionCalculator = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Balance (USDT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={positionCalc.accountBalance}
              onChange={(e) => setPositionCalc({ ...positionCalc, accountBalance: e.target.value })}
              className="pl-8 w-full rounded-lg border-gray-300"
              placeholder="1000"
            />
            <DollarSign className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Risk Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              value={positionCalc.riskPercentage}
              onChange={(e) => setPositionCalc({ ...positionCalc, riskPercentage: e.target.value })}
              className="pl-8 w-full rounded-lg border-gray-300"
              placeholder="1"
            />
            <Percent className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price
          </label>
          <input
            type="number"
            value={positionCalc.entryPrice}
            onChange={(e) => setPositionCalc({ ...positionCalc, entryPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss
          </label>
          <input
            type="number"
            value={positionCalc.stopLoss}
            onChange={(e) => setPositionCalc({ ...positionCalc, stopLoss: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="49500"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-blue-800 font-medium">Recommended Position Size:</span>
          <span className="text-blue-800 font-bold">{calculatePositionSize()} USDT</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Position Size Guidelines:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Never risk more than 1-2% of your account per trade</li>
          <li>• Consider fees in your calculations</li>
          <li>• Account for slippage in volatile markets</li>
          <li>• Adjust position size based on market conditions</li>
        </ul>
      </div>
    </div>
  );

  const renderRiskCalculator = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price
          </label>
          <input
            type="number"
            value={riskCalc.entryPrice}
            onChange={(e) => setRiskCalc({ ...riskCalc, entryPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position Size (USDT)
          </label>
          <input
            type="number"
            value={riskCalc.positionSize}
            onChange={(e) => setRiskCalc({ ...riskCalc, positionSize: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="1000"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss
          </label>
          <input
            type="number"
            value={riskCalc.stopLoss}
            onChange={(e) => setRiskCalc({ ...riskCalc, stopLoss: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="49500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Take Profit
          </label>
          <input
            type="number"
            value={riskCalc.takeProfit}
            onChange={(e) => setRiskCalc({ ...riskCalc, takeProfit: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="51000"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Potential Risk:</span>
            <span className="font-bold text-red-600">-${calculateRiskReward().risk}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Potential Reward:</span>
            <span className="font-bold text-green-600">+${calculateRiskReward().reward}</span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-100 pt-2">
            <span className="text-blue-800 font-medium">Risk/Reward Ratio:</span>
            <span className="font-bold text-blue-800">1:{calculateRiskReward().ratio}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Risk/Reward Guidelines:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Aim for a minimum R:R ratio of 1:2</li>
          <li>• Consider market structure for target placement</li>
          <li>• Place stops at logical market levels</li>
          <li>• Account for spread and fees in calculations</li>
        </ul>
      </div>
    </div>
  );

  const renderPnLCalculator = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price
          </label>
          <input
            type="number"
            value={pnlCalc.entryPrice}
            onChange={(e) => setPnlCalc({ ...pnlCalc, entryPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exit Price
          </label>
          <input
            type="number"
            value={pnlCalc.exitPrice}
            onChange={(e) => setPnlCalc({ ...pnlCalc, exitPrice: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="51000"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position Size (USDT)
          </label>
          <input
            type="number"
            value={pnlCalc.positionSize}
            onChange={(e) => setPnlCalc({ ...pnlCalc, positionSize: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leverage
          </label>
          <input
            type="number"
            value={pnlCalc.leverage}
            onChange={(e) => setPnlCalc({ ...pnlCalc, leverage: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPnlCalc({ ...pnlCalc, isLong: true })}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            pnlCalc.isLong
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Long
        </button>
        <button
          onClick={() => setPnlCalc({ ...pnlCalc, isLong: false })}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            !pnlCalc.isLong
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Short
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Profit/Loss:</span>
            <span className={`font-bold ${
              parseFloat(calculatePnL().pnl) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(calculatePnL().pnl) >= 0 ? '+' : ''}{calculatePnL().pnl} USDT
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-100 pt-2">
            <span className="text-blue-800">ROI:</span>
            <span className={`font-bold ${
              parseFloat(calculatePnL().roi) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(calculatePnL().roi) >= 0 ? '+' : ''}{calculatePnL().roi}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">PnL Calculation Notes:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Results exclude trading fees</li>
          <li>• Higher leverage amplifies both gains and losses</li>
          <li>• Consider funding rates for perpetual futures</li>
          <li>• Account for slippage in actual trades</li>
        </ul>
      </div>
    </div>
  );

  const renderLeverageCalculator = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collateral (USDT)
          </label>
          <input
            type="number"
            value={leverageCalc.collateral}
            onChange={(e) => setLeverageCalc({ ...leverageCalc, collateral: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leverage
          </label>
          <input
            type="number"
            value={leverageCalc.leverage}
            onChange={(e) => setLeverageCalc({ ...leverageCalc, leverage: e.target.value })}
            className="w-full rounded-lg border-gray-300"
            placeholder="10"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Entry Price
        </label>
        <input
          type="number"
          value={leverageCalc.entryPrice}
          onChange={(e) => setLeverageCalc({ ...leverageCalc, entryPrice: e.target.value })}
          className="w-full rounded-lg border-gray-300"
          placeholder="50000"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Maximum Position Size:</span>
            <span className="font-bold text-blue-800">{calculateLeverage().maxPosition} USDT</span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-100 pt-2">
            <span className="text-blue-800">Liquidation Price (Long):</span>
            <span className="font-bold text-red-600">{calculateLeverage().liquidationPrice} USDT</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowLeverageInfo(true)}
        className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Info className="w-4 h-4" />
        Learn About Leverage Risks
      </button>

      {showLeverageInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Understanding Leverage Risks</h3>
              <button
                onClick={() => setShowLeverageInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">What is Leverage?</h4>
                <p className="text-gray-600 text-sm">
                  Leverage allows you to open positions larger than your capital by borrowing funds. While this can amplify profits, it also magnifies losses and increases risks significantly.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Risk Levels</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">Low (1-5x):</span>
                    <p className="text-sm text-green-600">Suitable for beginners. Lower risk but also lower potential returns.</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-yellow-800">Medium (5-10x):</span>
                    <p className="text-sm text-yellow-600">For experienced traders. Requires active management and strong risk controls.</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">High (10x+):</span>
                    <p className="text-sm text-red-600">For experts only. Extremely high risk of liquidation.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Start with lower leverage until you gain experience</li>
                  <li>• Never use maximum leverage available</li>
                  <li>• Always use stop-loss orders</li>
                  <li>• Monitor your positions regularly</li>
                  <li>• Consider market volatility when selecting leverage</li>
                  <li>• Use isolated margin instead of cross margin when possible</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Liquidation Explained</h4>
                <p className="text-sm text-gray-600">
                  Liquidation occurs when losses approach your collateral value. The exchange will close your position to prevent further losses. Higher leverage means liquidation can happen with smaller price movements.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Example Scenario</h4>
                <p className="text-sm text-blue-600">
                  With 10x leverage, a 10% price movement against your position would result in a 100% loss of your collateral. The same price movement with 2x leverage would only result in a 20% loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'position':
        return renderPositionCalculator();
      case 'risk':
        return renderRiskCalculator();
      case 'pnl':
        return renderPnLCalculator();
      case 'leverage':
        return renderLeverageCalculator();
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Trading Tools</h1>
          <Tooltip content="Helpful tools and calculators for trading">
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Size Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Position Size Calculator</h2>
            </div>
            <p className="text-gray-600 mb-4">Calculate optimal position sizes based on your risk tolerance and account balance.</p>
            <button
              onClick={() => setActiveCalculator(activeCalculator === 'position' ? null : 'position')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {activeCalculator === 'position' ? 'Close Calculator' : 'Open Calculator'}
              <ArrowRight className="w-4 h-4" />
            </button>
            {activeCalculator === 'position' && (
              <div className="mt-6 border-t pt-6">
                {renderCalculator()}
              </div>
            )}
          </div>

          {/* Risk/Reward Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Risk/Reward Calculator</h2>
            </div>
            <p className="text-gray-600 mb-4">Analyze potential trades with our risk/reward ratio calculator.</p>
            <button
              onClick={() => setActiveCalculator(activeCalculator === 'risk' ? null : 'risk')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {activeCalculator === 'risk' ? 'Close Calculator' : 'Calculate R/R'}
              <ArrowRight className="w-4 h-4" />
            </button>
            {activeCalculator === 'risk' && (
              <div className="mt-6 border-t pt-6">
                {renderCalculator()}
              </div>
            )}
          </div>

          {/* PnL Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">PnL Calculator</h2>
            </div>
            <p className="text-gray-600 mb-4">Calculate potential profits and losses for your trades including fees.</p>
            <button
              onClick={() => setActiveCalculator(activeCalculator === 'pnl' ? null : 'pnl')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {activeCalculator === 'pnl' ? 'Close Calculator' : 'Calculate PnL'}
              <ArrowRight className="w-4 h-4" />
            </button>
            {activeCalculator === 'pnl' && (
              <div className="mt-6 border-t pt-6">
                {renderCalculator()}
              </div>
            )}
          </div>

          {/* Leverage Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Leverage Calculator</h2>
            </div>
            <p className="text-gray-600 mb-4">Understand the risks and requirements for different leverage levels.</p>
            <button
              onClick={() => setActiveCalculator(activeCalculator === 'leverage' ? null : 'leverage')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {activeCalculator === 'leverage' ? 'Close Calculator' : 'Calculate Leverage'}
              <ArrowRight className="w-4 h-4" />
            </button>
            {activeCalculator === 'leverage' && (
              <div className="mt-6 border-t pt-6">
                {renderCalculator()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Important Note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                These calculators are tools to assist in your trading decisions. Always conduct your own research and never risk more than you can afford to lose. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}