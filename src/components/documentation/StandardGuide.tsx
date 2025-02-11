import { ArrowRight, Info } from "lucide-react";

const StandardGuide = () => {
    return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Standard User Guide</h1>
          </div>
    
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Getting Started with Standard Features</h2>
              <p className="text-gray-600 mb-6">
                Learn how to set up and use our standard features for automated trading using webhooks.
              </p>
    
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Required Setup</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium">Exchange Setup</p>
                        <p className="text-sm text-gray-600">Complete the exchange setup guide first</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium">API Keys</p>
                        <p className="text-sm text-gray-600">Configure your exchange API keys in the API Keys section</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium">Webhook Setup</p>
                        <p className="text-sm text-gray-600">Create and configure your webhooks in the Webhooks section</p>
                      </div>
                    </li>
                  </ul>
                </div>
    
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Standard Features</p>
                      <ul className="mt-2 space-y-2 text-sm text-blue-700">
                        <li>• Create custom webhooks for automated trading</li>
                        <li>• Connect with TradingView alerts</li>
                        <li>• Basic position management</li>
                        <li>• Trading history and logs</li>
                      </ul>
                      <a
                        href="https://www.tradingview.com/pricing/?share_your_love=ohgodwhydidiregister"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Get TradingView Pro for Webhook Alerts →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
}

export default StandardGuide;