'use client'
import UserContext from '@/contexts/UserContext';
import { ExternalLink, AlertTriangle, ArrowRight, Pencil, Save, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useContext, useState } from 'react';

type GuideStep = {
    title: string;
    description: string;
    steps: string[];
    warning?: {
        type: 'info' | 'warning' | 'danger';
        title?: string;
        message: string;
    };
    image?: string;
};

const RenderCoinexGuide = () => {
    const [editingStep, setEditingStep] = useState<number | null>(null);
    const [steps, setSteps] = useState<GuideStep[]>([
        {
            title: 'Create a Sub-Account',
            description: 'Creating a dedicated sub-account helps isolate your automated trading activities from your main account, reducing risk and improving fund management.',
            steps: [
                'Log in to your CoinEx account',
                'Navigate to "Account" → "Sub-Account"',
                'Click "Create Sub-Account"',
                'Name it appropriately (e.g., "TradingBot")'
            ],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400'
        },
        {
            title: 'Transfer Funds to Sub-Account',
            description: 'Transfer only the amount you plan to use for automated trading. This helps maintain better control over your trading capital.',
            steps: [
                'Go to "Assets" → "Transfer"',
                'Select your main account as the source',
                'Select your new sub-account as the destination',
                'Enter the amount and confirm the transfer'
            ],
            warning: {
                type: 'info',
                message: 'Only transfer funds you can afford to risk. We recommend starting with a small amount until you\'re comfortable with the system.'
            },
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=400'
        },
        {
            title: 'Enable Futures Trading',
            description: 'You\'ll need to enable futures trading on your sub-account and agree to the terms of service.',
            steps: [
                'Switch to your sub-account',
                'Navigate to the Futures trading page',
                'Read and accept the futures trading agreement',
                'Complete any required questionnaires'
            ],
            warning: {
                type: 'warning',
                message: 'Futures trading involves significant risks. Make sure you understand the terms and conditions before proceeding.'
            },
            image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&h=400'
        },
        {
            title: 'Configure Margin and Leverage Settings',
            description: 'Proper configuration of margin type and leverage is crucial for risk management.',
            steps: [
                'Set margin type to "Isolated" (recommended for better risk management)',
                'Configure your default leverage (start low, e.g., 2x-5x)',
                'Enable position limits if available'
            ],
            warning: {
                type: 'danger',
                title: 'Warning About Cross Margin',
                message: 'Avoid using Cross Margin as it puts your entire account balance at risk. Always use Isolated Margin to limit potential losses to the position\'s allocated margin.'
            },
            image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&h=400'
        }
    ])

    const [editingStepData, setEditingStepData] = useState<GuideStep | null>(null);
    const startEditing = (index: number) => {
        setEditingStep(index);
        setEditingStepData({ ...steps[index] });
    };

    const { user } = useContext(UserContext);

    const saveEdits = (index: number) => {
        if (editingStepData) {
            const newSteps = [...steps];
            newSteps[index] = editingStepData;
            setSteps(newSteps);
            setEditingStep(null);
            setEditingStepData(null);
        }
    };

    const cancelEditing = () => {
        setEditingStep(null);
        setEditingStepData(null);
    };

    const renderEditableStep = (step: GuideStep, index: number) => {
        if (editingStep === index && editingStepData) {
            return (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={editingStepData.title}
                            onChange={(e) => setEditingStepData({ ...editingStepData, title: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={editingStepData.description}
                            onChange={(e) => setEditingStepData({ ...editingStepData, description: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                        {editingStepData.steps.map((stepText, stepIndex) => (
                            <div key={stepIndex} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={stepText}
                                    onChange={(e) => {
                                        const newSteps = [...editingStepData.steps];
                                        newSteps[stepIndex] = e.target.value;
                                        setEditingStepData({ ...editingStepData, steps: newSteps });
                                    }}
                                    className="w-full rounded-lg border-gray-300 shadow-sm"
                                />
                                <button
                                    onClick={() => {
                                        const newSteps = editingStepData.steps.filter((_, i) => i !== stepIndex);
                                        setEditingStepData({ ...editingStepData, steps: newSteps });
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setEditingStepData({
                                ...editingStepData,
                                steps: [...editingStepData.steps, '']
                            })}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            Add Step
                        </button>
                    </div>

                    {editingStepData.warning && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warning Message</label>
                            <textarea
                                value={editingStepData.warning.message}
                                onChange={(e) => setEditingStepData({
                                    ...editingStepData,
                                    warning: { ...editingStepData.warning, message: e.target.value, type: editingStepData.warning?.type || 'info' }
                                })}
                                className="w-full rounded-lg border-gray-300 shadow-sm"
                                rows={2}
                            />
                            <select
                                value={editingStepData.warning.type}
                                onChange={(e) => setEditingStepData({
                                    ...editingStepData,
                                    warning: editingStepData.warning ? { ...editingStepData.warning, type: e.target.value as 'info' | 'warning' | 'danger', message: editingStepData.warning.message || '' } : { type: e.target.value as 'info' | 'warning' | 'danger', message: '' }
                                })}
                                className="mt-2 rounded-lg border-gray-300 shadow-sm"
                            >
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="danger">Danger</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot URL</label>
                        <input
                            type="text"
                            value={editingStepData.image || ''}
                            onChange={(e) => setEditingStepData({ ...editingStepData, image: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm"
                            placeholder="Enter image URL"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={cancelEditing}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => saveEdits(index)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        {user?.isAdmin && (
                            <button
                                onClick={() => startEditing(index)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Steps:</h4>
                            <ol className="space-y-2 text-gray-600">
                                {step.steps.map((stepText, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start gap-2">
                                        <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                                        {stepText}
                                    </li>
                                ))}
                            </ol>
                        </div>
                        {step.warning && (
                            <div className={`bg-${step.warning.type === 'info' ? 'blue' : step.warning.type === 'warning' ? 'yellow' : 'red'}-50 rounded-lg p-4`}>
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className={`w-5 h-5 text-${step.warning.type === 'info' ? 'blue' : step.warning.type === 'warning' ? 'yellow' : 'red'}-600 mt-0.5`} />
                                    <div>
                                        {step.warning.title && (
                                            <h5 className={`font-medium text-${step.warning.type === 'info' ? 'blue' : step.warning.type === 'warning' ? 'yellow' : 'red'}-800`}>
                                                {step.warning.title}
                                            </h5>
                                        )}
                                        <p className={`text-sm text-${step.warning.type === 'info' ? 'blue' : step.warning.type === 'warning' ? 'yellow' : 'red'}-700 ${step.warning.title ? 'mt-1' : ''}`}>
                                            {step.warning.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step.image && (
                            <div className="mt-4">
                                <Image
                                    src={step.image}
                                    alt={`Screenshot for ${step.title}`}
                                    className="w-full rounded-lg shadow-md"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">CoinEx Setup Guide</h1>
                <a
                    href="https://www.coinex.com/register?rc=rbcgu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    Open CoinEx
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            {renderEditableStep(step, index)}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};

export default RenderCoinexGuide