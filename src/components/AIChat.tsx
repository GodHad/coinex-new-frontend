import React, { useState } from 'react';
import { Send, Bot, Code, Copy, Check, Sparkles, Crown, Trash2, Share2, Settings, Plus, Edit2, Save } from 'lucide-react';
import { generateText } from '@/utils/aiServices';
import { AdminAISettings } from './AdminAISettings';

interface AIChatProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlocks?: {
    language: string;
    code: string;
  }[];
};

type SavedIndicator = {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  notes?: string;
  tags?: string[];
  created: string;
  lastModified: string;
};

export default function AIChat({ isPremium = false, isAdmin = false }: AIChatProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you with coding and understanding Pine Script for TradingView. What would you like to work on?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedIndicators, setSavedIndicators] = useState<SavedIndicator[]>([
    {
      id: '1',
      name: 'RSI with EMA',
      description: 'RSI indicator with EMA smoothing and dynamic overbought/oversold levels',
      language: 'pine',
      code: '//@version=5\nindicator("RSI with EMA", overlay=false)\n\n// Input parameters\nrsiLength = input(14, "RSI Length")\nemaLength = input(9, "EMA Length")\n\n// Calculate RSI\nrsi = ta.rsi(close, rsiLength)\n\n// Apply EMA smoothing\nsmoothRsi = ta.ema(rsi, emaLength)\n\n// Plot\nplot(smoothRsi, "Smooth RSI", color=color.blue)\nhline(70, "Overbought", color=color.red)\nhline(30, "Oversold", color=color.green)',
      notes: 'Added dynamic overbought/oversold levels based on volatility',
      tags: ['RSI', 'EMA', 'Momentum'],
      created: '2024-03-14T10:00:00Z',
      lastModified: '2024-03-14T10:00:00Z'
    }
  ]);
  const [editingIndicator, setEditingIndicator] = useState<SavedIndicator | null>(null);
  const [showNewIndicator, setShowNewIndicator] = useState(false);
  const [newIndicator, setNewIndicator] = useState<Partial<SavedIndicator>>({
    name: '',
    description: '',
    language: 'pine',
    code: '',
    notes: '',
    tags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateText(input);
      
      // Extract code blocks from the response
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const codeBlocks: { language: string; code: string; }[] = [];
      let cleanedResponse = response;
      
      let match;
      while ((match = codeBlockRegex.exec(response)) !== null) {
        const language = match[1] || 'pine';
        const code = match[2].trim();
        codeBlocks.push({ language, code });
        cleanedResponse = cleanedResponse.replace(match[0], '');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedResponse.trim(),
        timestamp: new Date().toISOString(),
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const saveIndicatorFromChat = (code: string, language: string = 'pine') => {
    setNewIndicator({
      name: 'New Indicator',
      description: 'Generated from chat',
      language,
      code,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });
    setShowNewIndicator(true);
  };

  const handleSaveIndicator = () => {
    if (editingIndicator) {
      setSavedIndicators(indicators => 
        indicators.map(ind => 
          ind.id === editingIndicator.id 
            ? { ...editingIndicator, lastModified: new Date().toISOString() }
            : ind
        )
      );
      setEditingIndicator(null);
    } else if (newIndicator.name && newIndicator.code) {
      const indicator: SavedIndicator = {
        id: Math.random().toString(36).substring(7),
        name: newIndicator.name!,
        description: newIndicator.description || '',
        language: newIndicator.language || 'pine',
        code: newIndicator.code!,
        notes: newIndicator.notes,
        tags: newIndicator.tags,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setSavedIndicators(prev => [...prev, indicator]);
      setNewIndicator({
        name: '',
        description: '',
        language: 'pine',
        code: '',
        notes: '',
        tags: []
      });
    }
    setShowNewIndicator(false);
  };

  const handleDeleteIndicator = (id: string) => {
    if (window.confirm('Are you sure you want to delete this indicator?')) {
      setSavedIndicators(indicators => indicators.filter(ind => ind.id !== id));
    }
  };

  const renderIndicatorForm = (indicator: Partial<SavedIndicator>) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={indicator.name}
          onChange={(e) => setNewIndicator({ ...indicator, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter indicator name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={indicator.description}
          onChange={(e) => setNewIndicator({ ...indicator, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
        <textarea
          value={indicator.code}
          onChange={(e) => setNewIndicator({ ...indicator, code: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          rows={10}
          placeholder="Enter indicator code"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={indicator.notes}
          onChange={(e) => setNewIndicator({ ...indicator, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          placeholder="Add any notes or implementation details"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          type="text"
          value={indicator.tags?.join(', ')}
          onChange={(e) => setNewIndicator({ 
            ...indicator, 
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter tags separated by commas"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowNewIndicator(false);
            setEditingIndicator(null);
          }}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveIndicator}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Indicator
        </button>
      </div>
    </div>
  );

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
          <p className="text-gray-600 mb-6">
            Get help coding TradingView indicators with our AI assistant. Available exclusively for premium users.
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Custom indicator development</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Strategy optimization</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Export and share indicators</span>
            </div>
          </div>
          <a
            href="/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Premium
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              AI Service Settings
            </button>
          </div>
        )}

        {/* Main Chat Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
          </div>

          <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'assistant'
                        ? 'bg-gray-100'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.codeBlocks?.map((block, index) => (
                      <div key={index} className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                          <span className="text-sm text-gray-300">{block.language}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveIndicatorFromChat(block.code, block.language)}
                              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
                              title="Save as indicator"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(block.code, `${message.id}-${index}`)}
                              className="p-1 hover:bg-gray-700 rounded"
                            >
                              {copied === `${message.id}-${index}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    ))}
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about creating indicators..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Saved Indicators Section */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Saved Indicators</h2>
              <button
                onClick={() => setShowNewIndicator(true)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Add new indicator"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {showNewIndicator && (
              <div className="mb-6 border-b pb-6">
                <h3 className="font-medium mb-4">New Indicator</h3>
                {renderIndicatorForm(newIndicator)}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedIndicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {editingIndicator?.id === indicator.id ? (
                    renderIndicatorForm(editingIndicator)
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{indicator.name}</h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(indicator.code, `saved-${indicator.id}`)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg"
                            title="Copy code"
                          >
                            {copied === `saved-${indicator.id}` ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingIndicator(indicator)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Edit indicator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteIndicator(indicator.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete indicator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{indicator.description}</p>
                      {indicator.notes && (
                        <div className="mb-2 text-sm bg-white p-2 rounded border border-gray-200">
                          <p className="text-gray-600">{indicator.notes}</p>
                        </div>
                      )}
                      {indicator.tags && indicator.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {indicator.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Last modified: {new Date(indicator.lastModified).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showSettings && isAdmin && (
          <AdminAISettings onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}