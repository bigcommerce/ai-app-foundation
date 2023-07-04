import { serializePromptAttributes } from '~/utils/utils';
import React, { useState } from 'react';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { type TemplatePromptAttributes, type PromptAttributes, type Result, DescriptionGenerator } from '~/components/DescriptionGenerator';
import dynamic from "next/dynamic";
import { generateDescription } from '../api/generate-description';

const STORAGE_KEY = 'ai-product-descriptions:history:product';
const DEFAULT_PROMPT_ATTRIBUTES: TemplatePromptAttributes = {
  style: 'story',
  wordCount: 250,
  includeProductAttributes: true,
  optimizedForSeo: true,
  brandVoice: '',
  additionalAttributes: '',
  keywords: '',
  instructions: '',
};

function ProductAppExtensionContent({ productId = 1 }) {
  const storageKey = `${STORAGE_KEY}:${productId}`;

  const [promptAttributes, setPromptAttributes] = useState<PromptAttributes>(DEFAULT_PROMPT_ATTRIBUTES);
  const [results, setResults] = useLocalStorage<Result[]>(storageKey, []);
  const [isLoading, setIsLoading] = useState(false);

  const handleDescriptionChange = (index: number, description: string) => {
    setResults((prevResults: Result[]) => {
      if (index < 0 || index >= prevResults.length) {
        return prevResults;
      }

      const updatedResults = [...prevResults];

      updatedResults[index] = {
        promptAttributes: updatedResults[index]?.promptAttributes || '',
        description: description,
      };

      return updatedResults;
    });
  };

  const addResult = (promptAttributes: PromptAttributes, description: string) => {
    const MAX_LOCAL_STORAGE_RESULTS = 20;
    const result: Result = {
      promptAttributes: serializePromptAttributes(promptAttributes),
      description,
    };

    setResults([...results.slice(-(MAX_LOCAL_STORAGE_RESULTS - 1)), ...[result]])
  }

  const handleDescriptionGeneration = async () => {
    setIsLoading(true);
    const description = await generateDescription(promptAttributes);
    addResult(promptAttributes, description || '');
    setIsLoading(false);
  };

  const saveProductDescription = () => {
    console.log('Saving the product with a new description', results.at(-1)?.description);
  }

  return (
    <DescriptionGenerator
      isLoading={isLoading}
      results={results}
      setPromptAttributes={setPromptAttributes}
      onDescriptionChange={handleDescriptionChange}
      generateDescription={handleDescriptionGeneration}
    />
  );
}

export default dynamic(() => Promise.resolve(ProductAppExtensionContent), {
  ssr: false
})
