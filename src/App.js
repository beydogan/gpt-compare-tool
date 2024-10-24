import React, { useState, useEffect } from 'react';
import { SaveIcon, TrashIcon, Send, XCircle } from 'lucide-react';

// Simple Alert Component
const Alert = ({ message, onClose }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex justify-between items-center">
    <div className="flex items-center">
      <XCircle className="h-5 w-5 text-red-500 mr-2" />
      <span className="text-red-700">{message}</span>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        <XCircle className="h-4 w-4" />
      </button>
    )}
  </div>
);

const ModelComparer = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('prompt_history')) || [];
      return savedHistory.sort((a, b) => b.id - a.id); 
    } catch {
      return [];
    }
  });

  const availableModels = [
    { id: 'gpt-4o', name: 'GPT 4o', selected: false},
    { id: 'gpt-4o-2024-05-13', name: 'GPT 4o 2024-05-13', selected: false},
    { id: 'chatgpt-4o-latest', name: 'chatgpt-4o-latest', selected: false},
    { id: 'gpt-4o-mini', name: 'GPT 4o mini', selected: false},
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', selected: false },
    { id: 'gpt-4', name: 'GPT-4', selected: false },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', selected: true },
    { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', selected: false },
  ];

  const [selectedModels, setSelectedModels] = useState(() => {
    try {
      const savedSelections = JSON.parse(localStorage.getItem('selected_models')) || {};
      
      return availableModels.map(model => ({
        ...model,
        selected: savedSelections[model.id] ?? model.selected
      }));
    } catch {
      return availableModels;
    }
  });

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const toggleModel = (modelId) => {
    setSelectedModels(prevModels => {
      const newModels = prevModels.map(model =>
        model.id === modelId ? { ...model, selected: !model.selected } : model
      );
      
      const selections = Object.fromEntries(
        newModels.map(model => [model.id, model.selected])
      );
      localStorage.setItem('selected_models', JSON.stringify(selections));
      
      return newModels;
    });
  };

  const comparePrompt = async () => {
    if (!apiKey || !prompt) {
      setError('Please provide an API key and prompt');
      return;
    }
    if (!selectedModels.some(m => m.selected)) {
      setError('Please select at least one model to compare');
      return;
    }
    
    setLoading(true);
    setError('');
    const newResults = [];

    try {
      const selectedModelIds = selectedModels.filter(m => m.selected);
      for (const model of selectedModelIds) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model.id,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.error) {
            newResults.push({
              model: model.name,
              response: `Error: ${data.error.message || 'Unknown error occurred'}`,
              timestamp: new Date().toISOString(),
              isError: true,
            });
          } else {
            newResults.push({
              model: model.name,
              response: data.choices[0]?.message?.content || 'No response content',
              timestamp: new Date().toISOString(),
              isError: false,
            });
          }
        } catch (error) {
          setError(error.message || 'An unexpected error occurred');

          newResults.push({
            model: model.name,
            response: `Error: ${error.message || 'Failed to fetch response'}`,
            timestamp: new Date().toISOString(),
            isError: true,
          });
        }
      }

      let item = { 
        prompt, 
        results: newResults, 
        timestamp: new Date().toISOString(),
        id: Date.now()
      }

      setResults(newResults);
      setSelectedHistoryItem(item); 
      setHistory(prev => [item, ...prev]);
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('prompt_history');
    setSelectedHistoryItem(null);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* History Sidebar */}
      <div className="w-80 bg-white shadow-md p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">History</h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded cursor-pointer hover:bg-gray-50 ${
                selectedHistoryItem?.id === item.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedHistoryItem(item)}
            >
              <p className="font-medium text-sm">{truncateText(item.prompt)}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <Alert 
              message={error} 
              onClose={() => setError('')} 
            />
          )}

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl font-bold mb-4">OpenAI Model Comparer</h1>
            
            {/* API Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="sk-..."
              />
            </div>

            {/* Model Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Models to Compare</label>
              <div className="space-y-2">
                {selectedModels.map((model) => (
                  <label key={model.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={model.selected}
                      onChange={() => toggleModel(model.id)}
                      className="rounded"
                    />
                    <span>{model.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border rounded h-32"
                placeholder="Enter your prompt here..."
              />
            </div>

            <button
              onClick={comparePrompt}
              disabled={loading || !selectedModels.some(m => m.selected)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Comparing...' : 'Compare Models'}
            </button>
          </div>

          {/* Selected History Item or Current Results */}
          {(selectedHistoryItem || results.length > 0) && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Results
              </h2>
              {(selectedHistoryItem?.results || results).map((result, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-lg mb-2">{result.model}</h3>
                  <div className={`p-4 rounded whitespace-pre-wrap ${
                    result.isError ? 'bg-red-50 text-red-700' : 'bg-gray-50'
                  }`}>
                    {result.response}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelComparer;