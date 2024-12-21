import { env } from "$env/dynamic/private"
import { hash } from "$lib/server/utils.js"
import { json } from "@sveltejs/kit"

export const GET = async ({locals}) => {
    const session = await locals.auth()
    if (session == null) {
        return json(403, {})
    }
    const resp = await fetch(`${env.K8S_URL}/1.0/virtual-machines?project=${hash(session.user?.email ?? "")}`)
    if (!resp.ok) {
        return json(400, {})
    }
    return await resp.json()
}