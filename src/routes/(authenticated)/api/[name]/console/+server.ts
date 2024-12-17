import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import { json } from '@sveltejs/kit';
import type { operationResponse } from '$lib/server/incus.types';

export const POST = async ({params}) => {
    const project = "default"
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${params.name}/console?project=${project}&wait=10`, {
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
            type: "vga",
            width: 80,
            height: 20,
        })
    })

    if (!res.ok) {
        return json({})
    }

    const data = await res.json() as operationResponse
    if (data.status_code == 100) {
        return json(data)
    }

    json(400, {})
}