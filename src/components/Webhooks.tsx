'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Lock, Copy, Check, Play, Pause, Trash2, ChevronDown, ChevronRight, Pencil, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import { Webhook } from '@/types/hooks';
import UserContext from '@/contexts/UserContext';
import { deleteHook, getHooks, insertHook, updateHook } from '@/utils/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import APILogs from './ApiLogs';

const directions = [
    { content: 'Long Only', value: 'LONG_ONLY' },
    { content: 'Short Only', value: 'SHORT_ONLY' },
    { content: 'Both', value: 'BOTH' }
];

export function Webhooks() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expandedWebhookId, setExpandedWebhookId] = useState<string | null>(null);
    const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
    const [showHistory, setShowHistory] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'webhooks' | 'logs'>('webhooks');

    const [webhook, setWebhook] = useState<Webhook>({
        url: '',
        name: '',
        coinExApiKey: '',
        coinExApiSecret: '',
        tradeDirection: 'BOTH',
        status: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWebhook(prev => ({ ...prev, [name]: value }));
    }

    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const { jwtToken, user } = useContext(UserContext);

    const handleGetHooks = async (jwtToken: string) => {
        try {
            const data = await getHooks(jwtToken);
            setWebhooks(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }

    }

    useEffect(() => {
        handleGetHooks(jwtToken);
    }, [jwtToken]);

    const generateWebhook = async () => {
        const result = await insertHook(webhook, false);
        if (result) {
            setWebhooks([...webhooks, result.hook]);
            toast.success(result.message);
            setWebhook({
                url: '',
                name: '',
                coinExApiKey: '',
                coinExApiSecret: '',
                tradeDirection: 'BOTH',
                status: 0,
            });
        }
    };

    const toggleWebhook = async (_webhook: Webhook) => {
        _webhook.status = 1 - _webhook.status;
        const result = await updateHook(_webhook, false);
        if (result) {
            setWebhooks(webhooks.map(w => w._id === _webhook._id ? result.hook : w));
            toast.success(result.message);
        }
    };

    const deleteWebhook = async (id: string) => {
        const result = await deleteHook(id);
        if (result) {
            setWebhooks(webhooks.filter(w => w._id !== id));
            if (expandedWebhookId === id) setExpandedWebhookId(webhook?._id || '');
            if (editingWebhook?._id === id) setEditingWebhook(null);
            if (showHistory === id) setShowHistory(null);
            toast.success(result.message);
        }
    };

    const startEditing = (webhook: Webhook) => {
        setEditingWebhook(webhook);
        setExpandedWebhookId(webhook?._id || '');
    };

    const saveWebhook = async () => {
        const result = await updateHook(editingWebhook, false);
        if (result) {
            setWebhooks(webhooks.map(w => w._id === webhook._id ? result.hook : w));
            toast.success(result.message);
            setWebhook({
                url: '',
                name: '',
                coinExApiKey: '',
                coinExApiSecret: '',
                tradeDirection: 'BOTH',
                status: 0,
            });
        }
    };

    const copyToClipboard = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 0:
                return <Check className="w-4 h-4 text-green-600" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            // case 'warning':
            //     return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
        }
    };

    const getStatusStyle = (status: number) => {
        switch (status) {
            case 0:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-red-100 text-red-800';
            // case 'warning':
            //     return 'bg-yellow-100 text-yellow-800';
        }
    };

    const renderHistory = (webhook: Webhook) => {
        if (!webhook.histories?.length) {
            return (
                <div className="text-center py-4 text-gray-500">
                    No trading history available
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {webhook.histories.map(entry => (
                    <div key={entry._id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(entry.data?.code || 0)}`}>
                                    {getStatusIcon(entry.data?.code || 0)}
                                    {entry.data?.code === 0 ? 'Success' : 'Error'}
                                </span>
                                <span className="font-medium capitalize">
                                    {
                                        !entry.positionState ? entry.action :
                                            entry.positionState === 'neutral' ? 'Position Closed' :
                                                entry.positionState === 'short' ? (entry.action === 'buy' ? 'Short Position Closed' : 'Long Position Opened') : (
                                                    entry.action === 'sell' ? 'Short Position Opened' : 'Long Position Closed'
                                                )
                                    }
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{moment(entry.createdAt).format('YYYY-MM-DD hh:mm:ss')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{entry.data?.message}</span>
                            <span className="text-sm font-medium">{entry.symbol}</span>
                        </div>
                        {entry.data?.data && entry.data?.data.realized_pnl !== undefined && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Net PnL</span>
                                    <span className={`font-medium ${entry.data?.data.realized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {Number(entry.data?.data.realized_pnl) >= 0 ? '+' : ''}{Number(entry.data?.data.realized_pnl).toFixed(2)} USDT
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const isSubscribed = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Webhooks & API Logs</h1>
                        <Tooltip content="Manage your webhooks and monitor API activity">
                        </Tooltip>
                    </div>
                    <div className="flex gap-2">
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
                            onClick={() => setActiveTab('logs')}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'logs'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Activity className="w-4 h-4" />
                            API Logs
                        </button>
                    </div>
                </div>

                {activeTab === 'webhooks' ? (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center mb-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Webhook Name
                                    </label>
                                    <Tooltip content="Give your webhook a descriptive name to easily identify it later">
                                    </Tooltip>
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={webhook.name}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
                                    placeholder="Enter a name for your webhook"
                                />
                            </div>
                            {!isSubscribed &&
                                < div >
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                            Webhook URL
                                        </label>
                                        <Tooltip content="Give your webhook a descriptive name to easily identify it later">
                                        </Tooltip>
                                    </div>
                                    <input
                                        type="text"
                                        id="url"
                                        name="url"
                                        value={webhook.url}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
                                        placeholder="Enter a name for your webhook"
                                    />
                                </div>
                            }
                            <div>
                                <div className="flex items-center mb-2">
                                    <label htmlFor="coinExApiKey" className="block text-sm font-medium text-gray-700">
                                        API ID
                                    </label>
                                    <Tooltip content="Your exchange API key for automated trading. You can find this in your exchange settings.">
                                    </Tooltip>
                                </div>
                                <input
                                    type="text"
                                    id="coinExApiKey"
                                    name="coinExApiKey"
                                    value={webhook.coinExApiKey}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
                                    placeholder="Enter your API ID"
                                />
                            </div>
                            <div>
                                <div className="flex items-center mb-2">
                                    <label htmlFor="coinExApiSecret" className="block text-sm font-medium text-gray-700">
                                        API Secret Key
                                    </label>
                                    <Tooltip content="Your exchange API secret. Keep this secure and never share it with anyone.">
                                    </Tooltip>
                                </div>
                                <input
                                    type="password"
                                    id="coinExApiSecret"
                                    name="coinExApiSecret"
                                    value={webhook.coinExApiSecret}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
                                    placeholder="Enter your API Secret Key"
                                />
                            </div>
                            <div className="relative">
                                <div className="flex items-center mb-2">
                                    <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
                                        Trading Direction
                                    </label>
                                    <Tooltip content="Choose whether this webhook should execute long trades, short trades, or both.">
                                    </Tooltip>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <span>{directions.find(option => option.value === webhook.tradeDirection)?.content || ''}</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                                        <div className="py-1">
                                            {directions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setWebhook((prev) => ({ ...prev, tradeDirection: option.value }));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                                >
                                                    {option.content}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={generateWebhook}
                                disabled={!webhook.name || !webhook.coinExApiKey || !webhook.coinExApiSecret || (!isSubscribed && !webhook.url) || !webhook.tradeDirection}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                Generate Webhook
                            </button>

                            {webhooks.length > 0 && (
                                <div className="mt-8 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-medium text-gray-900">Your Webhooks</h3>
                                        <Tooltip content="List of your configured webhooks. You can edit, pause, or delete them using the controls.">
                                        </Tooltip>
                                    </div>
                                    <div className="space-y-2">
                                        {webhooks.map((webhook) => (
                                            <div key={webhook._id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                <div className="flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleWebhook(webhook)}
                                                            className={`p-1.5 rounded-full ${webhook.status
                                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                                                                }`}
                                                        >
                                                            {webhook.status ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                                        </button>
                                                        <span className="font-medium">{webhook.name}</span>
                                                        <span className="text-sm text-gray-500">{webhook.tradeDirection}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setShowHistory((webhook && webhook._id && showHistory === webhook._id) ? null : webhook._id || null)}
                                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                                                        >
                                                            <Clock className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setExpandedWebhookId((webhook && webhook._id && expandedWebhookId === webhook._id) ? null : webhook._id || null)}
                                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                                                        >
                                                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedWebhookId === webhook._id ? 'transform rotate-90' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => startEditing(webhook)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteWebhook(webhook._id as string)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {showHistory === webhook._id && (
                                                    <div className="border-t border-gray-200 p-3">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-medium">Recent Trading History</h4>
                                                            {!isSubscribed && (
                                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                    <Lock className="w-4 h-4" />
                                                                    <span>Limited to last 24h</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {renderHistory(webhook)}
                                                    </div>
                                                )}

                                                {expandedWebhookId === webhook._id && (
                                                    <div className="border-t border-gray-200 p-3 bg-white">
                                                        {editingWebhook?._id === webhook._id ? (
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Webhook Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editingWebhook.name}
                                                                        onChange={(e) => setEditingWebhook({ ...editingWebhook, name: e.target.value })}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 pr-6"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        API ID
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editingWebhook.coinExApiKey}
                                                                        onChange={(e) => setEditingWebhook({ ...editingWebhook, coinExApiKey: e.target.value })}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 pr-6"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        API Secret
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        value={editingWebhook.coinExApiSecret}
                                                                        onChange={(e) => setEditingWebhook({ ...editingWebhook, coinExApiSecret: e.target.value })}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 pr-6"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Direction
                                                                    </label>
                                                                    <select
                                                                        value={editingWebhook.tradeDirection}
                                                                        onChange={(e) => setEditingWebhook({
                                                                            ...editingWebhook,
                                                                            tradeDirection: e.target.value
                                                                        })}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 pr-6"
                                                                    >
                                                                        {directions.map(option => (
                                                                            <option key={option.value} value={option.value}>{option.content}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="flex justify-end gap-2 mt-3">
                                                                    <button
                                                                        onClick={() => setEditingWebhook(null)}
                                                                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={saveWebhook}
                                                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                                    >
                                                                        Save Changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        value={webhook.url}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm bg-white p-2 text-sm"
                                                                    />
                                                                    <button
                                                                        onClick={() => copyToClipboard(`https://api.nothingparticular.com/api/webhooks/${isSubscribed ? '' : user?.email + '/'}${webhook.url}`)}
                                                                        className="p-2 text-gray-500 hover:text-gray-700"
                                                                        title="Copy to clipboard"
                                                                    >
                                                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                                    </button>
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    <p>API ID: {webhook.coinExApiKey}</p>
                                                                    <p>API Secret: •••••••••••</p>
                                                                    {!!webhook.amount && (<p>Trade Amount: {webhook.amount} {'SOL'}</p>)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <APILogs isPremium={isSubscribed} />
                )}
            </div>
        </div >
    );
}