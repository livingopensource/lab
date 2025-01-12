export type VirtualMachine = {
    kind: string,
    apiVersion: string,
    metadata: {
        name: string,
        namespace: string,
        uid: string,
        resourceVersion: string,
        labels: {
            "kubevirt.io/nodeName": string,
            "kubevirt.io/size": string,
            "kubevirt.io/template": string,
            "kubevirt.io/template.version": string,
            "kubevirt.io/vm": string,
            "kubevirt.io/os": string
        }
    },
    spec: {
        runStrategy: string,
        running: boolean,
        template: {
            metadata: {
                labels: {
                    "kubevirt.io/nodeName": string,
                    "kubevirt.io/size": string,
                    "kubevirt.io/template": string,
                    "kubevirt.io/template.version": string,
                    "kubevirt.io/vm": string,
                }
            },
            spec: {
                domain: {
                    machine: {
                        type: string
                    }
                }
            }
        }
    },
    status: {
        printableStatus: string,
        ready: boolean,
        conditions: {
            type: string,
            status: string,
            lastProbeTime: string,
            lastTransitionTime: string
        }[]
    }
}