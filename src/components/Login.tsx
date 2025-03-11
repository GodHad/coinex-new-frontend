'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import UserContext from '@/contexts/UserContext';
import { redirect } from 'next/navigation';
import { getCookie, loginUser, loginWithJWT, registerUser } from '@/utils/api';
import { toast } from 'react-toastify';
import { AdminData } from '@/types/admin-data';

interface PriceBar {
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: number;
  signal?: 'buy' | 'sell';
}

export function Login({ homepageData }: { homepageData: Partial<AdminData> | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [priceData, setPriceData] = useState<PriceBar[]>([]);

  useEffect(() => {
    let basePrice = 50000;
    const initialData: PriceBar[] = [];

    // Generate initial data
    for (let i = 0; i < 30; i++) {
      const volatility = basePrice * 0.02; // 2% volatility
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;

      // Add signals at interesting points
      const signal = Math.random() < 0.2 ? // 20% chance of signal
        (close > open ? 'buy' : 'sell') as 'buy' | 'sell' :
        undefined;

      initialData.push({
        high,
        low,
        open,
        close,
        timestamp: Date.now() - (30 - i) * 1000,
        signal
      });

      basePrice = close;
    }

    setPriceData(initialData);

    const interval = setInterval(() => {
      setPriceData(prev => {
        const lastBar = prev[prev.length - 1];
        const volatility = lastBar.close * 0.02;
        const open = lastBar.close;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;

        const signal = Math.random() < 0.2 ?
          (close > open ? 'buy' : 'sell') as 'buy' | 'sell' :
          undefined;

        return [...prev.slice(1), {
          high,
          low,
          open,
          close,
          timestamp: Date.now(),
          signal
        }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { user, setUser, setJwtToken } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isSigningUp
      ? await registerUser({ email, password, inviteCode })
      : await loginUser({ email, password });
  
    if (result) {
      toast.success(result.message);
      setUser(result.user);
      setJwtToken(result.token);
      window.localStorage.setItem('jwtToken', result.token);
  
      // Set the cookie without HttpOnly for client-side access
      document.cookie = `jwtToken=${result.token}; path=/; Secure;`;
      setEmail('');
      setPassword('');
      redirect('/dashboard');
    }
  };
  
  const handleLoginWithJWT = async () => {
    const jwtToken = getCookie('jwtToken'); // Use the utility function to read the cookie
    if (jwtToken && !user) {
      const result = await loginWithJWT();
      if (result) {
        toast.success(result.message);
        setUser(result.user);
        window.localStorage.setItem('jwtToken', result.token);
        setJwtToken(result.token);
        setEmail('');
        setPassword('');
        redirect('/dashboard');
      }
    }
  };
  
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (!hasRun.current) {
      handleLoginWithJWT();
      hasRun.current = true;
    }
  }, []);

  const chartHeight = 300;
  const chartWidth = 1200;
  const barWidth = chartWidth / priceData.length;

  const minPrice = Math.min(...priceData.map(d => d.low));
  const maxPrice = Math.max(...priceData.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  const scalePrice = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  useEffect(() => {
    if (homepageData?.siteMaintainanceMode) toast.error('Site is currently in maintenance. Please try again later')
  }, [homepageData])

  if (!homepageData) return null;


  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated chart background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Price bars and signals */}
          {priceData.map((bar, i) => {
            const x = i * barWidth;
            const y = scalePrice(bar.high);
            const height = scalePrice(bar.low) - scalePrice(bar.high);

            return (
              <g key={i} className="transition-all duration-500">
                {/* Price bar */}
                <rect
                  x={x + barWidth * 0.1}
                  y={y}
                  width={barWidth * 0.8}
                  height={height}
                  fill="url(#barGradient)"
                  className="transition-all duration-500"
                />

                {/* Signal indicators */}
                {bar.signal && (
                  <g>
                    {bar.signal === 'buy' ? (
                      <>
                        <circle
                          cx={x + barWidth / 2}
                          cy={scalePrice(bar.low) + 20}
                          r="6"
                          fill="#22C55E"
                          opacity="0.3"
                          className="animate-ping"
                        />
                        <circle
                          cx={x + barWidth / 2}
                          cy={scalePrice(bar.low) + 20}
                          r="3"
                          fill="#22C55E"
                          filter="url(#glow)"
                        />
                      </>
                    ) : (
                      <>
                        <circle
                          cx={x + barWidth / 2}
                          cy={scalePrice(bar.high) - 20}
                          r="6"
                          fill="#EF4444"
                          opacity="0.3"
                          className="animate-ping"
                        />
                        <circle
                          cx={x + barWidth / 2}
                          cy={scalePrice(bar.high) - 20}
                          r="3"
                          fill="#EF4444"
                          filter="url(#glow)"
                        />
                      </>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Content overlay */}
      <div className="relative container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between min-h-screen">
        {/* Left side - Platform Info */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 pb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            {homepageData?.mainTitle}
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            {homepageData?.subTitle}
          </p>

          {/* Feature cards with hover effects */}
          <div className="space-y-6">
            <div className="transform hover:scale-105 transition-transform">
              <div className="flex items-start gap-4 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{homepageData?.featuredCardTitle}</h3>
                  <p className="text-gray-400">{homepageData?.featuredCardDescription}</p>
                </div>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="flex items-start gap-4 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{homepageData?.featuredCardTitle1}</h3>
                  <p className="text-gray-400">{homepageData?.featuredCardDescription1}</p>
                </div>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="flex items-start gap-4 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{homepageData?.featuredCardTitle2}</h3>
                  <p className="text-gray-400">{homepageData?.featuredCardDescription2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login/Signup Form */}
        <div className="lg:w-[400px] w-full">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">
                {isSigningUp ? 'Request Access' : 'Welcome Back'}
              </h2>
              <button
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                {isSigningUp ? 'Sign in instead' : 'Request access'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* {error && (
              <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )} */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full rounded-lg border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 border focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                  <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full rounded-lg border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 border focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                  <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {isSigningUp && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="p-2 w-full rounded-lg border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 border focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                    placeholder="Enter your invite code"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 group"
              >
                {isSigningUp ? 'Request Access' : 'Sign In'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {!isSigningUp && (
              <div className="mt-6 text-center">
                <button className="text-sm text-gray-400 hover:text-gray-300">
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}