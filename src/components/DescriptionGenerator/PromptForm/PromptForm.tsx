import { Box, Button, Flex, FlexItem } from "@bigcommerce/big-design";
import React, { useState } from "react";
import { TemplatePromptForm } from './TemplatePromptForm';
import { type PromptFormProps } from './types';
import { CustomPromptForm } from './CustomPromptForm';
import { StyledButton } from '~/components/DescriptionGenerator/PromptForm/styled';

type PromptOptions = 'template' | 'custom';

export function PromptForm({ onChange, generateDescription }: PromptFormProps) {
    const [prompt, setPrompt] = useState<PromptOptions>('template');

    return (
        <>
            <Box display="inline-flex" marginBottom="medium">
                <StyledButton isActive={prompt === 'template'} onClick={() => setPrompt('template')}>
                    Structured prompt
                </StyledButton>
                <StyledButton isActive={prompt === 'custom'} onClick={() => setPrompt('custom')}>
                    Custom prompt
                </StyledButton>
            </Box>
            {prompt === 'template' && <TemplatePromptForm onChange={onChange} />}
            {prompt === 'custom' && <CustomPromptForm onChange={onChange} />}
            <FlexItem paddingTop="medium">
                <Button mobileWidth="auto" variant="secondary" marginTop="medium" onClick={() => void generateDescription()}>
                    Write more
                </Button>
            </FlexItem>
        </>
    );
}
