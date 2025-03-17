import { z } from "zod";

export const formSchema = z.object({
 instanceCount: z.number()
 .min(1)
 .max(5),
});

export type FormSchema = typeof formSchema;