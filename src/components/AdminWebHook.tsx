import React, { useEffect, useState } from 'react';
import { Plus, Image as ImageIcon, Check, X, ChevronDown, Pencil, Save, Trash2, Copy } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { AdminHook } from '@/types/admin-hook';
import Image from 'next/image';
import { getAdminHooks, insertAdminHook, updateAdminHook, deleteAdminHook } from '@/utils/api';
import { toast } from 'react-toastify';

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
    const [copied, setCopied] = useState(false);

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

    const toggleSignal = (id: string) => {
        setSignals(signals.map(s =>
            s._id === id ? { ...s, enabled: !s.enabled } : s
        ));
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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Premium Signals</h2>
                            <Tooltip content="Manage premium trading signals available to subscribers">
                            </Tooltip>
                        </div>
                        <button
                            onClick={() => {
                                setShowNewForm(true);
                                setFormData(defaultFormData);
                                setExpandedSignalId(null);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Signal
                        </button>
                    </div>
                </div>

                {showNewForm && (
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Create New Signal</h3>
                        {renderSignalForm()}
                    </div>
                )}

                <div className="divide-y divide-gray-100">
                    {signals.map((signal) => (
                        <div key={signal._id} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleSignal(signal._id || '')}
                                        className={`p-2 rounded-full ${signal.enabled
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {signal.enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{signal.pair}</h3>
                                            <span className="text-sm text-gray-500">{signal.timeframe}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(signal.riskLevel)}`}>
                                                {signal.riskLevel} Risk
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{signal.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpandedSignalId(expandedSignalId === signal._id ? null : signal._id ?? null)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    >
                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedSignalId === signal._id ? 'transform rotate-180' : ''
                                            }`} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`https://api.nothingparticular.com/api/webhooks/${signal.url}`)}
                                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            startEditing(signal);
                                            setShowNewForm(false);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteWebhook(signal._id || '')}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {expandedSignalId === signal._id && (
                                <div className="mt-4 space-y-4">
                                    <Image
                                        src={signal.imageUrl}
                                        alt={signal.pair}
                                        className="w-full h-48 object-cover rounded-lg"
                                        width={100}
                                        height={100}
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Win Rate</p>
                                            <p className={`font-medium ${signal.winRate && signal.winRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>{signal.winRate?.toFixed(2) || 0}%</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Avg. Profit</p>
                                            <p className={`font-medium ${signal.avgPnl && signal.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>${signal.avgPnl?.toFixed(2) || 0}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500">Total Signals</p>
                                            <p className="font-medium">{signal.signals}</p>
                                        </div>
                                    </div>

                                    {editingSignal?._id === signal._id && renderSignalForm()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}