import { env } from "$env/dynamic/private";
import { createHash } from "crypto";

export function hash(value: string): string {
    if (env.PUBLIC_BACKEND == "k8s") {
        // TODO: Implement algorithm to calculate kubernetes namespace/project
        // by user email addrress
        return "tenant-root";
    }
    return createHash('sha256').update(value).digest('hex');
}

export function countInstances(usedBy: string[]): number {
    const instances = usedBy.filter(instance => instance.includes('/1.0/instances/'))
    return instances.length;
}

export function isAdmin(email: string): boolean {
    const adminEmails = env.ADMINS.split(",")
    return adminEmails.includes(email)
}