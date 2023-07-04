import { type PromptAttributes } from '~/components/DescriptionGenerator';

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
            part += `: ${value as string}`;
          }
    
          result += part;
        }
      }

    return result;
}

