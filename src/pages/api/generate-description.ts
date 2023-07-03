import { type PromptAttributes } from '~/components/DescriptionGenerator/types';

export async function generateDescription(promptAttributes: PromptAttributes) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Generating description with the following attributes', promptAttributes);

    return (Math.random() + 1).toString(36).substring(7);
}
