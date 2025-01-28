import React, { useContext, useState } from 'react';
import { Webhook, History, Crown, Shield, LogOut, Wrench, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import UserContext from '@/contexts/UserContext';

type NavItem = {
    title: string;
    icon: React.ReactNode;
    path: string;
    isPremium?: boolean;
    isAdmin?: boolean;
};

interface SidebarProps {
    currentPath: string;
    isAdmin: boolean;
    onLogout: () => void;
}

export function Sidebar({ currentPath, isAdmin, onLogout }: SidebarProps) {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const navItems: NavItem[] = [
        { title: 'Standard Webhooks', icon: <Webhook className="w-5 h-5" />, path: '/webhooks' },
        { title: 'Premium Signals', icon: <Crown className="w-5 h-5" />, path: '/premium', isPremium: true },
        // { title: 'P2P Trading', icon: <Users className="w-5 h-5" />, path: '/p2p-trading' },
        // { title: 'Favorite API Keys', icon: <Star className="w-5 h-5" />, path: '/api-keys' },
        { title: 'Trading Tools', icon: <Wrench className="w-5 h-5" />, path: '/tools' },
        { title: 'History', icon: <History className="w-5 h-5" />, path: '/history' },
        { title: 'Exchange Partners', icon: <Gift className="w-5 h-5" />, path: '/affiliates' },
        { title: 'Admin Panel', icon: <Shield className="w-5 h-5" />, path: '/admin', isAdmin: true },
    ];

    const { user } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    const filteredNavItems = navItems.filter(item => {
        if (item.isAdmin && !user?.isAdmin) return false;
        if (item.isPremium && !isPremium) return isPremium || isAdmin;
        return true;
    });

    return (
        <>
            <div className="flex flex-col w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Webhook Manager</h1>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-1 px-2">
                        {filteredNavItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${currentPath === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    {item.isPremium && (
                                        <Crown className={`w-4 h-4 ${isPremium ? 'text-yellow-500' : 'text-gray-500'}`} />
                                    )}
                                    {item.isAdmin && (
                                        <Shield className="w-4 h-4 text-red-500" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-800 space-y-4">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                    <Link href="/profile"
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${currentPath === '/profile' ? 'bg-gray-800' : 'hover:bg-gray-800'
                            }`}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                        />
                        <div className="text-left">
                            <p className="text-sm font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                    </Link>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutConfirm(true);
                                    onLogout();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}