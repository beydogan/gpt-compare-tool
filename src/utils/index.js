import { pricing } from './pricing';
import { encoding_for_model } from 'tiktoken';

export const countTokens = (text, model) => {
    const encoding = encoding_for_model(model);
    const tokens = encoding.encode(text);
    encoding.free();
    return tokens.length;
  };

export const calculatePrice = (tokenCount, tokenType, modelId) => {
    const modelPricing = pricing[modelId];
    
    if (!modelPricing) return null;
    
    return tokenCount * modelPricing[tokenType];
  };

export const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toFixed(6)}`;
  };