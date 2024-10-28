import { XCircle } from 'lucide-react';
import React, { useState } from 'react';

export const InfoBanner = ({ onDismiss }) => {
    const [isVisible, setIsVisible] = useState(() => {
      return true || localStorage.getItem('infoBannerDismissed') !== 'true';
    });
  
    const handleDismiss = () => {
      localStorage.setItem('infoBannerDismissed', 'true');
      setIsVisible(false);
      if (onDismiss) onDismiss();
    };
  
    if (!isVisible) return null;
  
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
          <p className="text-blue-700 text-sm">
            This project is open source and prioritizes your privacy.
            Your API key is only transmitted directly to OpenAI and is stored locally in your browser.
            All prompt history and settings are kept in your browser's localStorage.
            You can check the code out on&nbsp;
            <a
              href="https://github.com/beydogan/gpt-compare-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:text-blue-800 underline"
            >GitHub</a>.
          </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };