import { z } from "zod";

export const formSchema = z.object({
 name: z.string()
 .min(2, {message: "Event name must contain at least two characters"})
 .max(50),
 email: z.string().email({message: "Invalid email address"}),
});

export type FormSchema = typeof formSchema;