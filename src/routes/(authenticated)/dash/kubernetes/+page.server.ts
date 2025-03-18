import type { instancesResponse } from "$lib/server/incus.types";
import { hash } from "$lib/server/utils";

export async function load({parent}) {
    const { session } = await parent()
    const project = hash(session.user?.email ?? "")  ?? "none"

    const data = {} as instancesResponse;
    return {
        project: project,
        instances: data
    };
}