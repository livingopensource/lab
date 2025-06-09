import { isAdmin } from "$lib/server/utils"
import { error, redirect } from "@sveltejs/kit"
import pool from "$lib/server/database/pg/init";

export async function load({locals}) {
  const session = await locals.auth()
  if (!session) {
    throw redirect(303, '/signin')
  }
  if (!session.user?.email) error(417, "Unable to process user details");

  if (!isAdmin(session.user?.email)) throw error(403, "You are not authorized to view this page")

  const result = await pool.query(`SELECT id, title, contents FROM tutorials ORDER BY id DESC`);
  return {
    tutorials: result.rows
  }

}