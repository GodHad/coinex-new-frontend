/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

interface AIServiceConfig {
  apiUrl: string;
  model: string;
  systemPrompt: string;
}

interface ModelMetadata {
  tags: string[];
  notes: string;
  performance: {
    tasks: string[];
    rating: number;
    lastUsed?: string;
  };
}

interface ModelInfo {
  name: string;
  size: string;
  modified_at: string;
  digest: string;
  details: {
    parameter_size: string;
    quantization_level: string;
  };
  metadata?: ModelMetadata;
}

// Default configuration
const defaultConfig: AIServiceConfig = {
  apiUrl: "http://localhost:11434/api/generate",
  model: "llama2",
  systemPrompt: `You are a professional trader and expert Pine Script coder with deep knowledge of TradingView strategies and indicators. Your goal is to provide precise, insightful, and technically accurate responses about trading strategies, backtesting, and script development in TradingView. Ensure your explanations are clear, well-structured, and backed by industry best practices.

Keep the response professional and informative, avoiding unnecessary humor or casual tones.`
};

// Model metadata storage
const getModelMetadata = (): Record<string, ModelMetadata> => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('modelMetadata');
  return stored ? JSON.parse(stored) : {};
};

const setModelMetadata = (metadata: Record<string, ModelMetadata>) => {
  localStorage.setItem('modelMetadata', JSON.stringify(metadata));
};

// Initialize metadata
let modelMetadata = getModelMetadata();

