const form = document.getElementById('generator-form');
const generateBtn = document.getElementById('generate-btn');
const previewText = document.getElementById('preview-text');
const activePlatformLabel = document.getElementById('active-platform-label');
const statusTag = document.getElementById('status-tag');
const copyBtn = document.getElementById('copy-btn');
const platformTabs = document.querySelectorAll('.platform-tab');

const previewData = { threads: '', facebook: '' };
let activePlatform = 'threads';

platformTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        platformTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activePlatform = tab.dataset.platform;
        activePlatformLabel.textContent = activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1);
        previewText.textContent = previewData[activePlatform] || 'Your generated post will appear here...';
    });
});

copyBtn.addEventListener('click', async () => {
    const text = previewData[activePlatform];
    if (!text || text.includes('will appear here')) return;
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const businessName = document.getElementById('businessName').value;
    const goal = document.getElementById('goal').value;
    const offer = document.getElementById('offer').value;
    const tone = document.getElementById('tone').value;
    const additional_prompt = document.getElementById('additional-prompt').value;
    const model = document.getElementById('model').value;
    const platforms = [];
    if (document.getElementById('threads').checked) platforms.push('Threads');
    if (document.getElementById('facebook').checked) platforms.push('Facebook');

    if (platforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    statusTag.textContent = 'Checking content...';
    previewData.threads = '';
    previewData.facebook = '';
    previewText.textContent = '';

    try {
        const checkResponse = await fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessName, goal, offer, additional_prompt })
        });

        const { pass, reason, error } = await checkResponse.json();

        if (error || !pass) {
            statusTag.textContent = 'Blocked: ' + (reason || error || 'Inappropriate content');
            generateBtn.disabled = false;
            generateBtn.classList.remove('loading');
            return;
        }
    } catch (error) {
        console.error('Check failed:', error);
    }

    statusTag.textContent = 'Generating...';

    for (let i in platforms) {
        const platformKey = platforms[i].toLowerCase();
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName, goal, offer, tone, model, additional_prompt, platform: platforms[i] })
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
                        if (data === '[DONE]') continue;
                        try {
                            const { content } = JSON.parse(data);
                            previewData[platformKey] += content;
                            if (activePlatform === platformKey) {
                                previewText.textContent = previewData[platformKey];
                            }
                        } catch (err) { }
                    }
                }
            }

            statusTag.textContent = 'Done!';
        } catch (error) {
            console.error(error);
            statusTag.textContent = 'Error';
            previewData[platformKey] = 'Failed to generate :c';
            if (activePlatform === platformKey) {
                previewText.textContent = previewData[platformKey];
            }
        }
    }
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});
