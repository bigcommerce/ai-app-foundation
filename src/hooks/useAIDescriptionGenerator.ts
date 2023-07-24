import { type Result } from '~/components/AiResults/AiResults';
import { useLocalStorage } from './useLocalStorage';
import { api } from '~/utils/api';
import { serializePromptAttributes } from '~/utils/utils';
import { type PromptAttributes } from '~/context/PromptAttributesContext';

const MAX_LOCAL_STORAGE_RESULTS = 20;
const STORAGE_KEY = 'ai-product-descriptions:history:product';

export const useAIDescriptions = (productId: number) => {
    const [results, setResults] = useLocalStorage<Result[]>(`${STORAGE_KEY}:${productId}`, []);

    const setResultsWrapper = ({ description, promptAttributes }: { description: string, promptAttributes: PromptAttributes }) => {
        const result = { description, promptAttributes: serializePromptAttributes(promptAttributes) };
        setResults([...results.slice(-(MAX_LOCAL_STORAGE_RESULTS - 1)), ...[result]])
    };

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

    const { isLoading: isPrompting, mutateAsync: generateDescription } = api.generativeAi.useMutation();

    return {
        isPrompting,
        results,
        generateDescription,
        handleDescriptionChange,
        setResults: setResultsWrapper
    };
}
