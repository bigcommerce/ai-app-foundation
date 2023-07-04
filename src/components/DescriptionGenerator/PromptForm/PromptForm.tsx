import { Flex, FormGroup, Select } from "@bigcommerce/big-design";
import { useState } from "react";
import { TemplatePromptForm } from './TemplatePromptForm';
import { type PromptFormProps } from './types';
import { CustomPromptForm } from './CustomPromptForm';

type PromptOptions = 'template' | 'custom';

export const PROMPT_OPTIONS = [
    { value: 'template', content: 'Use template' },
    { value: 'custom', content: 'Custom' },
];

export function PromptForm({ onChange }: PromptFormProps) {
    const [prompt, setPrompt] = useState<PromptOptions>('template');

    const handlePromptChange = (prompt: PromptOptions) => setPrompt(prompt);

    return (
        <Flex flexDirection="column" alignItems="flex-start">
            <FormGroup>
                <Select
                    label="Prompt"
                    maxHeight={300}
                    onOptionChange={handlePromptChange}
                    options={PROMPT_OPTIONS}
                    placement="bottom-start"
                    required
                    value={prompt}
                />
            </FormGroup>
            {prompt === 'template' && <TemplatePromptForm onChange={onChange} />}
            {prompt === 'custom' && <CustomPromptForm onChange={onChange} />}
        </Flex>
    );
}
