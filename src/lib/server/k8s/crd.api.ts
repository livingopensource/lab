import { k8sCrdApi } from ".";

export async function virtualMachines(project: string) {
    const virtualMachines = await k8sCrdApi.listNamespacedCustomObject({
        group: "kubevirt.io",
        version: "v1",
        namespace: project,
        plural: "virtualmachines",
    })
    return virtualMachines.items
}

export async function virtualMachine(name: string, project: string) {
    const virtualMachine = await k8sCrdApi.getNamespacedCustomObject({
        group: "kubevirt.io",
        version: "v1",
        namespace: project,
        plural: "virtualmachines",
        name: name
    })
    return virtualMachine
}