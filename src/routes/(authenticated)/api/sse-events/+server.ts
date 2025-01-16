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
			`/api/v1/namespaces/${project}/pods`,
			{
				allowWatchBookmarks: true
			},
			(type, apiObj, watchObj) => {
				if (type === 'ADDED') {
					console.log('new object');
					const { error } = emit('message', 'new object');
					if (error) {
						console.log(error);
						return;
					}
				} else if (type === 'BOOKMARK') {
					console.log(
						`Bookmark ${watchObj.metadata.resourceVersion}`
					);
					const { error } = emit(
						'message',
						`Bookmark ${watchObj.metadata.resourceVersion}`
					);
					if (error) {
						console.log(error);
						return;
					}
				} else if (type === 'MODIFIED') {
					const { error } = emit('message', 'modified object');
					if (error) {
						console.log(error);
						return;
					}
				} else if (type === 'DELETED') {
					const { error } = emit('message', 'deleted object');
					if (error) {
						console.log(error);
						return;
					}
				} else {
					const { error } = emit(
						'message',
						`Unknown response ${type}}`
					);
					if (error) {
						console.log(error);
						return;
					}
				}
				console.log(`Generic ${apiObj}`);
				const { error } = emit(
					'message',
					`Unknown generic response ${apiObj}}`
				);
				if (error) {
					console.log(error);
					return;
				}
			},
			(err) => {
				console.log(`Oops! ${err}`);
				const { error } = emit('message', `Got an error ${err}`);
				if (error) {
					console.log(error);
					return;
				}
			}
		);
	});
};
