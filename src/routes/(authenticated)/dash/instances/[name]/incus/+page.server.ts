import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { instanceResponse } from "$lib/server/incus.types";
import { error } from '@sveltejs/kit';
import { hash } from '$lib/server/utils';
import { virtualMachine } from '$lib/server/k8s/crd.api';

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
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${name}?recursion=3&project=${project}`, {
        dispatcher: new Agent({
            connect: {
                cert: fs.readFileSync(env.CERT),
                key: fs.readFileSync(env.KEY),
                rejectUnauthorized: false,
            }
        }),
    });

    if (!res.ok) {
        error(res.status, res.statusText);
    }

    const data = await res.json() as instanceResponse;
    return {
        project: project,
        operations_url: env.WS_URL,
        operation_ks_url: env.K8S_URL,
        instance: data.metadata,
        backend: env.BACKEND
    };
}