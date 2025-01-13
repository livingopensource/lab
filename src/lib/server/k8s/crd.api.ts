import { k8sCrdApi } from '.';
import * as k8s from '@kubernetes/client-node'
const kc = new k8s.KubeConfig()
kc.loadFromDefault()

import { PromiseMiddlewareWrapper } from '@kubernetes/client-node/dist/gen/middleware';

export async function virtualMachines(project: string) {
	const virtualMachines = await k8sCrdApi.listNamespacedCustomObject({
		group: 'kubevirt.io',
		version: 'v1',
		namespace: project,
		plural: 'virtualmachines'
	});
	return virtualMachines.items;
}

export async function virtualMachine(name: string, project: string) {
	const virtualMachine = await k8sCrdApi.getNamespacedCustomObject({
		group: 'kubevirt.io',
		version: 'v1',
		namespace: project,
		plural: 'virtualmachines',
		name: name
	});
	return virtualMachine;
}

export async function virtualMachinePowerToggle(name: string, project: string, strategy: string) {
	try {
		const patch = [{
			op: "replace",
			path: "/spec/runStrategy",
			value: strategy
		}]
		const headerPatchMiddleware = new PromiseMiddlewareWrapper({
			pre: async(requestContext) => {
				requestContext.setHeaderParam("Content-type", "application/json-patch+json");
				return requestContext;
			},
			post: async (responseContext) => responseContext,
		});
	
		const currentContext = kc.getCurrentContext()
		const currentCluster = kc.getCluster(currentContext)
		if (currentCluster === undefined || currentCluster === null) {
			throw new Error("cluster is undefined")
		}
		const server = currentCluster.server;
		if (server === undefined) {
			throw new Error("server is undefined")
		}
		
		const baseServerConfig = new k8s.ServerConfiguration(server, {})
		const configuration = k8s.createConfiguration({
			middleware: [headerPatchMiddleware],
			baseServer: baseServerConfig,
			authMethods: {
				default: kc
			}
		})

		const virtualMachine = await k8sCrdApi.patchNamespacedCustomObject({
			group: 'kubevirt.io',
			version: 'v1',
			namespace: project,
			plural: 'virtualmachines',
			name: name,
			body: patch
		}, configuration);
		return virtualMachine;
	} catch (err: unknown) {
		if (err instanceof Error) {
			return err.message;
		}
		return 'An unknown error occurred';
	}
}

export async function deleteVirtualMachine(name: string, project: string) {
	try {
		const virtualMachine = await k8sCrdApi.deleteNamespacedCustomObject({
			group: 'kubevirt.io',
			version: 'v1',
			namespace: project,
			plural: 'virtualmachines',
			name: name
		});
		return virtualMachine;
	} catch (err: unknown) {
		if (err instanceof Error) {
			return err.message;
		}
		return 'An unknown error occurred';
	}
}