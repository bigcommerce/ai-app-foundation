import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { useProductInfo } from 'lib/hooks';
import { type PromptAttributes, type Result, DescriptionGenerator, type TemplatePromptAttributes } from '~/components/DescriptionGenerator';
import { useLocalStorage } from '~/hooks';
import { serializePromptAttributes } from '~/utils/utils';
import Loader from '~/components/Loader';

const MAX_LOCAL_STORAGE_RESULTS = 20;
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

const ProductAppExtensionContent = () => {
  const router = useRouter();
  const productId = Number(router.query?.productId);
  const { isLoading } = useProductInfo(productId);

  const { isLoading: isPrompting, mutateAsync: generateDescription } = api.generativeAi.useMutation(
    { onSuccess: description => addResult(promptAttributes, description) }
  );

  const storageKey = `${STORAGE_KEY}:${productId}`;

  const [initialiLoading, setInitialLoading] = useState(false);
  const [promptAttributes, setPromptAttributes] = useState<PromptAttributes>(DEFAULT_PROMPT_ATTRIBUTES);
  const [results, setResults] = useLocalStorage<Result[]>(storageKey, []);

  useEffect(() => {
    setInitialLoading(true);
    void generateDescription(DEFAULT_PROMPT_ATTRIBUTES).finally(() => setInitialLoading(false));
  }, [generateDescription]);

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

    const result: Result = {
      promptAttributes: serializePromptAttributes(promptAttributes),
      description,
    };

    setResults([...results.slice(-(MAX_LOCAL_STORAGE_RESULTS - 1)), ...[result]])
  }

  const handleDescriptionGeneration = async () => {
    await generateDescription(promptAttributes);
  }

  const saveProductDescription = () => {
    console.log('Saving the product with a new description', results.at(-1)?.description);
  }

  return (
    <>
      {initialiLoading && <Loader />}
      {!initialiLoading &&
        <DescriptionGenerator
          isLoading={isLoading || isPrompting}
          results={results}
          setPromptAttributes={setPromptAttributes}
          onDescriptionChange={handleDescriptionChange}
          generateDescription={handleDescriptionGeneration}
        />}
    </>
  );
}

export default dynamic(() => Promise.resolve(ProductAppExtensionContent), {
  ssr: false
});
