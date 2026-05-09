const platforms = [
    { id: 'threads', label: 'Threads' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'line', label: 'LINE' }
];

const form = document.getElementById('generator-form');
const generateBtn = document.getElementById('generate-btn');
const previewText = document.getElementById('preview-text');
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

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // const businessName = document.getElementById('businessName').value;
    const selectedPlatforms = [];
    platforms.forEach(p => {
        if (document.getElementById(p.id).checked) selectedPlatforms.push(p.label);
    });

    if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
    }

    const btnText = generateBtn.querySelector('.btn-text');
    btnText.textContent = 'Checking...';
    generateBtn.disabled = true;
    platforms.forEach(p => previewData[p.id] = '');
    previewText.textContent = '';

    generateBtn.classList.add('loading');

    for (let i in selectedPlatforms) {
        const platformKey = selectedPlatforms[i].toLowerCase();
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ businessName, goal, offer, tone, model, additional_prompt, platform: selectedPlatforms[i] })
                body: JSON.stringify({
                    promotionTarget: document.getElementById('promotionTarget').value,
                    targetAudience: document.getElementById('targetAudience').value,
                    promotionStart: document.getElementById('promotionStart').value,
                    promotionEnd: document.getElementById('promotionEnd').value,
                    eventDateTimeLocation: document.getElementById('eventDateTimeLocation').value,
                    registrationUrl: document.getElementById('registrationUrl').value,
                    brandVoice: document.getElementById('brandVoice').value,
                    priceOffer: document.getElementById('priceOffer').value,
                    quotaDeadline: document.getElementById('quotaDeadline').value,
                    extraConstraints: document.getElementById('extraConstraints').value
                })
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

            btnText.textContent = 'Generate Post';

        } catch (error) {
            console.error(error);
            btnText.textContent = 'Error';
            generateBtn.disabled = false;
            generateBtn.classList.remove('loading');
            previewData[platformKey] = 'Failed to generate :c';
            if (activePlatform === platformKey) {
                previewText.textContent = previewData[platformKey];
            }
            return;
        }
    }
    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});
