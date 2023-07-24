import { type z } from "zod";
import { env } from "~/env.mjs";
import { GoogleAuth } from "google-auth-library";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { STYLE_OPTIONS } from "~/components/PromptForm/StructuredPromptForm";
import { type aiSchema } from "../routers/_app";

const MODEL_NAME = 'models/text-bison-001';
const API_KEY = env.GOOGLE_API_KEY;

export default async function generateDescription(attributes: z.infer<typeof aiSchema>): Promise<string> {
    const prompt = preparePrompt(attributes);

    try {
        const client = new TextServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });

        const response = await client
            .generateText({
                model: MODEL_NAME,
                prompt: { text: prompt },
            });

        if (response && response[0] && response[0].candidates) {
            return response[0].candidates[0]?.output || 'No response from Google AI';
        }
    } catch (error) {
        console.error(error);
    }

    return 'No response from Google AI';
}


const preparePrompt = (attributes: z.infer<typeof aiSchema>): string => {
    let input = '';
    let productAttributes = '';

    if ('customPrompt' in attributes) {
        input = `Instruction: ${attributes.customPrompt}
        `;
    } else {
        const style = STYLE_OPTIONS.find((option) => option.value === attributes.style)?.content || '';

        input = `
Style of writing: ["${style}"]
Brand tone: ["${attributes.brandVoice}"]
Word limit: [${attributes.wordCount}]
SEO optimized: ["${attributes.optimizedForSeo ? 'yes' : 'no'}"]
Additional product attributes: ["${attributes.additionalAttributes}"]
Additional keywords: ["${attributes.keywords}"]
Additional instructions: ["${attributes.instructions}"]
        `;
    }

    if (attributes.product && 'type' in attributes.product) {
        productAttributes = `Product attributes: {
    "name": ${attributes.product.name}
    "brand": ${attributes.product.brand}
    "type": ${attributes.product.type}
    "condition": ${attributes.product.condition}
    "weight": ${attributes.product.weight}
    "height": ${attributes.product.height}
    "width": ${attributes.product.width}
    "depth": ${attributes.product.depth}
    "categories": ${attributes.product.categoriesNames}
    "videos descriptions": ${attributes.product.videosDescriptions}
    "imnages descritpions": ${attributes.product.imagesDescriptions}
    "custom_fields": ${attributes.product.custom_fields.map((field) => `"${field.name}": "${field.value}"`).join(',')}
}
        `;
    } else {
        productAttributes = `Product attributes: {
    "name": ${attributes.product?.name || ''}
}
        `;
    }

    return `Act as an e-commerce merchandising expert who writes product descriptions.
Task: Based on provided input parameters, write a product description
${input}
${productAttributes}
`;
}
