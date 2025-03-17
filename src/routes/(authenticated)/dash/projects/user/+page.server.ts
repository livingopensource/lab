import { isAdmin } from "$lib/server/utils"
import { redirect } from "@sveltejs/kit"
import { error } from "console"
import { hash } from "$lib/server/utils.js"
import { env } from "$env/dynamic/private"
import { Agent, fetch } from "undici"
import * as fs from 'node:fs';
import type { projectsInterface } from "$lib/server/incus.types"
import { superValidate } from "sveltekit-superforms"
import { formSchema } from "./schema"
import { zod } from "sveltekit-superforms/adapters"

export async function load({locals, request}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }

  if (!session.user?.email) throw error(404, "No email found")

  if (session.user.email && !isAdmin(session.user.email)) throw error(404, "Page not found")

  const url = new URL(request.url)
  const email = url.searchParams.get("email")

  if (!email) throw redirect(303, '/dash/projects')

  const project = hash(email)

  const res = await fetch(`${env.CLUSTER_URL}/1.0/projects/${project}`, {
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
        projectDetails: null,
        email,
        form: await superValidate(zod(formSchema)),
    }
  }
  
  const projectDetails = res.json() as unknown as projectsInterface
  
  return {
      projectDetails,
      email,
      form: await superValidate(zod(formSchema)),
  }

}