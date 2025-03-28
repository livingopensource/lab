import { redirect } from "@sveltejs/kit"
import { signIn } from "../../../auth"
import type { Actions } from "./$types"

export async function load(event) {
    const session = await event.locals.auth()
    if (session?.user) {
        redirect(303, "/dash")
    }
}

export const actions: Actions = { default: signIn }
