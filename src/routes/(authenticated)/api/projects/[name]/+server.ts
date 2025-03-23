import { json } from '@sveltejs/kit';
import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { operationResponse } from '$lib/server/incus.types';

export const DELETE = async ({locals, params}) => {
    const session = await locals.auth()
    if (session == null) {
        return json(403, {})
    }

    // Prevent deletion of the default project
    if (params.name == "default") {
        return json(403, {})
    }
    
    const res = await fetch(`${env.CLUSTER_URL}/1.0/projects/${params.name}`, {
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
        }),
    })

    if (!res.ok) {
        return json({"error": res.statusText}, {
            status: res.status
        })
    }

    const data = await res.json() as operationResponse

    return new Response(String(data))
}