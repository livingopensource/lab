import { isAdmin } from "$lib/server/utils";
import { error, redirect } from "@sveltejs/kit";

export async function load({locals}) {
    const session = await locals.auth()
    if (!session) {
      throw redirect(303, '/signin')
    }
    if (!session.user?.email) error(417, "Unable to process user details");

    return {
      isAdmin: isAdmin(session.user?.email)
    }
  }