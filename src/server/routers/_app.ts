import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import generateDescription from "../vertex-ai";

export const AiSchema = z.union([
  z.object({
    style: z.string(),
    wordCount: z.number(),
    optimizedForSeo: z.boolean(),
    brandVoice: z.string(),
    additionalAttributes: z.string(),
    keywords: z.string(),
    instructions: z.string(),
    includeProductAttributes: z.boolean(),
  }),
  z.object({
    includeProductAttributes: z.boolean(),
    customPrompt: z.string(),
  })
]);

export const appRouter = createTRPCRouter({
  generativeAi: publicProcedure // todo: add authProcedure
    .input(AiSchema)
    .mutation(({ input }) => generateDescription(input)),
});

export type AppRouter = typeof appRouter;
