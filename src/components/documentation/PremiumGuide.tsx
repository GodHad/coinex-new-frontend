import { ArrowRight, Crown, Info } from "lucide-react";

const PremiumGuide = () => {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Premium User Guide</h1>
                <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <span className="text-sm text-gray-600">Premium Feature</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Getting Started with Premium Features</h2>
                    <p className="text-gray-600 mb-6">
                        As a premium user, you have access to advanced trading features. Here&apos;s what you need to get started:
                    </p>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Required Setup</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                                    <div>
                                        <p className="font-medium">Exchange API Keys</p>
                                        <p className="text-sm text-gray-600">Configure your exchange API keys in the API Keys section</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                                    <div>
                                        <p className="font-medium">Available Trading Balance</p>
                                        <p className="text-sm text-gray-600">Ensure you have sufficient funds in your trading account</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <p className="text-sm text-yellow-700">
                                    Premium signals are automatically executed once you&apos;ve configured your API keys and have sufficient funds.
                                    No additional setup is required!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PremiumGuide;