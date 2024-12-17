import { createHash } from "crypto";

export function hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
}

export function countInstances(usedBy: string[]): number {
    const instances = usedBy.filter(instance => instance.includes('/1.0/instances/'))
    return instances.length;
}