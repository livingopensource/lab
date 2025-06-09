import { env } from '$env/dynamic/private';
import pool from '$lib/server/database/pg/init';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ request }: { request: Request }) => {

	const confidence = Number.parseFloat(env.AI_MODEL_CONFIDENCE) || 0.5
	const payload = await request.json();
	// This is the conversation history
	const history = payload;

	// The chat is the last message in the history
	const chat =  history.pop();

	const ollamaEmbed = await fetch(`${env.OLLAMA_HOST}/api/embed`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'nomic-embed-text',
			input: chat.content
		})
	});

	if (!ollamaEmbed.ok) {
		return new Response(ollamaEmbed.statusText, {
			status: ollamaEmbed.status
		});
	}

	const ollamaEmbedJson = await ollamaEmbed.json();

	const embedding = JSON.stringify(ollamaEmbedJson.embeddings[0]);
	const res = await pool.query( `SELECT
		id,
		chunk,
		1 - (embedding <=> $1) AS similarity
	 FROM tutorials_contents_embeddings
	 WHERE 
		1 - (embedding <=> $1)  >= ${confidence}
	 ORDER BY embedding <=> $1
	 LIMIT 10`,
	[embedding] );

	console.log(res.rows);

	let chatHistory = payload;
	// If a matching entry has been found in the db, add it to the chontext to use when answering the question
	if (res.rows.length > 0) {
		chatHistory = history;
		const template = `Answer this question based only on this Context: \n ${res.rows[0].chunk} \nQuestion: ${chat.content}`;
		chatHistory.push({ role: "user", content: template });
	} else {
		chatHistory.push({ role: "user", content: chat.content});
	}

	const ollamaRes = await fetch(`${env.OLLAMA_HOST}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'los-trainer',
			stream: true,
			messages: chatHistory
		})
	});

	return new Response(ollamaRes.body, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
};