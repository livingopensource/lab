import { json } from '@sveltejs/kit';
import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { imagesResponse } from '$lib/server/incus.types';

export const GET = async () => {
    const project = "default"
    const res = await fetch(`${env.CLUSTER_URL}/1.0/images?project=${project}&recursion=1`, {
        method: 'GET',
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

    const data = await res.json() as imagesResponse
    if (data.status_code == 200) {
        return json(data)
    }

    return json({"error": `unable to fetch images`}, {
        status: 400
    })
}