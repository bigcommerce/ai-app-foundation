import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { useProductInfo } from 'lib/hooks';
import { type PromptAttributes, type Result, DescriptionGenerator, type TemplatePromptAttributes } from '~/components/DescriptionGenerator';
import { useLocalStorage } from '~/hooks';
import { serializePromptAttributes } from '~/utils/utils';
import Loader from '~/components/Loader';
import { type Product } from 'types';

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

const prepareAiPromptAttributes = (promptAttributes: PromptAttributes, product: Product | undefined) => {
  const { includeProductAttributes, ...restAttributes } = promptAttributes;
  const productAttributes = includeProductAttributes && product ? product : null;

  return { ...restAttributes, productAttributes };
}

export default function Page() {
  const router = useRouter();
  const { productId } = router.query;

  if (!productId) return null;

  return <ProductDescriptionWithAi productId={Number(productId)} />;
}

const ProductDescriptionWithAi = ({ productId }: { productId: number }) => {
  const { isLoading: isProductLoading, product } = useProductInfo(productId);

  const { isLoading: isPrompting, mutateAsync: generateDescription } = api.generativeAi.useMutation(
    { onSuccess: description => addResult(promptAttributes, description) }
  );

  const storageKey = `${STORAGE_KEY}:${productId}`;

  const [initialiLoading, setInitialLoading] = useState(false);
  const [promptAttributes, setPromptAttributes] = useState<PromptAttributes>(DEFAULT_PROMPT_ATTRIBUTES);
  const [results, setResults] = useLocalStorage<Result[]>(storageKey, []);

  useEffect(() => {
    setInitialLoading(true);
    void generateDescription(
      prepareAiPromptAttributes(DEFAULT_PROMPT_ATTRIBUTES, product)
    ).finally(() => setInitialLoading(false));
  }, [generateDescription, product]);

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
    await generateDescription(prepareAiPromptAttributes(promptAttributes, product));
  }

  const saveProductDescription = () => {
    console.log('Saving the product with a new description', results.at(-1)?.description);
  }

  return (
    <>
      {initialiLoading && <Loader />}
      {!initialiLoading &&
        <DescriptionGenerator
          isLoading={isProductLoading || isPrompting}
          results={results}
          setPromptAttributes={setPromptAttributes}
          onDescriptionChange={handleDescriptionChange}
          generateDescription={handleDescriptionGeneration}
        />}
    </>
  );
}
