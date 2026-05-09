import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Groq();

export const dynamic = 'force-dynamic';

function generatePrompt(template, data) {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
        if (!(key in data)) {
            console.warn(`Warning: Template requires "${key}" but it was not provided.`);
            return `[MISSING: ${key}]`;
        }

        const value = data[key];

        if (Array.isArray(value)) {
            return value.map(item => `\n- ${item}`).join('');
        }

        return String(value);
    });
}

export async function POST(request) {
    const template = fs.readFileSync(path.join(__dirname, './prompts/FacebookPrompt.md'), 'utf8');

    const data = await request.json();
    const thePrompt = generatePrompt(template, data);

    const stream = await client.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: thePrompt }],
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
