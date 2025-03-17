import type { Actions, PageServerLoad } from './$types';
import {fetch, Agent} from 'undici';
import { env } from '$env/dynamic/private';
import * as fs from 'node:fs';
import type { operationResponse, projectsResponse } from '$lib/server/incus.types';
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from '@sveltejs/kit';
import { countInstances, hash } from '$lib/server/utils';

let canCreate = false;
let message = "You do not have have an active subscription, please contact info@livingopensource.org";

export const load: PageServerLoad = async ({locals}) => {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }
  try {
    const project = await fetch(`${env.CLUSTER_URL}/1.0/projects/${hash(session.user?.email ?? "")}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      dispatcher: new Agent({
        connect: {
          cert: fs.readFileSync(env.CERT),
          key: fs.readFileSync(env.KEY),
          rejectUnauthorized: false,
        },
      }),
    }).then((res) => res.json()) as projectsResponse
    const instanceCount = Number(project.metadata.config["limits.instances"]);
    const instanceCountUsed = countInstances(project.metadata.used_by);
    if (instanceCountUsed >= instanceCount) {
      canCreate = false;
      message = "You have reached your instance limit, you cannot create any more instances";
    } else {
    canCreate = true;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('An unknown error occurred');
    }
    canCreate = false;
  }
  return {
    canCreate: canCreate,
    form: await superValidate(zod(formSchema)),
    message: message,
  };
};
export const actions = {
	default: async (event) => {
        const session = await event.locals.auth()
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
          return fail(400, {
            form,
          });
        }
        const project = hash(session?.user?.email ?? "") ?? "none";
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
            body: form.data.instanceType == "container" ? JSON.stringify({
                name: form.data.instanceName,
                "config": {
                  "limits.cpu": "1",
                  "limits.memory": "1GiB",
                },
                "devices": {
                  "root": {
                    "path": "/",
                    "pool": "default",
                    "size": "10GiB",
                    "type": "disk"
                  }
                },
                "source": {
                    "alias": form.data.image,
                    "project": "default",
                    "type": "image"
                },
                type: form.data.instanceType
            }) : JSON.stringify({
              name: form.data.instanceName,
              "config": {
                "limits.cpu": "1",
                "limits.memory": "1GiB",
              },
              "devices": {
                "root": {
                  "path": "/",
                  "pool": "default",
                  "size": "10GiB",
                  "type": "disk"
                },
              },
              "source": {
                  "alias": form.data.image,
                  "project": "default",
                  "type": "image"
              },
              type: form.data.instanceType
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
            return {
              form,
            };
        }
        return fail(400, {
          form,
        });
	}} satisfies Actions;