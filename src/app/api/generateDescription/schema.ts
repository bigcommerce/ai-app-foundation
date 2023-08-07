import { z } from 'zod';

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand: z.string(),
  type: z.string(),
  condition: z.string(),
  weight: z.number(),
  height: z.number(),
  width: z.number(),
  depth: z.number(),
  categoriesNames: z.string(),
  videosDescriptions: z.string(),
  imagesDescriptions: z.string(),
  custom_fields: z.object({ name: z.string(), value: z.string() }).array(),
});

const newProductSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const aiSchema = z.union([
  z.object({
    style: z.string(),
    wordCount: z.number(),
    optimizedForSeo: z.boolean(),
    brandVoice: z.string(),
    additionalAttributes: z.string(),
    keywords: z.string(),
    instructions: z.string(),
    product: z.union([productSchema, newProductSchema]).nullable(),
  }),
  z.object({
    customPrompt: z.string(),
    product: z.union([productSchema, newProductSchema]).nullable(),
  }),
  z.object({
    product: z.union([productSchema, newProductSchema]).nullable(),
  }),
]);
