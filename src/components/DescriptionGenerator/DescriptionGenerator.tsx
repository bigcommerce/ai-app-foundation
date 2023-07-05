import { Flex, FlexItem } from "@bigcommerce/big-design";
import Loader from "../Loader";
import AiResults from "./AiResults";
import { PromptForm } from "./PromptForm";
import { type PromptAttributes, type Result } from './types';
import { useEffect } from "react";
import styled from 'styled-components';

interface DescriptionGeneratorProps {
    isLoading: boolean;
    results: Result[];
    setPromptAttributes(attributes: PromptAttributes): void;
    onDescriptionChange(index: number, description: string): void;
    generateDescription(): void;
}

const StyledWrapper = styled(Flex)`
  height: 100vh;
`

const StyledHr = styled(Flex)`
  margin-left: -${({ theme }) => theme.spacing.xxxLarge};
  margin-right: -${({ theme }) => theme.spacing.xxxLarge};
`

export function DescriptionGenerator({ isLoading, results, setPromptAttributes, onDescriptionChange, generateDescription }: DescriptionGeneratorProps) {
    useEffect(() => {
        void generateDescription();
    }, []);

    return (
        <StyledWrapper flexDirection="column">
            <FlexItem>
                <PromptForm generateDescription={generateDescription} onChange={(prompt) => setPromptAttributes(prompt)} />
            </FlexItem>
            <StyledHr borderTop="box" marginTop="xLarge" />
            <FlexItem flexGrow={1}>
                {isLoading && <Loader />}
                {!isLoading &&
                    <AiResults onChange={onDescriptionChange} results={results} />
                }
            </FlexItem>
        </StyledWrapper>
    );
}
