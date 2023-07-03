import { type PromptAttributes } from '~/components/DescriptionGenerator/types';

export interface PromptFormProps {
    onChange(promptAttributes: PromptAttributes): void;
}