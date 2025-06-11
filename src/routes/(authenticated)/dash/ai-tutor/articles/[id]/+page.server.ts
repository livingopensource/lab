import { isAdmin } from "$lib/server/utils"
import { error, redirect } from "@sveltejs/kit"
import pool from "$lib/server/database/pg/init";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export async function load({locals, params}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }
  if (!session.user?.email) error(417, "Unable to process user details");

  if (!isAdmin(session.user?.email)) throw error(403, "You are not authorized to view this page")

  const id = params.id;
  const result = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [id]);
  const formData = {
    title: result.rows[0].title,
    contents: result.rows[0].contents
  }

  return {
    tutorial: result.rows[0],
    form: await superValidate(formData, zod(formSchema)),
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

        const result = await pool.query(`UPDATE tutorials SET title = $1, contents = $2 WHERE id = $3`, [form.data.title, form.data.contents, event.params.id]);
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