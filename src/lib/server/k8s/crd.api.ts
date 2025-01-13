import { k8sCrdApi } from '.';

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
		const virtualMachine = await k8sCrdApi.patchNamespacedCustomObject({
			group: 'kubevirt.io',
			version: 'v1',
			namespace: project,
			plural: 'virtualmachines',
			name: name,
			body: {
				spec: {
					runStrategy: strategy
				}
			}
		});
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