import { json } from '@sveltejs/kit';
import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { operationResponse } from '$lib/server/incus.types';

export const DELETE = async ({params}) => {
    const project = "default"
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${params.name}?project=${project}`, {
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
            status: 400
        })
    }

    const data = await res.json() as operationResponse
    if (data.status_code == 100) {
        return new Response(String(data))
    }

    return json({"error": `unable to delete instance`}, {
        status: 400
    })
}

export const PUT = async ({url, params}) => {
    const name = url.searchParams.get("name")
    const project = "default"
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${params.name}?project=${project}`, {
        method: 'POST',
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
            name: name
        })
    })

    if (!res.ok) {
        return json({"error": res.statusText}, {
            status: 400
        })
    }

    const data = await res.json() as operationResponse
    if (data.status_code == 100) {
        console.log(data)
        return new Response(String(data))
    }

    return json({"error": `unable to rename instance`}, {
        status: 400
    })
}