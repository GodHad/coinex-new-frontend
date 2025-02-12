import React, { useContext, useState } from 'react';
import { Webhook, History, Crown, Shield, LogOut, Wrench, LayoutDashboard, BookOpen, ChevronDown, X, Menu, Twitter, MessageCircle, MessagesSquare, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import UserContext from '@/contexts/UserContext';

type NavSubItem = {
    title: string;
    path: string;
    comingSoon?: boolean;
    subItems?: {
        title: string;
        path: string;
        comingSoon?: boolean;
    }[];
};

type NavItem = {
    title: string;
    icon: React.ReactNode;
    path: string;
    isPremium?: boolean;
    isAdmin?: boolean;
    subItems?: NavSubItem[];
};

interface SidebarProps {
    currentPath: string;
    socialLinks: {
        twitter?: string;
        telegram?: string;
        discord?: string;
        instagram?: string;
    };
    sidebarTitle: string;
    onLogout: () => void;
}

export function Sidebar({ currentPath, socialLinks, sidebarTitle, onLogout }: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const navItems: NavItem[] = [
        { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { title: 'Standard Webhooks', icon: <Webhook className="w-5 h-5" />, path: '/webhooks' },
        { title: 'Premium Signals', icon: <Crown className="w-5 h-5" />, path: '/premium' },
        // { title: 'Favorite API Keys', icon: <Star className="w-5 h-5" />, path: '/api-keys' },
        { title: 'Trading Tools', icon: <Wrench className="w-5 h-5" />, path: '/tools' },
        { title: 'History', icon: <History className="w-5 h-5" />, path: '/history' },
        {
            title: 'Getting Started',
            icon: <BookOpen className="w-5 h-5" />,
            path: '/documentation',
            subItems: [
                {
                    title: 'Exchange Setup',
                    path: '/documentation/exchange',
                    subItems: [
                        { title: 'CoinEx Guide', path: '/documentation/exchange/coinex' },
                        { title: 'Bybit Guide', path: '/documentation/exchange/bybit', comingSoon: true }
                    ]
                },
                {
                    title: 'User Guides',
                    path: '/documentation/guides',
                    subItems: [
                        { title: 'Premium Users', path: '/documentation/guides/premium' },
                        { title: 'Standard Users', path: '/documentation/guides/standard' }
                    ]
                },
                { title: 'Exchange Partners', path: '/documentation/affiliates' }
            ]
        },
        { title: 'Admin Panel', icon: <Shield className="w-5 h-5" />, path: '/admin', isAdmin: true },
    ];

    const { user } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    const filteredNavItems = navItems.filter(item => {
        if (item.isAdmin && !user?.isAdmin) return false;
        if (item.isPremium && !isPremium) return false;
        return true;
    });

    const toggleExpanded = (path: string, parentPath?: string) => {
        setExpandedItems(prev => {
            const newState = { ...prev };

            if (parentPath && !prev[path]) {
                newState[parentPath] = true;
            }

            newState[path] = !prev[path];
            return newState;
        });
    };

    const renderSubItems = (items: NavSubItem[], level: number = 1, parentPath?: string) => {
        return (
            <ul className={`mt-1 space-y-1 ${level === 1 ? 'ml-6' : 'ml-4'}`}>
                {items.map((item) => (
                    <li key={item.path}>
                        {item.subItems ? (
                            <div>
                                <button
                                    onClick={() => toggleExpanded(item.path, parentPath)}
                                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${currentPath.startsWith(item.path)
                                        ? 'bg-blue-600/50 text-white'
                                        : 'text-gray-400 hover:bg-gray-800'
                                        }`}
                                >
                                    <span>{item.title}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedItems[item.path] ? 'transform rotate-180' : ''
                                        }`} />
                                </button>
                                {expandedItems[item.path] && renderSubItems(item.subItems, level + 1, item.path)}
                            </div>
                        ) : (
                            <Link
                                href={item.path}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${item.comingSoon
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : currentPath === item.path
                                        ? 'bg-blue-600/50 text-white'
                                        : 'text-gray-400 hover:bg-gray-800'
                                    }`}
                            >
                                <span>{item.title}</span>
                                {item.comingSoon && (
                                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                                        Soon
                                    </span>
                                )}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg md:hidden"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className={`fixed flex flex-col justify-between left-0 z-40 w-64 inset-y-0 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold">{sidebarTitle}</h1>
                    </div>
                    <nav className="flex-1">
                        <ul className="space-y-1 px-2">
                            {filteredNavItems.map((item) => (
                                <React.Fragment key={item.path}>
                                    {item.subItems ?
                                        <div>
                                            <button
                                                onClick={() => toggleExpanded(item.path)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${currentPath.startsWith(item.path)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {item.icon}
                                                    <span>{item.title}</span>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedItems[item.path] ? 'transform rotate-180' : ''
                                                    }`} />
                                            </button>
                                            {expandedItems[item.path] && renderSubItems(item.subItems)}
                                        </div>
                                        :
                                        <li>
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
                                                {(item.isPremium || item.path === '/premium') && (
                                                    <Crown className={`w-4 h-4 ${isPremium ? 'text-yellow-500' : 'text-gray-500'}`} />
                                                )}
                                                {item.isAdmin && (
                                                    <Shield className="w-4 h-4 text-red-500" />
                                                )}
                                            </Link>
                                        </li>
                                    }
                                </React.Fragment>
                            ))}
                        </ul>
                    </nav>
                </div>
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
                    
                    <div className="flex items-center justify-center gap-4 mt-4">
                        {socialLinks?.twitter && (
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {socialLinks?.telegram && (
                            <a
                                href={socialLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        )}
                        {socialLinks?.discord && (
                            <a
                                href={socialLinks.discord}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-400 transition-colors"
                            >
                                <MessagesSquare className="w-5 h-5" />
                            </a>
                        )}
                        {socialLinks?.instagram && (
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-600 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>


            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

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