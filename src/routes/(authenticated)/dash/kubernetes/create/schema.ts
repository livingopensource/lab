import { z } from "zod";
 
export const formSchema = z.object({
 name: z.string().regex(new RegExp("^[a-zA-Z0-9-_]+$"), {message: "only aphanumeric, underscores and hyphens are valid characters"}).min(2, {message: "Instance name must contain at least two characters"}).max(50),
});
 
export type FormSchema = typeof formSchema;