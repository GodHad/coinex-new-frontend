import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface ApiSecurityWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApiSecurityWarning({ isOpen, onClose, onConfirm }: ApiSecurityWarningProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2">API Security Confirmation</h3>
            <p className="text-gray-600 mb-4">
              Please confirm that you understand the following security implications:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                Your API keys will be stored securely and used only for automated trading
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                Enable only the necessary permissions for trading (no withdrawal access)
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                You can revoke these API keys at any time from your exchange
              </li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Always use a dedicated sub-account with limited permissions for API trading. Never share your API keys with anyone, and never enable withdrawal permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
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
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}