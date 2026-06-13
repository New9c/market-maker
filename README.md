<div align="center">

# Market Maker
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="150"><rect width="256" height="256" rx="48" fill="#cba6f7"/><path d="M240,127.89a16,16,0,0,1-8.18,14L63.9,237.9A16.15,16.15,0,0,1,56,240a16,16,0,0,1-15-21.33l27-79.95A4,4,0,0,1,71.72,136H144a8,8,0,0,0,8-8.53,8.19,8.19,0,0,0-8.26-7.47h-72a4,4,0,0,1-3.79-2.72l-27-79.94A16,16,0,0,1,63.84,18.07l168,95.89A16,16,0,0,1,240,127.89Z" fill="#000"/></svg>
#### AI-powered marketing copy generator for social media platforms.
#### Try it out: [marketmaker.tw](https://marketmaker.tw)

</div>

## Motive
To save time and effort for smaller businesses or individuals.

## Features
- Generate marketing copy for 6 platforms at once: Facebook, Threads, Instagram, LINE, Dcard, Email
- Per-platform prompt templates with platform-specific rules
- Rate-limit aware retry handling
- Date pickers, URL validation, session persistence
- Platform-registry architecture for easy expansion

## Install
```bash
git clone <repo-url>
cd market-maker
npm install
cp .env.example .env  # Add your GROQ_API_KEY (optional — you can paste it in the UI)
```

Run locally with Vercel:
```bash
npx vercel dev
```

## Contributing
I'm not quite sure if the project is ready for contributions, but if you're interested in helping out, feel free to open an issue or submit a pull request.
