import { error } from '@sveltejs/kit';

export async function GET({url}: {url: URL}) {
    const fileUrl = url.searchParams.get('url');

    if (!fileUrl) {
        throw error(400, 'Missing file URL');
    }

    try {
        const response = await fetch(fileUrl, {mode: "no-cors"});
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const imageBuffer = await response.arrayBuffer();

        return new Response(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600' // Optional: for caching
            }
        });
    } catch (err) {
        if (err instanceof Error) {
            throw error(500, `Error fetching image: ${err.message}`);
        } else {
            throw error(500, 'An unknown error occurred while fetching the image');
        }
    }
}