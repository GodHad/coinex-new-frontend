import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Activity, Clock, Pencil, Save, ImageIcon, Check, Copy, AlertTriangle } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { AdminHook } from '@/types/admin-hook';
import { toast } from 'react-toastify';
import { deleteAdminHook, getAdminHooks, insertAdminHook, updateAdminHook } from '@/utils/api';
import APILogs from './ApiLogs';
import moment from 'moment';

const defaultFormData: Partial<AdminHook> = {
    pair: 'BTC/USDT',
    timeframe: '1h',
    description: '',
    imageUrl: '',
    riskLevel: 'Medium',
    recommendedLeverage: '5x',
    enabled: false,
};

export default function AdminWebHook() {
    const [signals, setSignals] = useState<AdminHook[]>([]);
    const [copied, setCopied] = useState<string>('');
    const [showHistory, setShowHistory] = useState<string | null>(null);

    const [editingSignal, setEditingSignal] = useState<AdminHook | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<AdminHook>>(defaultFormData);

    const handleGetHooks = async () => {
        try {
            const data = await getAdminHooks();
            setSignals(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }

    }

    useEffect(() => {
        handleGetHooks();
    }, []);

    const getRiskBadgeColor = (risk: string) => {
        switch (risk) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-green-100 text-green-800';
        }
    };

    const handleSaveSignal = () => {
        if (editingSignal) {
            saveWebhook();
        } else {
            generateWebhook();
        }

    };

    const generateWebhook = async () => {
        const result = await insertAdminHook(formData);
        if (result) {
            setSignals((prev) => ([...prev, result.hook]));
            toast.success(result.message);
            setFormData({
                pair: '',
                timeframe: '',
                riskLevel: '',
                imageUrl: '',
                description: '',
                recommendedLeverage: ''
            });
            setEditingSignal(null);
            setShowNewForm(false);
            setFormData(defaultFormData);

        }
    };

    const deleteWebhook = async (id: string) => {
        const result = await deleteAdminHook(id);
        if (result) {
            setSignals(signals.filter(w => w._id !== id));
            if (expandedSignalId === id) setExpandedSignalId(null);
            if (editingSignal?._id === id) setEditingSignal(null);
            if (showHistory === id) setShowHistory(null);
            toast.success(result.message);
        }
    };

    const saveWebhook = async () => {
        if (expandedSignalId) {
            const result = await updateAdminHook(formData);
            if (result) {
                setSignals(signals.map(w => w._id === expandedSignalId ? result.hook : w));
                toast.success(result.message);
                setFormData({
                    pair: '',
                    timeframe: '',
                    riskLevel: '',
                    imageUrl: '',
                    description: '',
                    recommendedLeverage: ''
                });
                setEditingSignal(null);
                setShowNewForm(false);
                setFormData(defaultFormData);
            }
        }
    };

    const startEditing = (signal: AdminHook) => {
        setEditingSignal(signal);
        setFormData(signal);
        setExpandedSignalId(signal._id || '');
    };

    const cancelEditing = () => {
        setEditingSignal(null);
        setShowNewForm(false);
        setFormData(defaultFormData);
    };

    const copyToClipboard = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(url);
        setTimeout(() => setCopied(''), 2000);
    };

    const renderSignalForm = () => (
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trading Pair</label>
                    <select
                        value={formData.pair}
                        onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
                        className="w-full rounded-lg border-gray-300"
                    >
                        <option value="BTC/USDT">BTC/USDT</option>
                        <option value="ETH/USDT">ETH/USDT</option>
                        <option value="SOL/USDT">SOL/USDT</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                    <select
                        value={formData.timeframe}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                        className="w-full rounded-lg border-gray-300"
                    >
                        <option value={'5m'}>5m</option>
                        <option value={'15m'}>15m</option>
                        <option value={'30m'}>30m</option>
                        <option value={'45m'}>45m</option>
                        <option value={'1h'}>1h</option>
                        <option value={'2h'}>2h</option>
                        <option value={'3h'}>3h</option>
                        <option value={'4h'}>4h</option>
                        <option value={'1d'}>1d</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border-gray-300"
                    rows={3}
                    placeholder="Enter a detailed description of the trading strategy..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="flex-1 rounded-lg border-gray-300"
                        placeholder="Enter image URL..."
                    />
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                    <select
                        value={formData.riskLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, riskLevel: e.target.value }))}
                        className="w-full rounded-lg border-gray-300"
                    >
                        <option value="Low">Low Risk</option>
                        <option value="Medium">Medium Risk</option>
                        <option value="High">High Risk</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Leverage</label>
                    <input
                        type="text"
                        value={formData.recommendedLeverage}
                        onChange={(e) => setFormData(prev => ({ ...prev, recommendedLeverage: e.target.value }))}
                        className="w-full rounded-lg border-gray-300"
                        placeholder="e.g., 5x"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveSignal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Signal
                </button>
            </div>
        </div>
    );

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

    const renderHistory = (webhook: AdminHook) => {
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
    
    const [activeTab, setActiveTab] = useState<'webhooks' | 'logs'>('webhooks');

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Premium Signals</h2>
                        <Tooltip content="Manage premium trading signals available to subscribers">
                        </Tooltip>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('webhooks')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${activeTab === 'webhooks'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Webhooks
                            </button>
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'logs'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Activity className="w-4 h-4" />
                                <span>API Logs</span>
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setShowNewForm(true);
                                setFormData(defaultFormData);
                                setExpandedSignalId(null);
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Signal
                        </button>
                    </div>
                </div>
            </div>

            {showNewForm && (
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Create New Signal</h3>
                    {renderSignalForm()}
                </div>
            )}

            {/* Content */}
            {
                activeTab === 'webhooks' ? 
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium">Active Signals</h3>
                            <span className="text-sm text-gray-500">({signals.filter(s => s.enabled).length} signals)</span>
                        </div>
                    </div>

                    {/* Signal Cards */}
                    <div className="divide-y divide-gray-100">
                        {signals.map((signal) => (
                            <div key={signal._id} className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 items-start justify-between">
                                            <div>
                                                <h4 className="font-medium">{signal.pair}</h4>
                                                <p className="text-sm text-gray-500 mt-1">{signal.timeframe} Timeframe</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(signal.riskLevel)}`}>
                                                    {signal.riskLevel} Risk
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-medium bg-green-100 rounded-full ${signal.enabled ? 'text-green-800' : 'text-red-800'}`}>
                                                    {signal.enabled ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                            {signal.description}
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Win Rate</p>
                                                <p className="font-medium text-green-600">{signal.winRate?.toFixed(2)}%</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Avg. Profit</p>
                                                <p className="font-medium text-green-600">{signal.avgPnl?.toFixed(2)}%</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Total Signals</p>
                                                <p className="font-medium">{signal.signals}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Leverage</p>
                                                <p className="font-medium">{signal.recommendedLeverage}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 self-end sm:self-start">
                                        <button 
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                            onClick={() => setShowHistory((signal && signal._id && showHistory === signal._id) ? null : signal._id || null)}
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(`https://api.nothingparticular.com/api/webhooks/${signal.url}`)}
                                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
                                        >
                                            {copied === `https://api.nothingparticular.com/api/webhooks/${signal.url}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" 
                                            onClick={() => {
                                                startEditing(signal);
                                                setShowNewForm(false);
                                            }}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button 
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            onClick={() => deleteWebhook(signal._id || '')}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {showHistory === signal._id && (
                                    <div className="border-t border-gray-200 p-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">Recent Trading History</h4>
                                        </div>
                                        {renderHistory(signal)}
                                    </div>
                                )}
                                {editingSignal?._id === signal._id && renderSignalForm()}
                            </div>
                        ))}
                    </div>
                </div>
                : 
                <APILogs />
            }
        </div>
    );
}