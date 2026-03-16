import Groq from 'groq-sdk';

const client = new Groq();

export const dynamic = 'force-dynamic';

export async function POST(request) {
    const { businessName, goal, offer, tone, platform } = await request.json();

    if (!businessName || !goal || !tone || !platform) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `You are a creative marketing copywriter. Write a marketing post for:
    - Business: ${businessName}
    - Goal: ${goal}
    - Offer: ${offer}
    - Tone: ${tone}
    - Platform: ${platform}
    Just make the post, don't have "Here's the post..." at the front or "This post has..." at the end. The post will be used in a copy paste way, so talk to the customer, not me`;


    const stream = await client.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: prompt }],
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
