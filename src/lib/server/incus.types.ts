type NetworkInterfaces = {
    [key: string]: {
        addresses: [
            {family: string, address: string, netmask: string, scope: string}
        ],
        counters: {
            bytes_received: number,
            bytes_sent: number,
        }
    };
};

type DiskInterface = {
    [key: string]: {
        usage: number,
        total: number
    };
};

export interface instanceResponse {
    type: string,
    status: string,
    status_code: number,
    operation: string,
    error_code: number,
    error: string,
    metadata: {
        name: string,
        status: string,
        architecture: string,
        description: string,
        created_at: string,
        last_used_at: string,
        type: string,
        config: {
            "image.architecture": string,
            "image.description": string,
            "image.os": string,
            "image.release": string,
        },
        state: {
            cpu: {
                usage: number,
            },
            memory: {
                total: number,
                usage: number,
                swap_usage: number,
            },
            disk: DiskInterface,
            status: string,
            started_at: string,
            network: NetworkInterfaces | null
        },
    }
}

export interface instancesResponse {
    type: string,
    status: string,
    status_code: number,
    operation: string,
    error_code: number,
    error: string,
    metadata: {
        name: string,
        status: string,
        architecture: string,
        description: string,
        created_at: string,
        last_used_at: string,
        type: string,
        config: {
            "image.architecture": string,
            "image.description": string,
            "image.os": string,
            "image.release": string,
        },
        state: {
            cpu: {
                usage: number,
            },
            memory: {
                total: number,
                usage: number,
                swap_usage: number,
            },
            disk: DiskInterface,
            status: string,
            started_at: string,
            network: NetworkInterfaces
        },
    }[]
}

export interface operationResponse {
    type: string,
    status: string,
    status_code: number,
    operation: string,
    error_code: number,
    location: string,
    error: string,
    may_cancel: boolean,
    err: string
    metadata: {
        id: string,
        class: string,
        created_at: string,
        updated_at: string,
        status: string,
        status_code: number,
        description: string,
        resources: {
            instances: string[]
        },
        metadata: {
            "image.architecture": string,
            "image.description": string,
            "image.os": string,
            "image.release": string,
            command: string[],
            environment: {
                HOME: string,
                LANG: string,
                PATH: string,
                TERM: string,
                USER: string
            },
            fds: {
                0: string,
                1: string,
                control: string,
            },
            interactive: boolean
        }
    }
}

export interface imagesResponse {
    type: string,
    status: string,
    status_code: number,
    metadata: [
        {
            aliases: [
                {
                    description: string,
                    name: string
                }
            ],
            architecture: string,
            auto_update: boolean,
            cached: boolean,
            created_at: string,
            expires_at: string,
            filename: string,
            fingerprint: string,
            last_used_at: string,
            profile: string[],
            properties: {
                os: string,
                release: string,
                variant: string,
                type: string,
                serial: string
            },
            public: boolean,
            size: number,
            type: string
            uploaded_at: string,
            update_source: {
                alias: string,
                certificate: string,
                image_type:  string,
                protocol: string,
                server: string,
            }
        }
    ]
}

export interface eventsResponse {
    location: string,
    project: string,
    timestamp: string,
    type: string,
    metadata: {
        action: string,
        source: string
    },
    error: string,
    error_code: number
}

type projectInterface = {
    description: string,
    name: string,
    used_by: string[],
    config: {
        "features.images": string,
        "limits.instances": string
    }
}

export interface projectsInterface {
    metadata: string[]
    status: string
    status_code: number
}

export interface projectsResponse {
    type: string,
    status: string,
    status_code: number,
    error: string,
    error_code: string,
    operation:string,
    metadata: projectInterface
}