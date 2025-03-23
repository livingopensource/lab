import { isAdmin } from "$lib/server/utils"
import { redirect } from "@sveltejs/kit"
import { error } from "console"
import { env } from "$env/dynamic/private"
import { Agent, fetch } from "undici"
import * as fs from 'node:fs';
import type { projectInterface } from "$lib/server/incus.types"

export async function load({locals, params}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }

  if (!session.user?.email) throw error(404, "No email found")

  if (session.user.email && !isAdmin(session.user.email)) throw error(404, "Page not found")

  const res = await fetch(`${env.CLUSTER_URL}/1.0/projects/${params.project}`, {
      dispatcher: new Agent({
          connect: {
              cert: fs.readFileSync(env.CERT),
              key: fs.readFileSync(env.KEY),
              rejectUnauthorized: false,
          }
      }),
  });
  
  if (!res.ok) {
    return {
        instances: null,
        projectDetails: null,
    }
  }
  
  let instanceResponse 
  try {
    instanceResponse = fetch(`${env.CLUSTER_URL}/1.0/instances?project=${params.project}&recursion=2`, {
        dispatcher: new Agent({
            connect: {
                cert: fs.readFileSync(env.CERT),
                key: fs.readFileSync(env.KEY),
                rejectUnauthorized: false,
            }
        }),
    });
  } catch (err) {
    console.log(err)
    return {
        instances: null,
        projectDetails: null,
    }
  }
  
  const projectDetails = res.json() as unknown as projectInterface
  return {
      instances: instanceResponse.then(res => {
        if (!res.ok) throw new Error('Failed to fetch instances');
        return res.json();
    }),
      projectDetails,
  }

}