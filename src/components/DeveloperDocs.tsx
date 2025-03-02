'use client';
import React, { useState } from 'react';
import { Code, ExternalLink, ChevronDown, Globe, Layout, Palette, Database, Zap, Server, Check, Copy } from 'lucide-react';

export function DeveloperDocs() {
  const [expandedSection, setExpandedSection] = useState<string | null>('architecture');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Component for code blocks with syntax highlighting
  const CodeBlock = ({ language, code, id }: { language: string; code: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-300">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
          title="Copy code"
        >
          {copiedId === id ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Developer Documentation</h1>
        <p className="text-gray-600 mb-8">
          This documentation provides an overview of the architecture, design patterns, and key components
          of the Webhook Manager application. Use this as a reference for understanding and recreating
          the look and feel of the application.
        </p>

        {/* Architecture Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('architecture')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Architecture Overview</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'architecture' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'architecture' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                The application is built using a modern React stack with TypeScript for type safety, Tailwind CSS for styling,
                and Vite as the build tool. It follows a component-based architecture with a focus on reusability and maintainability.
              </p>
              
              <h3 className="font-medium mb-2">Core Technologies</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
                <li>React 18.3+ with functional components and hooks</li>
                <li>TypeScript for type safety</li>
                <li>Tailwind CSS for utility-first styling</li>
                <li>Vite for fast development and optimized builds</li>
                <li>Lucide React for consistent iconography</li>
                <li>Chart.js and react-chartjs-2 for data visualization</li>
                <li>date-fns for date manipulation</li>
              </ul>
              
              <h3 className="font-medium mb-2">Project Structure</h3>
              <CodeBlock 
                language="text" 
                id="project-structure"
                code={`src/
├── components/       # Reusable UI components
│   ├── Sidebar.tsx   # Main navigation sidebar
│   ├── Tooltip.tsx   # Reusable tooltip component
│   └── ...
├── pages/            # Page components
│   ├── Dashboard.tsx # Main dashboard page
│   ├── Webhooks.tsx  # Webhooks management page
│   └── ...
├── services/         # API and service functions
│   └── aiService.ts  # AI service integration
├── App.tsx           # Main application component
└── main.tsx          # Application entry point`}
              />
              
              <h3 className="font-medium mt-4 mb-2">Key Design Patterns</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Component composition for UI elements</li>
                <li>React hooks for state management (useState, useEffect)</li>
                <li>Conditional rendering based on user permissions</li>
                <li>Responsive design with mobile-first approach</li>
                <li>Modal patterns for forms and detailed views</li>
                <li>Card-based UI for consistent information display</li>
              </ul>
            </div>
          )}
        </div>

        {/* UI Components Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('ui-components')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold">UI Components</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'ui-components' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'ui-components' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                The application uses a set of reusable UI components to maintain consistency across the interface.
                Here are some key components and their implementation:
              </p>
              
              <h3 className="font-medium mb-2">Tooltip Component</h3>
              <p className="text-gray-600 mb-2">
                A reusable tooltip component that displays additional information on hover:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="tooltip-component"
                code={`import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function Tooltip({ content, children, showIcon = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      {children}
      {showIcon && <HelpCircle className="w-4 h-4 ml-1 text-gray-400" />}
      <div className={\`
        absolute z-50 w-64 p-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
        transition-opacity duration-200
        \${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        bottom-full left-1/2 transform -translate-x-1/2 mb-2
      \`}>
        {content}
        <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
      <button
        className="absolute inset-0 w-full h-full cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => e.preventDefault()}
      />
    </div>
  );
}`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Modal Pattern</h3>
              <p className="text-gray-600 mb-2">
                The application uses modals for forms, confirmations, and detailed views:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="modal-pattern"
                code={`// Modal wrapper pattern
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold">Modal Title</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
    
    {/* Modal content */}
    <div className="space-y-4">
      {/* Form fields or content */}
    </div>
    
    {/* Modal actions */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Confirm
      </button>
    </div>
  </div>
</div>`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Card Component Pattern</h3>
              <p className="text-gray-600 mb-2">
                Cards are used throughout the application to display information consistently:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="card-pattern"
                code={`// Card component pattern
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Card Title</h2>
      <div className="flex items-center gap-2">
        {/* Action buttons */}
      </div>
    </div>
  </div>
  <div className="p-6">
    {/* Card content */}
  </div>
</div>`}
              />
            </div>
          )}
        </div>

        {/* Styling Patterns Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('styling')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Palette className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold">Styling Patterns</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'styling' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'styling' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                The application uses Tailwind CSS for styling with consistent patterns for different UI elements.
              </p>
              
              <h3 className="font-medium mb-2">Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-600 text-white rounded-lg">
                  <p className="font-medium">Primary Blue</p>
                  <p className="text-sm opacity-80">bg-blue-600</p>
                </div>
                <div className="p-4 bg-yellow-500 text-white rounded-lg">
                  <p className="font-medium">Premium Yellow</p>
                  <p className="text-sm opacity-80">bg-yellow-500</p>
                </div>
                <div className="p-4 bg-gray-900 text-white rounded-lg">
                  <p className="font-medium">Dark Background</p>
                  <p className="text-sm opacity-80">bg-gray-900</p>
                </div>
                <div className="p-4 bg-gray-50 text-gray-900 rounded-lg border border-gray-200">
                  <p className="font-medium">Light Background</p>
                  <p className="text-sm opacity-80">bg-gray-50</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Button Styles</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Primary Button</p>
                  <CodeBlock 
                    language="html" 
                    id="primary-button"
                    code={`<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Button Text
</button>`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Secondary Button</p>
                  <CodeBlock 
                    language="html" 
                    id="secondary-button"
                    code={`<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
  Button Text
</button>`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Premium Button</p>
                  <CodeBlock 
                    language="html" 
                    id="premium-button"
                    code={`<button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-md">
  Premium Feature
</button>`}
                  />
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Form Elements</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Input Field</p>
                  <CodeBlock 
                    language="html" 
                    id="input-field"
                    code={`<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text..."
/>`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Select Dropdown</p>
                  <CodeBlock 
                    language="html" 
                    id="select-dropdown"
                    code={`<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* State Management Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('state')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">State Management</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'state' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'state' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                The application uses React hooks for state management, with a focus on component-level state
                and prop drilling for sharing state between components.
              </p>
              
              <h3 className="font-medium mb-2">User Mode Management</h3>
              <p className="text-gray-600 mb-2">
                The application manages user access levels (free, standard, premium, admin) using state:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="user-mode"
                code={`// In App.tsx
type UserMode = 'free' | 'standard' | 'premium' | 'admin';

export default function App() {
  const [mode, setMode] = useState<UserMode>('free');
  
  const cycleMode = () => {
    setMode(current => {
      switch (current) {
        case 'free':
          return 'standard';
        case 'standard':
          return 'premium';
        case 'premium':
          return 'admin';
        case 'admin':
          return 'free';
      }
    });
  };
  
  // Pass mode to components that need it
  return (
    <div>
      {/* Mode toggle button */}
      <button onClick={cycleMode}>
        {getModeIcon()}
        <span>{getModeText()}</span>
      </button>
      
      {/* Conditional rendering based on mode */}
      {renderPage()}
    </div>
  );
  
  function renderPage() {
    switch (currentPath) {
      case '/premium':
        return <Premium isPremium={mode === 'premium' || mode === 'admin'} />;
      case '/p2p-trading':
        return <P2PTrading isPremium={mode === 'premium' || mode === 'admin'} />;
      // Other pages...
    }
  }
}`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Feature Access Control</h3>
              <p className="text-gray-600 mb-2">
                Premium features are conditionally rendered based on user mode:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="feature-access"
                code={`// In a component file
interface ComponentProps {
  isPremium: boolean;
}

export function FeatureComponent({ isPremium }: ComponentProps) {
  if (!isPremium) {
    return (
      <div className="relative">
        {/* Blurred content */}
        <div className="absolute inset-0 backdrop-blur-[8px] bg-gray-900/30">
          {/* Premium content preview */}
        </div>
        
        {/* Premium upgrade overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 text-center shadow-xl">
            <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Unlock Premium Features</h2>
            <p className="text-gray-600 mb-6">
              Get access to exclusive premium features.
            </p>
            <a
              href="/subscription"
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Render premium content
  return (
    <div>
      {/* Premium feature content */}
    </div>
  );
}`}
              />
            </div>
          )}
        </div>

        {/* Feature Implementation Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold">Feature Implementation</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'features' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'features' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                Key features of the application and how they are implemented:
              </p>
              
              <h3 className="font-medium mb-2">Authentication Flow</h3>
              <p className="text-gray-600 mb-2">
                The application uses a simple authentication flow with state management:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="auth-flow"
                code={`// In App.tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);

// If not logged in, show login page
if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}

// Otherwise show main application
return (
  <div className="flex flex-col md:flex-row min-h-screen">
    <Sidebar 
      currentPath={currentPath} 
      onNavigate={setCurrentPath} 
      isPremium={mode === 'premium' || mode === 'admin'} 
      isAdmin={mode === 'admin'}
      onLogout={handleLogout}
    />
    <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
      {/* Main content */}
    </main>
  </div>
);

// Logout handler
const handleLogout = () => {
  setIsLoggedIn(false);
  setCurrentPath('/dashboard');
};`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Webhook Management</h3>
              <p className="text-gray-600 mb-2">
                The application allows users to create and manage webhooks:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="webhook-management"
                code={`// In Webhooks.tsx
const [webhooks, setWebhooks] = useState<Webhook[]>([]);
const [showNewForm, setShowNewForm] = useState(false);
const [webhookName, setWebhookName] = useState('');
const [apiId, setApiId] = useState('');
const [apiSecret, setApiSecret] = useState('');

const generateWebhook = () => {
  if (webhooks.length >= getWebhookLimit()) {
    return;
  }

  if (webhookName && apiId && apiSecret) {
    const randomId = Math.random().toString(36).substring(2, 15);
    const url = \`https://api.webhooks.example.com/v1/\${randomId}\`;
    const newWebhook: Webhook = {
      id: randomId,
      name: webhookName,
      url,
      isActive: true,
      direction,
      apiKeyId: null,
      customApiKey: apiId,
      customApiSecret: apiSecret,
      tradeAmount: '100',
      tradeUnit: 'USDT'
    };
    setWebhooks([...webhooks, newWebhook]);
    setWebhookName('');
    setApiId('');
    setApiSecret('');
    setShowNewForm(false);
  }
};

const deleteWebhook = (id: string) => {
  setWebhooks(webhooks.filter(webhook => webhook.id !== id));
};

const copyToClipboard = async (url: string) => {
  await navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Data Visualization</h3>
              <p className="text-gray-600 mb-2">
                The application uses Chart.js for data visualization:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="data-visualization"
                code={`// In a component file
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Generate chart data
const generatePerformanceData = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  return {
    labels,
    datasets: [
      {
        label: 'Performance',
        data: [10, 15, 8, 12, 20, 18, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
};

// Render chart
const renderChart = () => {
  const chartData = generatePerformanceData();
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return \`Value: \${context.parsed.y}\`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };
  
  return (
    <div className="h-60">
      <Line data={chartData} options={options} />
    </div>
  );
};`}
              />
            </div>
          )}
        </div>

        {/* API Integration Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <button
            onClick={() => toggleSection('api')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Server className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">API Integration</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'api' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'api' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                The application integrates with external APIs for various features:
              </p>
              
              <h3 className="font-medium mb-2">AI Service Integration</h3>
              <p className="text-gray-600 mb-2">
                The application integrates with an AI service for the AI Assistant feature:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="ai-service"
                code={`// In aiService.ts
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await axios.post<GenerateResponse>(currentConfig.apiUrl, {
      model: currentConfig.model,
      prompt: \`\${currentConfig.systemPrompt}\\n\\nPrompt: \${prompt}\`,
      stream: false
    });

    // Update model metadata with last used timestamp
    updateModelMetadata(currentConfig.model, {
      performance: {
        lastUsed: new Date().toISOString()
      }
    });

    return response.data.response;
  } catch (error) {
    addErrorLog(error);
    throw error;
  }
}`}
              />
              
              <h3 className="font-medium mt-6 mb-2">Mock Data Pattern</h3>
              <p className="text-gray-600 mb-2">
                The application uses mock data for demonstration purposes:
              </p>
              
              <CodeBlock 
                language="tsx" 
                id="mock-data"
                code={`// Mock data for strategies
const [strategies, setStrategies] = useState([
  {
    id: '1',
    name: 'BTC Momentum Strategy',
    description: 'Trend following strategy using EMA crossovers and volume analysis for BTC/USDT.',
    pair: 'BTC/USDT',
    timeframe: '1h',
    type: 'Trend Following',
    riskLevel: 'Medium',
    webhookUrl: 'https://api.webhooks.example.com/v1/abc123',
    code: '',
    subscriptionFee: 50,
    tags: ['Momentum', 'EMA', 'Volume'],
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&h=400',
    author: {
      name: 'TradingMaster',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100',
      verified: true,
      totalFollowers: 1234
    },
    stats: {
      winRate: '67%',
      avgProfit: '2.1%',
      totalTrades: '342',
      monthlyReturn: '18.5%'
    },
    followers: 234,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-14T15:30:00Z'
  },
  // More mock data...
]);`}
              />
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('resources')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Globe className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold">Resources & References</h2>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              expandedSection === 'resources' ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {expandedSection === 'resources' && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                Here are some resources and references for the technologies used in this application:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Core Technologies</h3>
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="https://react.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        React Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.typescriptlang.org/docs/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        TypeScript Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://tailwindcss.com/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        Tailwind CSS Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://vitejs.dev/guide/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        Vite Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">UI Components & Libraries</h3>
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="https://lucide.dev/icons/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        Lucide Icons
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.chartjs.org/docs/latest/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        Chart.js Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://react-chartjs-2.js.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        React ChartJS 2
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://date-fns.org/docs/Getting-Started" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        date-fns Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Design Inspiration</h3>
                <p className="text-blue-700">
                  The design of this application is inspired by modern trading platforms and financial dashboards,
                  with a focus on clean, professional aesthetics and intuitive user experience. The color scheme
                  uses blue as the primary color, with yellow accents for premium features, and a consistent
                  system of cards, modals, and form elements.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}