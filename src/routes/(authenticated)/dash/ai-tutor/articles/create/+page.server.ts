import { isAdmin } from "$lib/server/utils"
import { error, redirect } from "@sveltejs/kit"
import { fail, superValidate } from "sveltekit-superforms";
import { formSchema } from "../[id]/schema";
import pool from "$lib/server/database/pg/init";
import { zod } from "sveltekit-superforms/adapters";

export async function load({locals}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }
  if (!session.user?.email) error(417, "Unable to process user details");

  if (!isAdmin(session.user?.email)) throw error(403, "You are not authorized to view this page")

  return {
    form: await superValidate(zod(formSchema))
  }
}

export const actions = {
	default: async (event) => {
        const session = await event.locals.auth()
        if (!session) {
          throw redirect(303, '/signin')
        }
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
          return fail(400, {
            form,
          });
        }

        const result = await pool.query(`INSERT INTO tutorials (title, contents) VALUES ($1, $2)`, [form.data.title, form.data.contents]);
        if (result.rowCount === 0) {
          return fail(400, {
            form,
          });
        }
        return {
          form,
        };
      }
    }