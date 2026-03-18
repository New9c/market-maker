# Market Maker

AI-powered marketing copy generator for social media platforms.

## Setup

```bash
npm install
cp .env.example .env  # Then add your GROQ_API_KEY
```

## Running

```bash
npm start        # Production
npm run dev      # Development with watch mode
```

## Testing

```bash
npm test         # Run tests with watch mode
npm run test:run # Run tests once
```

Tests use [Vitest](https://vitest.dev/) and include:
- Unit tests for content moderation patterns
- Integration tests with the Groq AI API

## API

### POST /api/check

Checks if content is appropriate for marketing.

**Request:**
```json
{
  "businessName": "Joe's Pizza",
  "goal": "Attract more customers",
  "offer": "20% off on weekends",
  "additional_prompt": "Make it sound exciting"
}
```

**Response:**
```json
{
  "pass": true,
  "reason": "Perfect"
}
```

## Tech Stack

- Frontend: Vanilla JS, HTML, CSS
- Backend: Node.js API
- AI: Groq SDK

## Roadmap

- [ ] Add more platforms (Instagram, X, LinkedIn, etc.)
- [ ] Improve preview system with real-time rendering
- [ ] Add zh-tw (Traditional Chinese) language support
