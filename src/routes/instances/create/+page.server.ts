import type { Actions, PageServerLoad } from './$types';
import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { operationResponse } from '$lib/server/incus.types';
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
	default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
          return fail(400, {
            form,
          });
        }
        const project = "default"
        const res = await fetch(`${env.CLUSTER_URL}/1.0/instances?project=${project}`, {
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
                name: form.data.instanceName,
                "devices": {
                  "root": {
                    "path": "/",
                    "pool": "default",
                    "type": "disk"
                  }
                },
                "source": {
                    "alias": form.data.image,
                    "type": "image"
                }
            })
        })

        if (!res.ok) {
            return fail(400, {
              form,
              "message": res.statusText
            });
        }

        const data = await res.json() as operationResponse
        if (data.status_code == 100) {
            console.log(data)
            return {
              form,
            };
        }
        console.log(data)
        return fail(400, {
          form,
        });
	}} satisfies Actions;