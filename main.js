const form = document.getElementById('generator-form');
const generateBtn = document.getElementById('generate-btn');
const threadsPreview = document.getElementById('threads-preview');
const facebookPreview = document.getElementById('facebook-preview');
const statusTag = document.getElementById('status-tag');

let currentPlatform = 'threads';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const businessName = document.getElementById('businessName').value;
    const goal = document.getElementById('goal').value;
    const offer = document.getElementById('offer').value;
    const tone = document.getElementById('tone').value;
    const platforms = [];
    if (document.getElementById('threads').checked) platforms.push('Threads');
    if (document.getElementById('facebook').checked) platforms.push('Facebook');

    if (platforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    statusTag.textContent = 'Generating...';
    threadsPreview.textContent = '';
    facebookPreview.textContent = '';
    currentPlatform = 'threads';

    for (let i in platforms) {
        const platformID = document.getElementById(`${platforms[i].toLowerCase()}-preview`);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName, goal, offer, tone, platform: platforms[i] })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        console.log("hi")
                        if (data === '[DONE]') continue;

                        try {
                            const { content } = JSON.parse(data);
                            console.log(platformID.textContent)
                            platformID.textContent += content;
                        } catch (err) { }
                    }
                }
            }

            statusTag.textContent = 'Done!';
        } catch (error) {
            console.error(error);
            statusTag.textContent = 'Error';
            platformID.textContent = 'Failed to generate :c';
        }
    }
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});

function updatePreviews(text) {
    const sections = text.split(/threads|facebook/i);

    if (sections.length > 1) {
        const threadsText = sections[1]?.trim() || '';
        const facebookText = sections[2]?.trim() || '';

        threadsPreview.textContent = threadsText || threadsPreview.textContent;
        facebookPreview.textContent = facebookText || facebookPreview.textContent;
    } else {
        threadsPreview.textContent = text;
    }
}

async function copyToClipboard(elementId, btn) {
    const text = document.getElementById(elementId).textContent;
    if (!text || text.includes('will appear here')) return;
    
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
}
