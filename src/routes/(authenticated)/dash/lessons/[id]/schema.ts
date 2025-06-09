import { z } from "zod";
 
export const formSchema = z.object({
 title: z.string().min(3, {message: "only aphanumeric, underscores and hyphens are valid characters"}).min(2, {message: "Instance name must contain at least two characters"}).max(50),
 contents: z.string().min(10, {message: "Content must contain at least two characters"}).max(5000),
});
 
export type FormSchema = typeof formSchema;