import { type z } from "zod";
import { type AiSchema } from "../routers/_app";

export default async function generateDescription(attributes: z.infer<typeof AiSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return Object.keys(attributes).map((key) => `${key}: ${attributes[key]}`).join('\n');
}
