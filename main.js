const platforms = [
    { id: 'threads', label: 'Threads' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'line', label: 'LINE' }
];

const form = document.getElementById('generator-form');
const generateBtn = document.getElementById('generate-btn');
const previewText = document.getElementById('preview-text');
const copyBtn = document.getElementById('copy-btn');
const platformCheckboxes = document.getElementById('platform-checkboxes');
const platformTabsContainer = document.getElementById('platform-tabs');

platforms.forEach((platform, index) => {
    const checkbox = document.createElement('label');
    checkbox.className = 'inline';
    checkbox.innerHTML = `<input type="checkbox" id="${platform.id}" ${index < 2 ? 'checked' : ''} /> ${platform.label}`;
    platformCheckboxes.appendChild(checkbox);

    const tab = document.createElement('button');
    tab.className = `platform-tab ${index === 0 ? 'active' : ''}`;
    tab.dataset.platform = platform.id;
    tab.textContent = platform.label;
    platformTabsContainer.appendChild(tab);
});

const platformTabs = document.querySelectorAll('.platform-tab');

const previewData = {};
platforms.forEach(p => previewData[p.id] = '');
let activePlatform = platforms[0].id;

platformTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        platformTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activePlatform = tab.dataset.platform;
        previewText.textContent = previewData[activePlatform] || 'Your generated post will appear here...';
    });
});

copyBtn.addEventListener('click', async () => {
    if (!copyBtn.dataset.copyable) return;
    const text = previewData[activePlatform];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    copyBtn.dataset.copyable = '';
    setTimeout(() => {
        copyBtn.textContent = 'Copy Text';
        copyBtn.dataset.copyable = 'true';
    }, 500);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const businessName = document.getElementById('businessName').value;
    const goal = document.getElementById('goal').value;
    const offer = document.getElementById('offer').value;
    const tone = document.getElementById('tone').value;
    const additional_prompt = document.getElementById('additional-prompt').value;
    const model = document.getElementById('model').value;
    const selectedPlatforms = [];
    platforms.forEach(p => {
        if (document.getElementById(p.id).checked) selectedPlatforms.push(p.label);
    });

    if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    copyBtn.textContent = 'Checking...';
    copyBtn.dataset.copyable = '';
    platforms.forEach(p => previewData[p.id] = '');
    previewText.textContent = '';

    try {
        const checkResponse = await fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessName, goal, offer, additional_prompt })
        });

        const { pass, reason, error } = await checkResponse.json();

        if (error || !pass) {
            copyBtn.textContent = 'Blocked';
            generateBtn.disabled = false;
            generateBtn.classList.remove('loading');
            return;
        }
    } catch (error) {
        console.error('Check failed:', error);
    }

    copyBtn.textContent = 'Generating...';

    for (let i in selectedPlatforms) {
        const platformKey = selectedPlatforms[i].toLowerCase();
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName, goal, offer, tone, model, additional_prompt, platform: selectedPlatforms[i] })
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

            copyBtn.textContent = 'Copy Text';
            copyBtn.dataset.copyable = 'true';
        } catch (error) {
            console.error(error);
            copyBtn.textContent = 'Error';
            previewData[platformKey] = 'Failed to generate :c';
            if (activePlatform === platformKey) {
                previewText.textContent = previewData[platformKey];
            }
        }
    }
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});
