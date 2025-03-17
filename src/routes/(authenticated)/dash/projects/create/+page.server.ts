import { redirect} from "@sveltejs/kit"
import { fail, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { formSchema } from "./schema"
import type { Actions } from "./$types"
import { hash } from "$lib/server/utils.js"
import { env } from "$env/dynamic/private"
import { Agent, fetch } from "undici"
import * as fs from 'node:fs';

export async function load({locals}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }

  return {
    form: await superValidate(zod(formSchema)),
  }
}

export const actions = {
	default: async (event) => {
        const session = await event.locals.auth()
        if (!session) redirect(302, "/signin");
        const form = await superValidate(event, zod(formSchema));
        console.log(form)
        if (!form.valid) {
          console.log(form)
          return fail(400, {
            form,
          });
        }

        const project = hash(form.data.project);
        const res = await fetch(`${env.CLUSTER_URL}/1.0/projects`, {
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
                name: project,
                description: form.data.project,
                "config": {
                  "features.images": "false",
                  "features.profiles": "false",
                  "features.storage.buckets": "true",
                  "features.storage.volumes": "false",
                  "limits.instances": form.data.instanceCount.toString()
                }
            })
        })

        if (!res.ok) {
          console.log(res.statusText)
            return fail(400, {
              form,
              "message": res.statusText
            });
        }

        const data = await res.json() as { status_code: number }
        console.log(data)
        if (data.status_code == 200) {
            return {
              form,
            };
        }

        return fail(400, {
          form,
        });
    }} satisfies Actions