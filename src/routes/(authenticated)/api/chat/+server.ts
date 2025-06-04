import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const ollamaRes = await fetch(`${env.OLLAMA_URL}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'los-trainer',
			stream: true,
			messages: await request.json()
		})
	});

	return new Response(ollamaRes.body, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
};
