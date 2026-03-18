import Groq from 'groq-sdk';

const client = new Groq();

export const dynamic = 'force-dynamic';

const HARMFUL_PATTERNS = [
    /\b(drugs?|cocaine|heroin|marijuana|weed|cannabis|lsd|meth|amphetamine|fentanyl|opioids?|prescription\s*abuse)\b/i,
    /\b(kill|suicide|self-harm|harm\s*others?|attack|murder)\b/i,
    /\b(illegal\s*activities?|fraud|scam|phishing|hack|steal)\b/i,
    /\b(hate\s*speech|racist|discriminat|nazi|extremist)\b/i,
    /\b(sexually\s*explicit|porn|xxx)\b/i,
];

export async function POST(request) {
    const { businessName, goal, offer, additional_prompt } = await request.json();

    if (!businessName || !goal || !offer) {
        return Response.json({ error: 'Missing required fields: businessName, goal, and offer' }, { status: 400 });
    }

    const combinedText = `${businessName} ${goal} ${offer} ${additional_prompt || ''}`;

    for (const pattern of HARMFUL_PATTERNS) {
        if (pattern.test(combinedText)) {
            return Response.json({ pass: false, reason: 'Inappropriate content' });
        }
    }

    const prompt = `You are a simple checker. Evaluate the following text for:
    1. Whether the content is related to writing a marketing post for a small business/person
    2. Whether it is appropriate and not harmful (no drugs, violence, illegal content, hate speech, etc.)
    3. Whether the text is ok, and not dumb gibberish
    4. Additional instructions can't be for anything else that isn't about marketing
    
    Check if this makes sense:
    Business Name: ${businessName}
    Goal: ${goal}
    Offers or News for their customers: ${offer}
    Additional instructions (could be empty as it is optional): ${additional_prompt || 'none'}

    Respond with ONLY a JSON object in this exact format, no other text:
    {"pass": true/false, "reason": "Perfect" || "Inappropriate content" || "Non-related content"}`;

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_completion_tokens: 256,
    });

    const content = response.choices[0]?.message?.content || '';

    try {
        const parsed = JSON.parse(content);
        console.log(parsed)
        return Response.json(parsed);
    } catch {
        console.log(response)
        return Response.json({ pass: false, reason: 'Failed to parse moderation response' });
    }
}
