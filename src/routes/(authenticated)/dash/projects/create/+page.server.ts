import { redirect} from "@sveltejs/kit"
import { fail, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { formSchema } from "./schema.js"
import type { Actions } from "./$types"
import { hash } from "$lib/server/utils.js"

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
        if (!session) redirect(302, "/login");
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
          return fail(400, {
            form,
          });
        }

        const project = hash(form.data.project);

        // TODO: Create project with specified resources
    }
} satisfies Actions