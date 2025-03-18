import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import { formSchema } from "./schema";

let canCreate = false;
let message = "You do not have have an active subscription, please contact info@livingopensource.org";

export const load: PageServerLoad = async ({locals}) => {
    const session = await locals.auth()
    if (!session) {
      throw redirect(303, '/signin')
    }
    canCreate = false;
    message = "You do not have have an active subscription, please contact info@livingopensource.org";
    return {
        canCreate,
        form: await superValidate(zod(formSchema)),
        message
    };
}