import { type PromptAttributes } from '~/components/DescriptionGenerator/types';

export interface BasePromptFormProps {
    onChange(promptAttributes: PromptAttributes): void;
}

export interface PromptFormProps extends BasePromptFormProps {
    generateDescription(): Promise<void>;
}
