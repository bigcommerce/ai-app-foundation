import { Button, Flex, FlexItem } from "@bigcommerce/big-design";
import Loader from "../Loader";
import AiResults from "./AiResults";
import { PromptForm } from "./PromptForm";
import { type PromptAttributes, type Result } from './types';
import { useEffect } from "react";

interface DescriptionGeneratorProps {
    isLoading: boolean;
    results: Result[];
    setPromptAttributes(attributes: PromptAttributes): void;
    onDescriptionChange: (index: number, description: string) => void;
    generateDescription: () => Promise<void>;
}

export function DescriptionGenerator({ isLoading, results, setPromptAttributes, onDescriptionChange, generateDescription }: DescriptionGeneratorProps) {
    useEffect(() => {
        void generateDescription();
    }, []);

    return (
        <Flex flexDirection="row" margin="large">
            <FlexItem flexShrink={0}>
                <PromptForm onChange={(prompt) => setPromptAttributes(prompt)} />
            </FlexItem>
            {isLoading && <Loader />}
            {!isLoading &&
                <FlexItem flexGrow={1}>
                    <AiResults onChange={onDescriptionChange} results={results} />
                </FlexItem>
            }
        </Flex>
    );
}
