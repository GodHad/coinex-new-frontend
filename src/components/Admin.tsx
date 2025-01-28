'use client';
import React, { useEffect, useState } from 'react';
import { Users, Activity, AlertTriangle, Webhook as WebhookIcon, Crown, DollarSign, Search, MoreVertical, Ban, UserPlus, Check, X, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { User } from '@/contexts/UserContext';
import { deleteUser, getGeneralHooks, getOverview, getUsers, updateSubscribe } from '@/utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Webhook } from '@/types/hooks';

type TradingPair = {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
};

const convertPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`
}

export function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'webhooks' | 'settings'>('overview');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [overview, setOverview] = useState<Record<string, number>>({})

    const stats = [
        {
            title: 'Total Users',
            value: overview?.totalUsers || '1,234',
            change: overview?.totalUsersChange ? convertPercent(overview?.totalUsersChange) : '+12%',
            icon: <Users className="w-5 h-5" />,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Webhooks',
            value: overview?.activeWebhooks || '567',
            change: overview?.activeWebhooksChange ? convertPercent(overview?.activeWebhooksChange) : '+8%',
            icon: <WebhookIcon className="w-5 h-5" />,
            color: 'bg-green-500'
        },
        {
            title: 'Premium Users',
            value: overview?.totalPremiumUsers || '89',
            change: overview?.totalPremiumUsersChange ? convertPercent(overview?.totalPremiumUsersChange) : '+15%',
            icon: <Crown className="w-5 h-5" />,
            color: 'bg-yellow-500'
        },
        {
            title: 'Monthly Revenue',
            value: '$12,345',
            change: '+23%',
            icon: <DollarSign className="w-5 h-5" />,
            color: 'bg-purple-500'
        }
    ];

    const recentAlerts = [
        {
            id: 1,
            type: 'error',
            message: 'High webhook failure rate detected',
            timestamp: '5 minutes ago'
        },
        {
            id: 2,
            type: 'warning',
            message: 'Unusual trading pattern detected',
            timestamp: '23 minutes ago'
        },
        {
            id: 3,
            type: 'info',
            message: 'New premium user signup',
            timestamp: '1 hour ago'
        }
    ];

    const tradingPairs: TradingPair[] = [
        {
            id: '1',
            name: 'BTC/USDT',
            enabled: true,
            description: 'Bitcoin/USDT trading pair'
        },
        {
            id: '2',
            name: 'ETH/USDT',
            enabled: true,
            description: 'Ethereum/USDT trading pair'
        },
        {
            id: '3',
            name: 'SOL/USDT',
            enabled: false,
            description: 'Solana/USDT trading pair'
        }
    ];

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Activity className="w-5 h-5 text-blue-500" />;
            default:
                return null;
        }
    };

    const [users, setUsers] = useState<User[]>([]);

    const handleGetUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    const handleUpdateSubscribe = async (id: string) => {
        try {
            const result = await updateSubscribe(id);
            toast.success(result.message);
            setUsers(prev => prev.map(user => user._id !== id ? user : result.user))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteUser(id);
            toast.success(result.message)
            setUsers(prev => prev.filter(user => user._id !== id));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    const handleGetAdminWebhooks = async () => {
        try {
            const res = await getGeneralHooks();
            setWebhooks(res);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    const handleGetOverview = async () => {
        const res = await getOverview();
        if (res) {
            setOverview(res);
        }
    }

    useEffect(() => {
        handleGetUsers();
        handleGetAdminWebhooks();
        handleGetOverview();
    }, [])

    const renderOverview = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">System Alerts</h2>
                                <Tooltip content="Recent system alerts and notifications">
                                </Tooltip>
                            </div>
                            <span className="text-sm text-gray-500">Last 24 hours</span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentAlerts.map((alert) => (
                            <div key={alert.id} className="p-4 flex items-center gap-4">
                                {getAlertIcon(alert.type)}
                                <div className="flex-1">
                                    <p className="font-medium">{alert.message}</p>
                                    <p className="text-sm text-gray-500">{alert.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">Quick Actions</h2>
                                <Tooltip content="Common administrative actions">
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 grid gap-4">
                        <button
                            onClick={() => setActiveTab('users')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">View All Users</span>
                            <Users className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                            onClick={() => setActiveTab('webhooks')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">Manage Webhooks</span>
                            <WebhookIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium">Premium Settings</span>
                            <Crown className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">User Management</h2>
                        <Tooltip content="Manage user accounts and permissions">
                        </Tooltip>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
            </div>
            <div className="divide-y divide-gray-100">
                {users.filter(user =>
                    user.firstName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                ).map((user) => {
                    const isExpired = user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now();
                    return (
                        <div key={user._id} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        {user.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.subscribed ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.subscribed ? 'Premium' : 'Standard'}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${(user.subscribed === 1 && isExpired) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.subscribed === 1 && isExpired ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpandedUserId(expandedUserId === user._id ? null : user._id ?? null)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedUserId === user._id ? 'transform rotate-180' : ''
                                            }`} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                                        <Ban className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            {expandedUserId === user._id && (
                                <div className="mt-4 pl-14 space-y-2">
                                    <p className="text-sm text-gray-600">Joined: {moment(user.createdAt).format('YYYY-MM-DD hh:mm:ss')}</p>
                                    <p className="text-sm text-gray-600">Last Active: {moment(user.updatedAt).format('YYYY-MM-DD hh:mm:ss')}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className={`px-3 py-1.5 text-sm text-white rounded-md ${(!user.subscribed && !isExpired) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                                            onClick={() => handleUpdateSubscribe(expandedUserId)}
                                        >
                                            {(!user.subscribed || !isExpired) ? 'New Subscription' : user.subscribed === 1 ? 'Stop Subscription' : 'Resume Subscription'}
                                        </button>
                                        <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => handleDelete(expandedUserId)}>
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );

    const renderWebhooks = () => (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Webhook Management</h2>
                        <Tooltip content="Manage and monitor all user webhooks">
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-gray-100">
                {webhooks.map((webhook) => (
                    <div key={webhook._id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-gray-100`}>
                                    <WebhookIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{webhook.name}</p>
                                    <p className="text-sm text-gray-500">Owner: {webhook.creator?.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {webhook.tradeDirection === 'BOTH' ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : webhook.tradeDirection === 'LONG_ONLY' ? (
                                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="text-sm text-gray-600">{webhook.tradeDirection === 'LONG_ONLY' ? 'Long Only' : webhook.tradeDirection === 'SHORT_ONLY' ? 'Short Only' : webhook.tradeDirection }</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${!webhook.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {webhook.status ? 'Inactive' : 'Active'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    Last used: {moment(webhook.updatedAt).format('YYYY-MM-DD hh:mm:ss')}
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Trading Pairs</h2>
                            <Tooltip content="Enable or disable trading pairs for premium users">
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {tradingPairs.map((pair) => (
                        <div key={pair.id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{pair.name}</p>
                                <p className="text-sm text-gray-500">{pair.description}</p>
                            </div>
                            <button
                                className={`p-2 rounded-full ${pair.enabled
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {pair.enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Premium Features</h2>
                    <Tooltip content="Configure premium feature availability">
                    </Tooltip>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium">Advanced Analytics</p>
                            <p className="text-sm text-gray-500">Enable detailed trading analytics</p>
                        </div>
                        <button className="bg-green-100 text-green-600 p-2 rounded-full">
                            <Check className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium">Priority Support</p>
                            <p className="text-sm text-gray-500">24/7 premium support access</p>
                        </div>
                        <button className="bg-green-100 text-green-600 p-2 rounded-full">
                            <Check className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium">Custom Webhooks</p>
                            <p className="text-sm text-gray-500">Allow custom webhook creation</p>
                        </div>
                        <button className="bg-gray-100 text-gray-600 p-2 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <Tooltip content="Overview of system statistics and alerts">
                        </Tooltip>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'users'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('webhooks')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'webhooks'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Webhooks
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'webhooks' && renderWebhooks()}
                {activeTab === 'settings' && renderSettings()}
            </div>
        </div>
    );
}