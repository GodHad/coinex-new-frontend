import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, AlertTriangle, Trash2, ChevronDown, X, RefreshCw, Edit2, Star } from 'lucide-react';
import { getServiceConfig, updateConfig, resetConfig, getServiceErrorLogs, clearErrorLogs, fetchAvailableModels } from '@/utils/aiServices';
import { ModelMetadataEditor } from './ModelMetadataEditor';

interface AdminAISettingsProps {
  onClose: () => void;
}

interface ModelInfo {
  name: string;
  size: string;
  details: {
    parameter_size: string;
    quantization_level: string;
  };
  metadata?: {
    tags: string[];
    notes: string;
    performance: {
      tasks: string[];
      rating: number;
      lastUsed?: string;
    };
  };
}

export function AdminAISettings({ onClose }: AdminAISettingsProps) {
  const [config, setConfig] = useState(getServiceConfig());
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const [errorLogs] = useState(getServiceErrorLogs());
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const loadModels = async () => {
    setIsLoadingModels(true);
    setModelError(null);
    try {
      const models = await fetchAvailableModels();
      setAvailableModels(models || []);
    } catch {
      setModelError('Failed to fetch available models. Please check your API URL and try again.');
      setAvailableModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, [config.apiUrl]);

  const handleSave = () => {
    updateConfig(config);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default settings?')) {
      resetConfig();
      setConfig(getServiceConfig());
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all error logs?')) {
      clearErrorLogs();
      setShowErrorLogs(false);
    }
  };

  const selectedModel = availableModels.find(m => m.name === config.model);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">AI Service Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={config.apiUrl}
                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Enter API URL"
              />
              <button
                onClick={loadModels}
                className={`px-3 py-2 rounded-lg border ${
                  isLoadingModels
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
                disabled={isLoadingModels}
                title="Refresh available models"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingModels ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            {modelError ? (
              <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                {modelError}
              </div>
            ) : isLoadingModels ? (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                Loading available models...
              </div>
            ) : availableModels.length === 0 ? (
              <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-600">
                No models available. Please check your API URL and click refresh.
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {selectedModel ? (
                      <>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedModel.name}</span>
                            {selectedModel.metadata?.performance && selectedModel.metadata.performance.rating > 0 && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {selectedModel.metadata.performance.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {selectedModel.details.parameter_size}, {selectedModel.details.quantization_level}
                          </p>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Select a model</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showModelDropdown ? 'transform rotate-180' : ''
                  }`} />
                </button>

                {showModelDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableModels.map((model) => (
                      <div
                        key={model.name}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${
                          config.model === model.name ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setConfig({ ...config, model: model.name });
                          setShowModelDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{model.name}</span>
                              {model.metadata?.performance && model.metadata.performance.rating > 0 && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm text-gray-600 ml-1">
                                    {model.metadata.performance.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {model.details.parameter_size}, {model.details.quantization_level}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingModel(model.name);
                              setShowModelDropdown(false);
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
                            title="Edit model metadata"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        {model.metadata?.tags && model.metadata.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
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
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
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
              <ChevronDown className={`w-5 h-5 transition-transform ${
                showErrorLogs ? 'transform rotate-180' : ''
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
                      {errorLogs.map((log: { timestamp: string; error: string; details?: string | object }, index: number) => (
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

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {editingModel && (
        <ModelMetadataEditor
          modelName={editingModel}
          onClose={() => {
            setEditingModel(null);
            loadModels();
          }}
        />
      )}
    </div>
  );
}