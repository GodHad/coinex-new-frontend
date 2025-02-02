'use client';
import React, { useEffect, useState } from 'react';
import { Copy, Check, Trash2, ChevronRight, Pencil } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import { deleteAdminHook, getAdminHooks, insertAdminHook, updateAdminHook} from '@/utils/api';
import { toast } from 'react-toastify';
import { AdminHook } from '@/types/admin-hook';

export default function AdminWebHook() {
    const [copied, setCopied] = useState(false);
    const [expandedWebhookId, setExpandedWebhookId] = useState<string | null>(null);
    const [editingWebhook, setEditingWebhook] = useState<AdminHook | null>(null);

    const [webhook, setWebhook] = useState<AdminHook>({
        name: '',
        pair: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWebhook(prev => ({ ...prev, [name]: value }));
    }

    const [webhooks, setWebhooks] = useState<AdminHook[]>([]);

    const handleGetHooks = async () => {
        try {
            const data = await getAdminHooks();
            setWebhooks(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message || error.message || error);
        }

    }

    useEffect(() => {
        handleGetHooks();
    }, []);

    const generateWebhook = async () => {
        const result = await insertAdminHook(webhook);
        if (result) {
            setWebhooks([...webhooks, result.hook]);
            toast.success(result.message);
            setWebhook({
                pair: '',
                name: '',
            });
        }
    };

    const deleteWebhook = async (id: string) => {
        const result = await deleteAdminHook(id);
        if (result) {
            setWebhooks(webhooks.filter(w => w._id !== id));
            if (expandedWebhookId === id) setExpandedWebhookId(webhook?._id || '');
            if (editingWebhook?._id === id) setEditingWebhook(null);
            toast.success(result.message);
        }
    };

    const startEditing = (webhook: AdminHook) => {
        setEditingWebhook(webhook);
        setExpandedWebhookId(webhook?._id || '');
    };

    const saveWebhook = async () => {
        if (editingWebhook) {
            const result = await updateAdminHook(editingWebhook);
            if (result) {
                setWebhooks(webhooks.map(w => w._id === editingWebhook._id ? result.hook : w));
                toast.success(result.message);
                setWebhook({
                    pair: '',
                    name: '',
                });
            }
        }
    };

    const copyToClipboard = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">

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
                                placeholder="Enter a name for webhook"
                            />
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <label htmlFor="pair" className="block text-sm font-medium text-gray-700">
                                    Pair
                                </label>
                                <Tooltip content="Input Pair">
                                </Tooltip>
                            </div>
                            <input
                                type="text"
                                id="pair"
                                name="pair"
                                value={webhook.pair}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-3"
                                placeholder="Enter pair"
                            />
                        </div>
                        <button
                            onClick={generateWebhook}
                            disabled={!webhook.name || !webhook.pair}
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
                                                    <span className="font-medium">{webhook.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
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
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Pair
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editingWebhook.pair}
                                                                    onChange={(e) => setEditingWebhook({ ...editingWebhook, pair: e.target.value })}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                                                                />
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
                                                                    onClick={() => copyToClipboard(`https://api.nothingparticular.com/api/webhooks/${webhook.url}`)}
                                                                    className="p-2 text-gray-500 hover:text-gray-700"
                                                                    title="Copy to clipboard"
                                                                >
                                                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                                </button>
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

            </div>
        </div >
    );
}