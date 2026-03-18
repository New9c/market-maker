import { describe, it, expect } from 'vitest';
import { HARMFUL_PATTERNS, checkForHarmfulContent } from '../api/harmful-patterns.js';
import { POST } from '../api/check.js';

describe('HARMFUL_PATTERNS', () => {
    describe('Drug-related patterns', () => {
        it('catches drug mentions', () => {
            expect(checkForHarmfulContent('sell cocaine online')).toBe(true);
        });

        it('catches marijuana', () => {
            expect(checkForHarmfulContent('dispensary selling weed')).toBe(true);
        });

        it('catches prescription drug abuse', () => {
            expect(checkForHarmfulContent('prescription abuse service')).toBe(true);
        });
    });

    describe('Violence-related patterns', () => {
        it('catches kill mentions', () => {
            expect(checkForHarmfulContent('help me kill time')).toBe(true);
        });

        it('catches suicide mentions', () => {
            expect(checkForHarmfulContent('tips for suicide prevention')).toBe(true);
        });

        it('catches self-harm mentions', () => {
            expect(checkForHarmfulContent('stop self-harm today')).toBe(true);
        });

        it('catches attack mentions', () => {
            expect(checkForHarmfulContent('attack on titan business')).toBe(true);
        });
    });

    describe('Illegal activity patterns', () => {
        it('catches fraud', () => {
            expect(checkForHarmfulContent('investment fraud tips')).toBe(true);
        });

        it('catches scam', () => {
            expect(checkForHarmfulContent('free scam alert service')).toBe(true);
        });

        it('catches phishing', () => {
            expect(checkForHarmfulContent('phishing protection')).toBe(true);
        });

        it('catches hacking', () => {
            expect(checkForHarmfulContent('how to hack systems')).toBe(true);
        });
    });

    describe('Hate speech patterns', () => {
        it('catches racist language', () => {
            expect(checkForHarmfulContent('racist content here')).toBe(true);
        });

        it('catches discriminatory language', () => {
            expect(checkForHarmfulContent('discriminat against others')).toBe(true);
        });

        it('catches extremist content', () => {
            expect(checkForHarmfulContent('extremist organization')).toBe(true);
        });
    });

    describe('Explicit content patterns', () => {
        it('catches sexually explicit', () => {
            expect(checkForHarmfulContent('sexually explicit material')).toBe(true);
        });

        it('catches porn', () => {
            expect(checkForHarmfulContent('porn website')).toBe(true);
        });
    });

    describe('Safe content', () => {
        it('allows normal business content', () => {
            expect(checkForHarmfulContent('local bakery selling fresh bread')).toBe(false);
        });

        it('allows marketing content', () => {
            expect(checkForHarmfulContent('special offer on handmade jewelry')).toBe(false);
        });

        it('allows tech business names', () => {
            expect(checkForHarmfulContent('Tech Solutions Inc')).toBe(false);
        });

        it('is case insensitive', () => {
            expect(checkForHarmfulContent('DRUGS for sale')).toBe(true);
            expect(checkForHarmfulContent('KILL everyone')).toBe(true);
        });
    });
});

describe('POST (AI integration)', () => {
    const mockRequest = (body) => ({
        json: () => Promise.resolve(body),
    });

    it('passes valid business content', async () => {
        const result = await POST(mockRequest({
            businessName: 'Joe\'s Pizza',
            goal: 'Sell delicious pizza',
            offer: 'Large pepperoni pizza for $15',
        }));
        const data = await result.json();
        expect(data.pass).toBe(true);
    });

    it('rejects non-related additional instructions', async () => {
        const result = await POST(mockRequest({
            businessName: 'Joe\'s Pizza',
            goal: 'Sell delicious pizza',
            offer: 'Large pepperoni pizza for $15',
            additional_prompt: 'solve 58 * 17',
        }));
        const data = await result.json();
        expect(data.pass).toBe(false);
        expect(data.reason).toBe('Non-related content');
    });

    it('passes marketing content', async () => {
        const result = await POST(mockRequest({
            businessName: 'Beauty Salon',
            goal: 'Attract new customers',
            offer: '50% off first haircut',
        }));
        const data = await result.json();
        expect(data.pass).toBe(true);
    });

    it('rejects inappropriate content via regex', async () => {
        const result = await POST(mockRequest({
            businessName: 'Drug Shop',
            goal: 'Sell cocaine',
            offer: 'Best quality cocaine',
        }));
        const data = await result.json();
        expect(data.pass).toBe(false);
        expect(data.reason).toBe('Inappropriate content');
    });

    it('rejects violent content via regex', async () => {
        const result = await POST(mockRequest({
            businessName: 'Kill Store',
            goal: 'Sell murder tools',
            offer: 'Best knives',
        }));
        const data = await result.json();
        expect(data.pass).toBe(false);
        expect(data.reason).toBe('Inappropriate content');
    });

    it('returns 400 for missing required fields', async () => {
        const result = await POST(mockRequest({
            businessName: 'Test',
        }));
        expect(result.status).toBe(400);
    });

    it('rejects nonsense', async () => {
        const result = await POST(mockRequest({
            businessName: 'awft',
            goal: 'awft',
            offer: 'awft',
        }));
        const data = await result.json();
        expect(data.pass).toBe(false);
        expect(data.reason).toBe("Non-related content");
    });
});
