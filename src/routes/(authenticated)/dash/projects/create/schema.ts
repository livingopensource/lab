import { z } from "zod";
 
export const formSchema = z.object({
 project: z.string().email().min(3),
 instanceCount: z.number().min(1, { message: "Instance count is required" }),
 kubernetesNodeCount: z.number().min(1, { message: "Kubernetes nodes count is required" }),
});
 
export type FormSchema = typeof formSchema;