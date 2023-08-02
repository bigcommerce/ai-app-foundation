import { type NewProduct, type Product } from 'types';
import { STYLE_OPTIONS } from '~/constants';
import { type PromptAttributes } from '~/context/PromptAttributesContext';
interface KeyToLabelMap {
  [key: string]: string;
}

const KEY_TO_LABEL_MAP: KeyToLabelMap = {
  style: 'Style',
  includeProductAttributes: 'Include product attributes',
  wordCount: 'Words',
  optimizedForSeo: 'Optimized for SEO',
  brandVoice: 'Brand voice',
  additionalAttributes: 'Attributes',
  customPrompt: 'Instructions',
  keywords: 'Keywords',
  instructions: 'Instructions',
}

export const serializePromptAttributes = (promptAttributes: PromptAttributes): string => {
  let result = '';

  for (const [key, value] of Object.entries(promptAttributes)) {
    if (value && KEY_TO_LABEL_MAP.hasOwnProperty(key)) {
      if (result) {
        result += '; ';
      }

      let part = KEY_TO_LABEL_MAP[key];

      if (part && typeof value !== 'boolean') {
        if (key === 'style') {
          part += `: ${STYLE_OPTIONS.find((option) => option.value === value)?.content || value as string}`;
        } else {
          part += `: ${value as string}`;
        }
      }

      result += part;
    }
  }

  result += ';';

  return result;
}

export const prepareAiPromptAttributes = (promptAttributes: PromptAttributes, product: Product | NewProduct) => {
  const { includeProductAttributes, ...restAttributes } = promptAttributes;

  return {
    ...restAttributes, product: includeProductAttributes ? product : null
  };
}
