import { toast } from "svelte-sonner"
import { json } from "@sveltejs/kit"
import type { operationResponse } from "$lib/server/incus.types"

export async function powerOn(instance: string, project: string = "") {
    let res;
    if (project != "") {
        res = await fetch(`/api/${instance}/state?state=start&project=${project}`, {
            method: "put"
        })
    } else {
        res = await fetch(`/api/${instance}/state?state=start`, {
            method: "put"
        })
    }
    
    if (!res.ok) {
       toast.error("Instance power on error", {
           description: "Unable to power on instance, contact support if issue persists"
       })
       return
    }
    toast.success("instance powered on", {
           description: "The instance is powering on"
    })
}

export async function powerOff(instance: string,  project: string = "") {
    let res;
    if (project != "") {
        res = await fetch(`/api/${instance}/state?state=stop&project=${project}`, {
            method: "put"
        })
    } else {
        res = await fetch(`/api/${instance}/state?state=stop`, {
            method: "put"
        })
    }

    if (!res.ok) {
       toast.error(`Instance power off error`, {
           description: "Unable to power off instance, contact support if issue persists"
       })
       return
    }
    toast.success("Instance powered off", {
       description: "The instance is powering off"
    })
}

export async function execConnection(instance: string) {
    const resp = await fetch(`/api/${instance}/exec?project=default`, {
        method: "post"
    })

    if (!resp.ok) {
        return json(400, {})
    }
    const data = await resp.json() as operationResponse
    return json(data)
}

export async function consoleConnection(instance: string) {
    const resp = await fetch(`/api/${instance}/console?project=default`, {
        method: "post"
    })

    if (!resp.ok) {
        return json(400, {})
    }
    const data = await resp.json() as operationResponse
    return json(data)
}

export async function renameInstance(oldName: string, newName: string) {
    const res = await fetch(`/api/${oldName}?project=default&name=${newName}`, {
        method: "put"
    })
    if (!res.ok) {
        toast.error("Unable to rename instance", {
            description: "Unable to rename instance, contact support if issue persists"
        })
        return
    }
    const data = await res.json() as operationResponse
    if (data.status_code == 100) {
        console.log(data)
        toast.success("Instance renamed", {
            description: "INstance renamed successfully"
        })
        return
    }
    toast.error("Unable to rename instance", {
        description: "Unable to rename instance, please try again"
    })
}

export async function webSocketOperaation(fqdn: string, operation: operationResponse) {
    const ws = new WebSocket(`${fqdn}/1.0/operations/${operation.metadata.id}/websocket?secret=${operation.metadata.metadata.fds.control}project=default`)
    const res = await new Promise((resolve, reject) => {
        ws.onopen = (ev) => {
            console.log(ev)
            resolve(ws)
        }
        ws.onerror = (err) => {
            console.log(err)
            reject(err)
        }
    })
    return res
}