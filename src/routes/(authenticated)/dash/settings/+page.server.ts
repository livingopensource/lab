import { isAdmin } from "$lib/server/utils"
import { error, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { env } from "$env/dynamic/private";
import { Agent, fetch } from "undici";
import * as fs from 'node:fs';
import type { projectsInterface } from "$lib/server/incus.types";

export async function load({locals}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }
  if (!session.user?.email) error(417, "Unable to process user details");
  const userData = {
      name: session.user.name!,
      email: session.user.email
  }
  const res = await fetch(`${env.CLUSTER_URL}/1.0/projects`, {
      dispatcher: new Agent({
          connect: {
              cert: fs.readFileSync(env.CERT),
              key: fs.readFileSync(env.KEY),
              rejectUnauthorized: false,
          }
      }),
  });
  
  if (!res.ok) {
      throw new Error(res.statusText);
  }

  const projects = res.json() as unknown as projectsInterface

  return {
      projects:  projects,
      isAdmin: isAdmin(session.user?.email),
      form: await superValidate(userData, zod(formSchema))
  }
}