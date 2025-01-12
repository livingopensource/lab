import { hash } from '$lib/server/utils';
import { virtualMachine } from '$lib/server/k8s/crd.api';
import { env } from '$env/dynamic/private';

export async function load({ params, parent }) {
    const { session } = await parent()
    const name = params.name;
    const project = hash(session.user?.email ?? "") ?? "none";
    if (env.BACKEND == "k8s") {
        const data = await virtualMachine(name, project)
        return {
            project: project,
            backend: env.BACKEND,
            operations_url: env.WS_URL,
            operation_ks_url: env.K8S_URL,
            instance: data
        };
    }
}