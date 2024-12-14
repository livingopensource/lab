import { z } from "zod";
 
export const formSchema = z.object({
 instanceName: z.string().regex(new RegExp("^[a-zA-Z0-9-_]+$"), {message: "only aphanumeric, underscores and hyphens are valid characters"}).min(2, {message: "Instance name must contain at least two characters"}).max(50),
 image: z.string().min(2, { message: "Image is required, please select OS of your choice" })
});
 
export type FormSchema = typeof formSchema;