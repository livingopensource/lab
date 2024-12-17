import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import { json } from '@sveltejs/kit';
import type { operationResponse } from '$lib/server/incus.types';
import { hash } from '$lib/server/utils';

export const POST = async ({locals, params}) => {
    const session = await locals.auth()
    if (!session) {
        return json(403, {})
    }
    const project = hash(session?.user?.email ?? "") ?? "none";
    const res = await fetch(`${env.CLUSTER_URL}/1.0/instances/${params.name}/exec?project=${project}&wait=10`, {
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
            command: ["bash"],
            "environment": {
                "TERM": "xterm-256color"
            },
            interactive: true,
            "wait-for-websocket": true,
            width: 80,
            height: 20
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