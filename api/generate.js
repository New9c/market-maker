import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Groq({ maxRetries: 0 });

export const dynamic = 'force-dynamic';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryDelay(message) {
    const sec = message.match(/try again in ([\d.]+)s/);
    if (sec) return parseFloat(sec[1]);
    const ms = message.match(/try again in ([\d.]+)ms/);
    if (ms) return parseFloat(ms[1]) / 1000;
    return null;
}

function generatePrompt(data) {
    const { platform, ...querys } = data
    const template = fs.readFileSync(path.join(__dirname, `./prompts/${platform}Prompt.md`), 'utf8');

    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
        if (!(key in querys)) {
            console.warn(`Warning: Template requires "${key}" but it was not provided.`);
            return `[MISSING: ${key}]`;
        }

        const value = querys[key];

        if (Array.isArray(value)) {
            return value.map(item => `\n- ${item}`).join('');
        }

        return String(value);
    });
}

async function createCompletion(prompt, onRetry) {
    for (let attempt = 0; attempt <= 3; attempt++) {
        try {
            return await client.chat.completions.create({
                model: 'openai/gpt-oss-120b',
                messages: [{ role: 'user', content: prompt }],
                temperature: 1,
                max_completion_tokens: 3072,
                top_p: 1,
                stream: true,
            });
        } catch (error) {
            const delay = parseRetryDelay(error.message);
            if (delay !== null && attempt < 3) {
                onRetry(delay);
                await sleep((delay + 0.2) * 1000);
                continue;
            }
            throw error;
        }
    }
}

export async function POST(request) {
    const data = await request.json();
    const thePrompt = generatePrompt(data);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            try {
                const stream = await createCompletion(thePrompt, (delay) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'retry', delay })}\n\n`));
                });

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`));
                    }
                }
            } catch (error) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`));
            } finally {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            }
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
