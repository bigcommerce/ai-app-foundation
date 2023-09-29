import { type Result } from '~/components/AiResults/AiResults';
import { useLocalStorage } from './useLocalStorage';
import { serializePromptAttributes } from '~/utils/utils';
import { type PromptAttributes } from '~/context/PromptAttributesContext';

const MAX_LOCAL_STORAGE_RESULTS = 20;
const STORAGE_KEY = 'ai-product-descriptions:history:product';

export const useDescriptionsHistory = (productId: number) => {
  const [descriptions, setDescriptions] = useLocalStorage<Result[]>(
    `${STORAGE_KEY}:${productId}`,
    []
  );

  const setDescriptionsWrapper = ({
    description,
    promptAttributes,
  }: {
    description: string;
    promptAttributes: PromptAttributes;
  }) => {
    const result = {
      description,
      promptAttributes: serializePromptAttributes(promptAttributes),
    };
    setDescriptions([
      ...descriptions.slice(-(MAX_LOCAL_STORAGE_RESULTS - 1)),
      ...[result],
    ]);
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setDescriptions((prevResults: Result[]) => {
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

  return {
    descriptions,
    addDescriptionToHistory: setDescriptionsWrapper,
    updateDescriptionInHistory: handleDescriptionChange,
  };
};
