import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { instancesResponse, operationResponse } from '$lib/server/incus.types';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { hash } from '$lib/server/utils';

export async function load({parent}) {
    const { session } = await parent()
    const project = hash(session.user?.email ?? "")  ?? "none"
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances?project=${project}&recursion=2`, {
        dispatcher: new Agent({
            connect: {
                cert: fs.readFileSync(env.CERT),
                key: fs.readFileSync(env.KEY),
                rejectUnauthorized: false,
            }
        }),
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    const data = await res.json() as instancesResponse;
    return {
        project: project,
        instances: data.metadata
    };
}

export const actions = {
    start: async ({ request, locals }) => {
        const session = await locals.auth()
        const formData = await request.formData();
        const instance = formData.get('instance');
        const project = hash(session?.user?.email ?? "") ?? "none";
        const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${instance}/state?project=${project}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            dispatcher: new Agent({
                connect: {
                    cert: fs.readFileSync(env.CERT),
                    key: fs.readFileSync(env.KEY),
                    rejectUnauthorized: false,
                }
            }),
            body: JSON.stringify({
                action: 'start',
                timeout: 10,
                force: false,
                stateful: false,
            })
        })

        if (!res.ok) {
            console.log(res.statusText)
            return fail(400, {
                name: instance,
                action: "poweron",
                desciption: "unable to establish connection",
                success: false
            })
        }

        const data = await res.json() as operationResponse;
        if (data.status_code == 100) {
            return {
                name: instance,
                action: "poweron",
                description: data.metadata.description,
                success: true,
            }; 
        }
        return {
            name: instance,
            action: "poweron",
            description: data.metadata.description,
            success: false,
        };
    },
    stop: async ({ request, locals }) => {
        const session = await locals.auth()
        const formData = await request.formData();
        const instance = formData.get('instance');
        const project = hash(session?.user?.email ?? "") ?? "none";
        const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${instance}/state?project=${project}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            dispatcher: new Agent({
                connect: {
                    cert: fs.readFileSync(env.CERT),
                    key: fs.readFileSync(env.KEY),
                    rejectUnauthorized: false,
                }
            }),
            body: JSON.stringify({
                action: 'stop',
                timeout: 10,
                force: false,
                stateful: false,
            })
        })

        if (!res.ok) {
            return fail(400, {
                name: instance,
                action: "poweroff",
                desciption: "unable to establish connection",
                success: false
            })
        }
        const data = await res.json() as operationResponse;
        if (data.status_code == 100) {
            return {
                name: instance,
                action: "poweroff",
                description: data.metadata.description,
                success: true,
            }; 
        }
        return {
            name: instance,
            action: "poweroff",
            description: data.metadata.description,
            success: false,
        };
    },
    delete: async ({ request, locals }) => {
        const session = await locals.auth()
        const formData = await request.formData();
        const instance = formData.get('instance');
        const project = hash(session?.user?.email ?? "") ?? "none";
        const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${instance}?project=${project}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            dispatcher: new Agent({
                connect: {
                    cert: fs.readFileSync(env.CERT),
                    key: fs.readFileSync(env.KEY),
                    rejectUnauthorized: false,
                }
            })
        })

        if (!res.ok) {
            return fail(400, {
                name: instance,
                action: "poweroff",
                desciption: "unable to establish connection",
                success: false
            })
        }
        const data = await res.json() as operationResponse;
        console.log(data)
        if (data.status_code == 100) {
            return {
                name: instance,
                action: "poweroff",
                description: data.metadata.description,
                success: true,
            }; 
        }
        return {
            name: instance,
            action: "poweroff",
            description: data.metadata.description,
            success: false,
        };  
    }
} satisfies Actions;