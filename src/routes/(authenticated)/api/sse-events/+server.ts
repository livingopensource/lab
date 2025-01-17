import * as k8s from '@kubernetes/client-node';
import type { RequestHandler } from './$types';
import { produce } from 'sveltekit-sse';
import { json } from '@sveltejs/kit';
import { hash } from '$lib/server/utils';

export const POST: RequestHandler = async ({ locals }) => {
	const kc = new k8s.KubeConfig();
	kc.loadFromDefault();
	const session = await locals.auth();
	if (session == null) {
		return json(403, {});
	}
	return produce(async function start({ emit }) {
		const watch = new k8s.Watch(kc);
		const project = hash(session?.user?.email ?? '') ?? 'none';
		await watch.watch(
			`/api/v1/namespaces/${project}/events`,
			{
				allowWatchBookmarks: true
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(type, apiObj, watchObj) => {
				//console.log(apiObj)
				const { error } = emit('message', apiObj.reason);
					if (error) {
						console.log(error.message);
					}
					return
			},
			(err) => {
				const { error } = emit('message', `Got an error ${err}`);
				if (error) {
					console.log(`Event watch error: ${error.message}`);
				}
			}
		);
	});
};
