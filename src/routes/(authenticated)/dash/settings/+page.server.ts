import { isAdmin } from "$lib/server/utils"
import { error, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { env } from "$env/dynamic/private";
import { Agent, fetch } from "undici";
import * as fs from 'node:fs';

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
  const res = fetch(`${env.CLUSTER_URL}/1.0/projects`, {
      dispatcher: new Agent({
          connect: {
              cert: fs.readFileSync(env.CERT),
              key: fs.readFileSync(env.KEY),
              rejectUnauthorized: false,
          }
      }),
  });
  

  return {
      projects:  res.then(res => {
          if (!res.ok) throw new Error('Failed to fetch instances');
          return res.json();
      }),
      isAdmin: isAdmin(session.user?.email),
      form: await superValidate(userData, zod(formSchema))
  }
}