export interface Result {
    description: string;
    promptAttributes: string;
}

export interface TemplatePromptAttributes {
    style: string;
    wordCount: number;
    optimizedForSeo: boolean;
    brandVoice: string;
    additionalAttributes: string;
    includeProductAttributes: boolean;
}

export interface CustomPromptAttributes {
    customPrompt: string;
    includeProductAttributes: boolean;
}

export type PromptAttributes = TemplatePromptAttributes | CustomPromptAttributes;
