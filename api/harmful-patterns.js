export const HARMFUL_PATTERNS = [
    /\b(drugs?|cocaine|heroin|marijuana|weed|cannabis|lsd|meth|amphetamine|fentanyl|opioids?|prescription\s*abuse)\b/i,
    /\b(kill|suicide|self-harm|harm\s*others?|attack|murder)\b/i,
    /\b(illegal\s*activities?|fraud|scam|phishing|hack|steal)\b/i,
    /\b(hate\s*speech|racist|discriminat|nazi|extremist)\b/i,
    /\b(sexually\s*explicit|porn|xxx)\b/i,
];

export function checkForHarmfulContent(text) {
    return HARMFUL_PATTERNS.some((pattern) => pattern.test(text));
}