// Hardcoded fallback models with metadata support
const fallbackModels: ModelInfo[] = [
  {
    name: "phi4",
    size: "9.1 GB",
    modified_at: new Date().toISOString(),
    digest: "ac896e5b8b34",
    details: {
      parameter_size: "9.1GB",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "llama3.1",
    size: "4.9 GB",
    modified_at: new Date().toISOString(),
    digest: "46e0c10c039e",
    details: {
      parameter_size: "4.9GB",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "deepseek-r1",
    size: "9.0 GB",
    modified_at: new Date().toISOString(),
    digest: "ea35dfe18182",
    details: {
      parameter_size: "14B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "gemma2",
    size: "1.6 GB",
    modified_at: new Date().toISOString(),
    digest: "8ccf136fdd52",
    details: {
      parameter_size: "2B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "qwen2.5",
    size: "4.7 GB",
    modified_at: new Date().toISOString(),
    digest: "845dbda0ea48",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "starcoder2",
    size: "4.0 GB",
    modified_at: new Date().toISOString(),
    digest: "1550ab21b10d",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "codellama",
    size: "3.8 GB",
    modified_at: new Date().toISOString(),
    digest: "8fdf8f752f6e",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "llava",
    size: "4.7 GB",
    modified_at: new Date().toISOString(),
    digest: "8dd30f6b0cb1",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "mistral",
    size: "4.1 GB",
    modified_at: new Date().toISOString(),
    digest: "f974a74358d6",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "llama3.2-vision",
    size: "7.9 GB",
    modified_at: new Date().toISOString(),
    digest: "38107a0cd119",
    details: {
      parameter_size: "11B",
      quantization_level: "Q4_K_M"
    }
  },
  {
    name: "llama2:7b-chat-q8_0",
    size: "7.2 GB",
    modified_at: new Date().toISOString(),
    digest: "fc35dd6c8370",
    details: {
      parameter_size: "7B",
      quantization_level: "Q8_0"
    }
  },
  {
    name: "llama2",
    size: "3.8 GB",
    modified_at: new Date().toISOString(),
    digest: "78e26419b446",
    details: {
      parameter_size: "7B",
      quantization_level: "Q4_K_M"
    }
  }
];

// Use local storage to persist config changes
const getConfig = (): AIServiceConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  const storedConfig = localStorage.getItem('aiServiceConfig');
  return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
};

const setConfig = (config: AIServiceConfig) => {
  localStorage.setItem('aiServiceConfig', JSON.stringify(config));
};

// Initialize config
let currentConfig = getConfig();

// Error log storage
const MAX_ERROR_LOGS = 100;
const getErrorLogs = () => {
  const logs = localStorage.getItem('aiServiceErrorLogs');
  return logs ? JSON.parse(logs) : [];
};

const addErrorLog = (error: any) => {
  const logs = getErrorLogs();
  const newLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    details: error.response?.data || error.toString(),
    config: { ...currentConfig }
  };
  
  logs.unshift(newLog);
  if (logs.length > MAX_ERROR_LOGS) {
    logs.pop();
  }
  
  localStorage.setItem('aiServiceErrorLogs', JSON.stringify(logs));
};

interface GenerateResponse {
  response: string;
}

// Model metadata management
export const updateModelMetadata = (modelName: string, metadata: Partial<ModelMetadata>) => {
  modelMetadata = {
    ...modelMetadata,
    [modelName]: {
      ...modelMetadata[modelName],
      ...metadata,
      performance: {
        ...(modelMetadata[modelName]?.performance || { tasks: [], rating: 0 }),
        ...(metadata.performance || {})
      }
    }
  };
  setModelMetadata(modelMetadata);
};

export const getModelMetadataByName = (modelName: string): ModelMetadata | undefined => {
  return modelMetadata[modelName];
};

export const getAllModelMetadata = () => modelMetadata;

// Configuration management
export const updateConfig = (newConfig: Partial<AIServiceConfig>) => {
  currentConfig = { ...currentConfig, ...newConfig };
  setConfig(currentConfig);
};

export const resetConfig = () => {
  currentConfig = { ...defaultConfig };
  setConfig(currentConfig);
};

export const getServiceConfig = () => ({ ...currentConfig });

export const getServiceErrorLogs = () => getErrorLogs();

export const clearErrorLogs = () => {
  localStorage.removeItem('aiServiceErrorLogs');
};

// API interaction
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await axios.post<GenerateResponse>(currentConfig.apiUrl, {
      model: currentConfig.model,
      prompt: `${currentConfig.systemPrompt}\n\nPrompt: ${prompt}`,
      stream: false
    });

    // Update model metadata with last used timestamp
    updateModelMetadata(currentConfig.model, {
      performance: {
        tasks: modelMetadata[currentConfig.model]?.performance.tasks || [],
        rating: modelMetadata[currentConfig.model]?.performance.rating || 0,
        lastUsed: new Date().toISOString()
      }
    });

    return response.data.response;
  } catch (error) {
    addErrorLog(error);
    throw error;
  }
}

export async function fetchAvailableModels() {
  try {
    // Get base URL by removing '/api/generate' from the API URL
    const baseUrl = currentConfig.apiUrl.replace('/api/generate', '');
    
    // Fetch the list of models from Ollama API
    const response = await axios.get(`${baseUrl}/api/list`);
    
    // Check if response data exists and has models
    if (!response.data || !Array.isArray(response.data)) {
      console.log('Invalid API response, using fallback models');
      return addMetadataToModels(fallbackModels);
    }

    // Transform the response to match our interface
    const models = response.data.map((model: any) => {
      const sizeInGB = model.size ? (model.size / 1024 / 1024 / 1024).toFixed(1) : 'Unknown';
      
      return {
        name: model.name,
        size: `${sizeInGB} GB`,
        modified_at: model.modified_at || new Date().toISOString(),
        digest: model.digest || '',
        details: {
          parameter_size: `${sizeInGB}GB`,
          quantization_level: model.quantized || 'Unknown'
        }
      };
    });

    return addMetadataToModels(models);
  } catch (error) {
    console.log('API error, using fallback models:', error);
    addErrorLog(error);
    return addMetadataToModels(fallbackModels);
  }
}

function addMetadataToModels(models: ModelInfo[]): ModelInfo[] {
  return models.map(model => ({
    ...model,
    metadata: modelMetadata[model.name]
  }));
}