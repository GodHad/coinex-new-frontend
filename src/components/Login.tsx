'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser, loginWithJWT } from '@/utils/api';
import { toast } from 'react-toastify';
import UserContext from '@/contexts/UserContext';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user, setUser, setJwtToken } = useContext(UserContext);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser({ email, password });
    if (result) {
      toast.success(result.message);
      setUser(result.user);
      setJwtToken(result.token);

      setEmail('');
      setPassword('');
      window.localStorage.setItem('jwtToken', result.token);
      redirect('/dashboard');
    }
  };

  const handleLoginWithJWT = async () => {
    const token = window.localStorage.getItem('jwtToken');
    if (token && !user) {
      const result = await loginWithJWT();
      if (result) {
        toast.success(result.message);
        setUser(result.user);
        setJwtToken(result.token);
        setEmail('');
        setPassword('');
        window.localStorage.setItem('jwtToken', result.token);
        redirect('/dashboard');
      }
    }
  }

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      handleLoginWithJWT();
      hasRun.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative flex items-center">
                <motion.input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  initial={{ borderColor: 'gray' }}
                  whileFocus={{ borderColor: 'blue' }}
                  transition={{ duration: 0.3 }}
                />
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  initial={{ borderColor: 'gray' }}
                  whileFocus={{ borderColor: 'blue' }}
                  transition={{ duration: 0.3 }}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </motion.form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href={'/auth/sign-up'} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
