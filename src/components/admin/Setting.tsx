/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { Check, X, RefreshCw, Globe, Twitter, Instagram, MessageCircle, MessagesSquare, ExternalLink, Image as ImageIcon, Save, ChevronDown, Settings as SettingsIcon, Key, RotateCcw, Edit2, Star, Bot, AlertTriangle, Trash2 } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';
import { ExchangePartners } from './ExchangePartners';
import { updateAdminData, getAdminData } from '@/utils/api';
import AdminDataContext from '@/contexts/AdminContext';
import { toast } from 'react-toastify';
import { clearErrorLogs, fetchAvailableModels, getModelMetadataByName, getServiceConfig, getServiceErrorLogs, resetConfig, updateConfig, updateModelMetadata } from '@/utils/aiServices';
import { ModelInfo } from '@/types/modelInfo';

export function Settings() {
    const [activeTab, setActiveTab] = useState<'general' | 'exchanges'>('general');
    // const [inviteCodes, setInviteCodes] = useState<string[]>([]);
    const { adminData, setAdminData } = useContext(AdminDataContext);
    const [adminPanelData, setAdminPanelData] = useState({
        twitter: "",
        telegram: "",
        discord: "",
        instagram: "",
        favicon: '',
        pageTitle: '',
        sidebarTitle: '',
        mainTitle: '',
        subTitle: '',
        features: [
            {
                title: '',
                description: ''
            },
            {
                title: '',
                description: ''
            },
            {

                title: '',
                description: ''
            }
        ],
        siteMaintainanceMode: true,
        webhooksMaintainanceMode: true,
        allowSignup: true,
    });
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const handleGetAdminData = async () => {
        const result = await getAdminData();
        if (result) {
            setAdminData(result.data);
        }
    }

    useEffect(() => {
        handleGetAdminData();
    }, []);

    useEffect(() => {
        if (adminData) {
            setAdminPanelData({
                twitter: adminData.twitter || "",
                telegram: adminData.telegram || "",
                discord: adminData.discord || "",
                instagram: adminData.instagram || "",
                favicon: adminData.favicon || "",
                pageTitle: adminData.pageTitle || '',
                sidebarTitle: adminData.sidebarTitle || '',
                mainTitle: adminData.mainTitle || '',
                subTitle: adminData.subTitle || '',
                features: [
                    {
                        title: adminData.featuredCardTitle || '',
                        description: adminData.featuredCardDescription || ''
                    },
                    {
                        title: adminData.featuredCardTitle1 || '',
                        description: adminData.featuredCardDescription1 || ''
                    },
                    {
                        title: adminData.featuredCardDescription || '',
                        description: adminData.featuredCardDescription || ''
                    }
                ],
                siteMaintainanceMode: adminData.siteMaintainanceMode,
                webhooksMaintainanceMode: adminData.webhooksMaintainanceMode,
                allowSignup: adminData.allowSignup,
                // inviteCodes: adminData?.inviteCodes
            });
        }
    }, [adminData]);



    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const renderSectionHeader = (title: string, section: string, icon: React.ReactNode) => (
        <button
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
            <div className="flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === section ? 'transform rotate-180' : ''
                }`} />
        </button>
    );

    const generateInviteCode = () => {
        // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        // let code = '';
        // for (let i = 0; i < 10; i++) {
        //     code += chars.charAt(Math.floor(Math.random() * chars.length));
        // }
        setAdminPanelData({
            ...adminPanelData,
            // inviteCodes: [...adminPanelData.inviteCodes, code] 
        });
    };

    // const copyInviteCode = async (code: string) => {
    //     await navigator.clipboard.writeText(code);
    // };

    // const removeInviteCode = (code: string) => {
    //     setAdminPanelData({
    //         ...adminPanelData,
    //         // inviteCodes: adminPanelData.inviteCodes.filter(c => c !== code) 
    //     });
    // };

    const handleSocialLinkChange = (platform: keyof typeof adminPanelData, value: string) => {
        setAdminPanelData(prev => ({ ...prev, [platform]: value }));
    };

    const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
        const newFeatures = [...adminPanelData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setAdminPanelData({ ...adminPanelData, features: newFeatures });
    };

    const onSave = async () => {
        const result = await updateAdminData(adminPanelData);
        if (result) {
            toast.success(result.message);
            setAdminData(result.data)
        }
    }

    const [aiConfig, setAiConfig] = useState(getServiceConfig());
    const [errorLogs] = useState(getServiceErrorLogs());
    const [showErrorLogs, setShowErrorLogs] = useState(false)
    const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [editingModel, setEditingModel] = useState<string | null>(null);
    const [modelMetadata, setModelMetadata] = useState<{
        tags: string[];
        notes: string;
        tasks: string[];
        rating: number;
    }>({
        tags: [],
        notes: '',
        tasks: [],
        rating: 0
    });

    const loadModels = async () => {
        setIsLoadingModels(true);
        try {
            const models = await fetchAvailableModels();
            setAvailableModels(models);
        } catch (error) {
            console.error('Failed to fetch models:', error);
        } finally {
            setIsLoadingModels(false);
        }
    };

    const handleAIConfigSave = () => {
        updateConfig(aiConfig);
    };

    const handleAIConfigReset = () => {
        if (window.confirm('Are you sure you want to reset to default settings?')) {
            resetConfig();
            setAiConfig(getServiceConfig());
        }
    };

    const handleClearLogs = () => {
        if (window.confirm('Are you sure you want to clear all error logs?')) {
            clearErrorLogs();
            setShowErrorLogs(false);
        }
    };

    const handleEditModel = (modelName: string) => {
        const metadata = getModelMetadataByName(modelName);
        setModelMetadata({
            tags: metadata?.tags || [],
            notes: metadata?.notes || '',
            tasks: metadata?.performance?.tasks || [],
            rating: metadata?.performance?.rating || 0
        });
        setEditingModel(modelName);
    };

    const renderAISection = () => (
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {renderSectionHeader('AI Assistant Settings', 'ai', <Bot className="w-5 h-5 text-purple-500" />)}
            {expandedSection === 'ai' && (
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            API URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={aiConfig.apiUrl}
                                onChange={(e) => setAiConfig({ ...aiConfig, apiUrl: e.target.value })}
                                className="flex-1 px-3 py-2 border rounded-lg"
                                placeholder="Enter API URL"
                            />
                            <button
                                onClick={loadModels}
                                className={`px-3 py-2 rounded-lg border ${isLoadingModels
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                disabled={isLoadingModels}
                                title="Refresh available models"
                            >
                                <RotateCcw className={`w-5 h-5 ${isLoadingModels ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available Models
                        </label>
                        <div className="space-y-2">
                            {availableModels.map((model) => (
                                <div
                                    key={model.name}
                                    className={`p-3 rounded-lg border ${aiConfig.model === model.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="model"
                                                checked={aiConfig.model === model.name}
                                                onChange={() => setAiConfig({ ...aiConfig, model: model.name })}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{model.name}</span>
                                                    {(model.metadata?.performance?.rating ?? 0) > 0 && (
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                            <span className="text-sm text-gray-600 ml-1">
                                                                {model.metadata?.performance?.rating}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {model.details.parameter_size}, {model.details.quantization_level}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditModel(model.name)}
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {model.metadata?.tags && model.metadata.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1 ml-8">
                                            {model.metadata.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            System Prompt
                        </label>
                        <textarea
                            value={aiConfig.systemPrompt}
                            onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={6}
                            placeholder="Enter system prompt"
                        />
                    </div>

                    <div className="border-t pt-6">
                        <button
                            onClick={() => setShowErrorLogs(!showErrorLogs)}
                            className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium">Error Logs</span>
                                {errorLogs.length > 0 && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                                        {errorLogs.length}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${showErrorLogs ? 'transform rotate-180' : ''
                                }`} />
                        </button>

                        {showErrorLogs && (
                            <div className="mt-4 space-y-4">
                                {errorLogs.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">No errors logged</p>
                                ) : (
                                    <>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleClearLogs}
                                                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Clear Logs
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {errorLogs.map((log: any, index: number) => (
                                                <div key={index} className="p-3 bg-red-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-red-800">
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-red-600">{log.error}</p>
                                                    {log.details && (
                                                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                                                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleAIConfigReset}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset to Default
                        </button>
                        <button
                            onClick={handleAIConfigSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'general'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    General Settings
                </button>
                <button
                    onClick={() => setActiveTab('exchanges')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'exchanges'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Exchange Partners
                </button>
            </div>

            {activeTab === 'general' ? (
                <>
                    {/* Branding Settings */}
                    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                        {renderSectionHeader('Branding Settings', 'branding', <ImageIcon className="w-5 h-5 text-blue-500" />)}
                        {expandedSection === 'branding' && (
                            <div className="p-6 w-full">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Favicon URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={adminPanelData.favicon}
                                                onChange={(e) => setAdminPanelData({ ...adminPanelData, favicon: e.target.value })}
                                                className="flex-1 rounded-lg border-gray-300"
                                                placeholder="Enter favicon URL..."
                                            />
                                            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                <ImageIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Page Title
                                        </label>
                                        <input
                                            type="text"
                                            value={adminPanelData.pageTitle}
                                            onChange={(e) => setAdminPanelData({ ...adminPanelData, pageTitle: e.target.value })}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="Enter page title..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">This appears in the browser tab</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sidebar Title
                                        </label>
                                        <input
                                            type="text"
                                            value={adminPanelData.sidebarTitle}
                                            onChange={(e) => setAdminPanelData({ ...adminPanelData, sidebarTitle: e.target.value })}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="Enter sidebar title..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">The title shown in the navigation sidebar</p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="text-md font-medium mb-4">Homepage Content</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Main Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={adminPanelData.mainTitle}
                                                    onChange={(e) => setAdminPanelData({ ...adminPanelData, mainTitle: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="Enter main title..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Subtitle
                                                </label>
                                                <input
                                                    type="text"
                                                    value={adminPanelData.subTitle}
                                                    onChange={(e) => setAdminPanelData({ ...adminPanelData, subTitle: e.target.value })}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="Enter subtitle..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Feature Cards
                                                </label>
                                                <div className="space-y-4">
                                                    {adminPanelData.features.map((feature, index) => (
                                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                                            <div className="mb-2">
                                                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={feature.title}
                                                                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                                    className="w-full rounded-lg border-gray-300"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm text-gray-600 mb-1">Description</label>
                                                                <input
                                                                    type="text"
                                                                    value={feature.description}
                                                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                                    className="w-full rounded-lg border-gray-300"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* System Settings */}
                    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                        {renderSectionHeader('System Settings', 'system', <SettingsIcon className="w-5 h-5 text-green-500" />)}
                        {expandedSection === 'system' && (
                            <div className="p-6 w-full">
                                <div className="space-y-4">
                                    {/*Site Maintenance Mode */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">Site Maintenance Mode</p>
                                                {adminPanelData.siteMaintainanceMode && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Temporarily disable all site operations</p>
                                        </div>
                                        <button
                                            onClick={() => setAdminPanelData({ ...adminPanelData, siteMaintainanceMode: !adminPanelData.siteMaintainanceMode })}
                                            className={`p-2 rounded-full transition-colors ${adminPanelData.siteMaintainanceMode
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {adminPanelData.siteMaintainanceMode ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {/* Webhooks Maintenance Mode */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">Webhooks Maintenance Mode</p>
                                                {adminPanelData.webhooksMaintainanceMode && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Temporarily disable all trading operations</p>
                                        </div>
                                        <button
                                            onClick={() => setAdminPanelData({ ...adminPanelData, webhooksMaintainanceMode: !adminPanelData.webhooksMaintainanceMode })}
                                            className={`p-2 rounded-full transition-colors ${adminPanelData.webhooksMaintainanceMode
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {adminPanelData.webhooksMaintainanceMode ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Signups */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">Allow Signups</p>
                                                {!adminPanelData.allowSignup && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                        Disabled
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Enable or disable new user registrations</p>
                                        </div>
                                        <button
                                            onClick={() => setAdminPanelData({ ...adminPanelData, allowSignup: !adminPanelData.allowSignup })}
                                            className={`p-2 rounded-full transition-colors ${adminPanelData.allowSignup
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {adminPanelData.allowSignup ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {renderAISection()}

                    {/* Social Links */}
                    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                        {renderSectionHeader('Social Links', 'social', <Globe className="w-5 h-5 text-purple-500" />)}
                        {expandedSection === 'social' && (
                            <div className="p-6 w-full">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Twitter className="w-5 h-5 text-blue-400" />
                                        <input
                                            type="text"
                                            value={adminPanelData.twitter}
                                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                                            placeholder="Twitter URL"
                                            className="flex-1 rounded-lg border-gray-300"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-blue-500" />
                                        <input
                                            type="text"
                                            value={adminPanelData.telegram}
                                            onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                                            placeholder="Telegram URL"
                                            className="flex-1 rounded-lg border-gray-300"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MessagesSquare className="w-5 h-5 text-indigo-500" />
                                        <input
                                            type="text"
                                            value={adminPanelData.discord}
                                            onChange={(e) => handleSocialLinkChange('discord', e.target.value)}
                                            placeholder="Discord URL"
                                            className="flex-1 rounded-lg border-gray-300"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Instagram className="w-5 h-5 text-pink-600" />
                                        <input
                                            type="text"
                                            value={adminPanelData.instagram}
                                            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                                            placeholder="Instagram URL"
                                            className="flex-1 rounded-lg border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => onSave()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </>
            ) : (
                <ExchangePartners />
            )}
        </div>
    );
}