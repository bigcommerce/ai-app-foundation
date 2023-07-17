import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import generateDescription from "../google-ai";

const ProductAttributesSchema = z.object({
  name: z.string(),
  price: z.number(),
  type: z.string(),
  description: z.string(),
  isVisible: z.boolean(),
});

export const AiSchema = z.union([
  z.object({
    style: z.string(),
    wordCount: z.number(),
    optimizedForSeo: z.boolean(),
    brandVoice: z.string(),
    additionalAttributes: z.string(),
    keywords: z.string(),
    instructions: z.string(),
    productAttributes: ProductAttributesSchema.nullable()
  }),
  z.object({
    customPrompt: z.string(),
    productAttributes: ProductAttributesSchema.nullable()
  })
]);

export const appRouter = createTRPCRouter({
  generativeAi: publicProcedure // todo: add authProcedure
    .input(AiSchema)
    .mutation(({ input }) => generateDescription(input)),
});

export type AppRouter = typeof appRouter;
