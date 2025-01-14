import { json } from '@sveltejs/kit';
import { hash } from '$lib/server/utils.js';
import { virtualMachinePowerToggle } from '$lib/server/k8s/crd.api.js';

export const PUT = async ({locals, url, params}) => {
    const session = await locals.auth()
    if (session == null) {
        return json(403, {})
    }
    const project = hash(session?.user?.email ?? "") ?? "none";
    const state = url.searchParams.get("state")
    if (state != null) {

        if (state == "start") {
            const vm = await virtualMachinePowerToggle(params.name, project, "Always")
            if (vm.kind != "VirtualMachine") {
                return json({"error": `unable to ${state} instance`}, {
                    status: 400
                })
            }
            return new Response(String(vm))
        } else if (state == "stop") {
            const vm = await virtualMachinePowerToggle(params.name, project, "Halted")
            if (vm.kind != "VirtualMachine") {
                return json({"error": `unable to ${state} instance`}, {
                    status: 400
                })
            }
            return new Response(String(vm))
        }

        return json({"error": `unable to ${state} instance`}, {
            status: 400
        })
    }

    return json({"error": "unknown operation"}, {
        status: 400
    })
}