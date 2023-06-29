import { Flex, FlexItem } from "@bigcommerce/big-design";
import Loader from "../Loader";
import AiResults from "./AiResults";
import PromptForm from "./PromptForm";
import { useState } from "react";

export interface Result {
    description: string;
    promptAttributes: string;
}

export interface PromptAttributes {
    style: string;
    wordCount: number;
    optimizedForSeo: boolean;
    includeProductAttributes: boolean;
    brandVoice: string;
    additionalAttributes: string;
}

interface DescriptionGeneratorProps {
    isLoading: boolean;
    results: Result[];
    generateDescription: (promptAttributes: PromptAttributes) => void;
    handleResultChange: (index: number, result: Result) => void;
}

export default function DescriptionGenerator({ isLoading, results, handleResultChange }: DescriptionGeneratorProps) {
    const [formAttributes, setFormAttributes] = useState<PromptAttributes>({
        style: 'Concise',
        wordCount: 150,
        optimizedForSeo: true,
        includeProductAttributes: true,
        brandVoice: 'Upbeat, conversational, and confident',
        additionalAttributes: 'Organic, recycled cotton',
    });

    const promptAttributesString = JSON.stringify(results.at(-1)?.promptAttributes || {});

    return (
        <Flex flexDirection="row" margin="large">
            <FlexItem flexShrink={0}>
                <PromptForm onChange={(prompt) => setFormAttributes(prompt)} />
            </FlexItem>
            {isLoading && <Loader />}
            {!isLoading &&
                <FlexItem flexGrow={1}>
                    <AiResults onChange={handleResultChange} results={results} promptAttributes={promptAttributesString} />
                </FlexItem>
            }
        </Flex>
    );
}
