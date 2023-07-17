import { Button, Flex, FlexItem } from "@bigcommerce/big-design";
import Loader from "../Loader";
import AiResults from "./AiResults";
import { PromptForm } from "./PromptForm";
import { type PromptAttributes, type Result } from './types';
import styled from 'styled-components';

interface DescriptionGeneratorProps {
    isLoading: boolean;
    results: Result[];
    setPromptAttributes(attributes: PromptAttributes): void;
    onDescriptionChange(index: number, description: string): void;
    generateDescription(): Promise<void>;
}

const StyledWrapper = styled(Flex)`
  height: 100vh;
`

const StyledHr = styled(Flex)`
  margin-left: -${({ theme }) => theme.spacing.xxxLarge};
  margin-right: -${({ theme }) => theme.spacing.xxxLarge};
`

export const DescriptionGenerator = ({ isLoading, results, setPromptAttributes, onDescriptionChange, generateDescription }: DescriptionGeneratorProps) => (
    <StyledWrapper flexDirection="column">
        <FlexItem>
            <PromptForm generateDescription={generateDescription} onChange={(prompt) => setPromptAttributes(prompt)} />
        </FlexItem>
        <StyledHr borderTop="box" marginTop="xLarge" />
        <FlexItem marginTop="medium">
            {isLoading && <Loader />}
            {!isLoading && <AiResults onChange={onDescriptionChange} results={results} />}
        </FlexItem>
        {!isLoading &&
            <FlexItem marginTop="xxLarge">
                <Flex justifyContent="flex-end" flexDirection="row">
                    <Button mobileWidth="auto" variant="secondary">Cancel</Button>
                    <Button mobileWidth="auto" variant="primary">Use this result</Button>
                </Flex>
            </FlexItem>
        }
    </StyledWrapper>
);
