import { type z } from 'zod';
import { env } from '~/env.mjs';
import { DEFAULT_GUIDED_ATTRIBUTES, STYLE_OPTIONS } from '~/constants';
import { type aiSchema } from '~/app/api/generateDescription/schema';
import { VertexAI } from '@google-cloud/vertexai';
import { type JWTInput } from 'google-auth-library';

const MODEL_NAME = 'gemini-1.5-pro-002';

export default async function generateDescription(
  attributes: z.infer<typeof aiSchema>
): Promise<string> {
  const input = prepareInput(attributes);
  const productAttributes = prepareProductAttributes(attributes);

  const prompt = `Act as an e-commerce merchandising expert who writes product descriptions.
    Task: Based on provided input parameters, write a product description styled in HTML.
    Response format: HTML.
    Input: ${input}.
    Product attributes: ${productAttributes}.`;

  try {
    const vertexAI = new VertexAI({
      project: env.FIRE_PROJECT_ID,
      location: 'us-central1',
      googleAuthOptions: { credentials: getGoogleAuthCredentials() },
    });

    const model = vertexAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts[0] &&
      response.candidates[0].content.parts[0].text
    ) {
      return formatResponse(response.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error(error);
  }

  return 'No response from Google AI';
}

const prepareInput = (attributes: z.infer<typeof aiSchema>): string => {
  if ('customPrompt' in attributes) {
    return `Instruction: ${attributes.customPrompt}`;
  } else if ('style' in attributes) {
    const style =
      STYLE_OPTIONS.find((option) => option.value === attributes.style)
        ?.content || '';

    return `Style of writing: ["${style}"]
        Brand tone: ["${attributes.brandVoice}"]
        Word limit: [${attributes.wordCount}]
        SEO optimized: ["${attributes.optimizedForSeo ? 'yes' : 'no'}"]
        Additional keywords(insert a set of keywords separately and naturally into the description, rather than as a single phrase, ensuring they are used appropriately within the text.): ["${
          attributes.keywords
        }"]
        Additional instructions: ["${attributes.instructions}"]`;
  } else {
    return `Style of writing: ["${DEFAULT_GUIDED_ATTRIBUTES.style}"]
        Word limit: [${DEFAULT_GUIDED_ATTRIBUTES.wordCount}]
        SEO optimized: ["${
          DEFAULT_GUIDED_ATTRIBUTES.optimizedForSeo ? 'yes' : 'no'
        }"]`;
  }
};

const formatResponse = (response: string): string => {
  // Strips the markdown code block from the response
  const match = /```html\n([\s\S]*)\n```/.exec(response);

  if (match && match[1]) {
    return match[1];
  }

  return response;
};

const prepareProductAttributes = (
  attributes: z.infer<typeof aiSchema>
): string => {
  if (attributes.product && 'type' in attributes.product) {
    return `Product attributes:
        "name": ${attributes.product.name}
        "brand": ${attributes.product.brand}
        "type": ${attributes.product.type}
        "condition": ${attributes.product.condition}
        "weight": ${attributes.product.weight}
        "height": ${attributes.product.height}
        "width": ${attributes.product.width}
        "depth": ${attributes.product.depth}
        "categories": ${attributes.product.categoriesNames}
        "video descriptions": ${attributes.product.videosDescriptions}
        "image descriptions": ${attributes.product.imagesDescriptions}
        "custom fields": ${attributes.product.custom_fields
          .map((field) => `"${field.name}": "${field.value}"`)
          .join(',')} `;
  } else {
    return `Product attributes:
        "name": ${attributes.product?.name || ''} `;
  }
};

const getGoogleAuthCredentials = (): JWTInput => {
  const credentialsBuffer = Buffer.from(
    env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64,
    'base64'
  );

  return JSON.parse(credentialsBuffer.toString('utf-8')) as JWTInput;
};
