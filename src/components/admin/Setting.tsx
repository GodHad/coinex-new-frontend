import React, { useContext, useEffect, useState } from 'react';
import { Check, X, RefreshCw, Globe, Twitter, Instagram, MessageCircle, MessagesSquare, Copy, ExternalLink, Image as ImageIcon, Save, ChevronDown, Settings as SettingsIcon, Key } from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';
import { ExchangePartners } from './ExchangePartners';
import { updateAdminData, getAdminData } from '@/utils/api';
import AdminDataContext from '@/contexts/AdminContext';
import { toast } from 'react-toastify';

export function Settings() {
    const [activeTab, setActiveTab] = useState<'general' | 'exchanges'>('general');
    const [inviteCodes, setInviteCodes] = useState<string[]>([]);
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
        maintainanceMode:true,
        allowSignup:true,
        inviteCodes: [],
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
                maintainanceMode:adminData.maintainanceMode,
                allowSignup: adminData.allowSignup,
                inviteCodes: adminData.inviteCodes
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
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setAdminPanelData({
            ...adminPanelData,
            inviteCodes: [...adminPanelData.inviteCodes, code] 
        });
    };

    const copyInviteCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
    };

    const removeInviteCode = (code: string) => {
        setAdminPanelData({
            ...adminPanelData,
            inviteCodes: adminPanelData.inviteCodes.filter(c => c !== code) 
        });
    };

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
                                    {/* Maintenance Mode */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">Maintenance Mode</p>
                                                {adminPanelData.maintainanceMode && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">Temporarily disable all trading operations</p>
                                        </div>
                                        <button
                                            onClick={() => setAdminPanelData({...adminPanelData,maintainanceMode:!adminPanelData.maintainanceMode})}
                                            className={`p-2 rounded-full transition-colors ${adminPanelData.maintainanceMode
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {adminPanelData.maintainanceMode ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
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
                                            onClick={() => setAdminPanelData({...adminPanelData,allowSignup:!adminPanelData.allowSignup})}
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

                    {/* Invite Codes */}
                    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                        {renderSectionHeader('Invite Codes', 'invites', <Key className="w-5 h-5 text-yellow-500" />)}
                        {expandedSection === 'invites' && (
                            <div className="p-6 w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold">Invite Codes</h2>
                                        <Tooltip content="Generate and manage invite codes for new users">
                                            <div className="p-1 text-gray-400 cursor-help">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <button
                                        onClick={generateInviteCode}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Generate Code
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {adminPanelData.inviteCodes.map(code => (
                                        <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <code className="font-mono text-sm">{code}</code>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => copyInviteCode(code)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeInviteCode(code)}
                                                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {adminPanelData.inviteCodes.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">
                                            No invite codes generated yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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