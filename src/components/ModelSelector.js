import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';
import { calculatePrice, countTokens, formatPrice } from '../utils';

const ModelSelector = ({ models, prompt, onToggleModel }) => {
    const [calculating, setCalculating] = useState(false);
    const [prices, setPrices] = useState({});
  
    const calculateTokensAndPrices = useCallback(
      debounce(async (newPrompt) => {
        if (!newPrompt) {
          setPrices({});
          setCalculating(false);
          return;
        }
  
        try {
          const count = await countTokens(newPrompt, 'gpt-4');
          
          const newPrices = {};
          models.forEach(model => {
            const price = calculatePrice(count, "prompt_token", model.id);
            newPrices[model.id] = price;
          });
          setPrices(newPrices);
        } catch (error) {
          console.error('Error calculating tokens:', error);
          setPrices({});
        }
        setCalculating(false);
      }, 500),
      []
    );
  
    useEffect(() => {
      return () => {
        calculateTokensAndPrices.cancel();
      };
    }, [calculateTokensAndPrices]);
  
    useEffect(() => {
      setCalculating(true);
      calculateTokensAndPrices(prompt);
    }, [prompt, calculateTokensAndPrices]);
  
    return (
      <div className="space-y-2">
        {models.map((model) => (
          <label key={model.id} className="flex items-center space-x-2 group">
            <input
              type="checkbox"
              checked={model.selected}
              onChange={() => onToggleModel(model.id)}
              className="rounded"
            />
            <span className="flex-1">{model.name}</span>
            <span className="text-sm text-gray-500 flex items-center gap-2 min-w-[140px] justify-end">
              {calculating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                  <span className="text-blue-600">
                    ({formatPrice(prices[model.id])})
                  </span>
              )}
            </span>
          </label>
        ))}
      </div>
    );
  };
  
  export default ModelSelector;