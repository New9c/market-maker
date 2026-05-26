const platforms = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'threads', label: 'Threads' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'line', label: 'LINE' },
    { id: 'dcard', label: 'Dcard' },
    { id: 'email', label: 'Email' }
];

const form = document.getElementById('generator-form');
const generateBtn = document.getElementById('generate-btn');
const previewText = document.getElementById('preview-text');
const platformCheckboxes = document.getElementById('platform-checkboxes');
const platformTabsContainer = document.getElementById('platform-tabs');

platforms.forEach((platform, index) => {
    const checkbox = document.createElement('label');
    checkbox.className = 'inline';
    checkbox.innerHTML = `<input type="checkbox" id="${platform.id}" ${index === 0 ? 'checked' : ''} /> ${platform.label}`;
    checkbox.addEventListener('click', () => {
        platformTabs.forEach(t => t.classList.remove('active'));
        for (const t of platformTabs) {
            if (document.getElementById(t.dataset.platform).checked) {
                t.classList.add('active');
                activePlatform = t.dataset.platform;
                previewText.textContent = previewData[activePlatform] || '';
                break;
            }
        }
    });
    platformCheckboxes.appendChild(checkbox);

    const tab = document.createElement('button');
    tab.className = `${platform.id} platform-tab ${index === 0 ? 'active' : ''}`;
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
        previewText.textContent = previewData[activePlatform] || '';
    });
});

async function writePost(platform) {
    const platformKey = platform.toLowerCase();
    const btnText = generateBtn.querySelector('.btn-text');
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platform: platform,
                dcardMode: document.getElementById('dcardMode').value,
                promotionTarget: document.getElementById('promotionTarget').value,
                targetAudience: document.getElementById('targetAudience').value,
                promotionStart: document.getElementById('promotionStart').value,
                promotionEnd: document.getElementById('promotionEnd').value,
                keySellingPoints: document.getElementById('keySellingPoints').value,
                eventFlow: document.getElementById('eventFlow').value,
                eventDateTimeLocation: document.getElementById('eventDateTimeLocation').value,
                registrationUrl: document.getElementById('registrationUrl').value,
                unsubscribeUrl: document.getElementById('unsubscribeUrl').value,
                hasImageBrief: document.getElementById('imageBrief').value ? 'true' : 'false',
                imageBrief: document.getElementById('imageBrief').value || 'None',
                brandVoice: document.getElementById('brandVoice').value,
                threadsTopicTag: document.getElementById('threadsTopicTag').value,
                priceOffer: document.getElementById('priceOffer').value,
                quotaDeadline: document.getElementById('quotaDeadline').value,
                lineGroupType: document.getElementById('lineGroupType').value,
                isCommercialEvent: document.getElementById('isCommercialEvent').value,
                instagramPostType: document.getElementById('instagramPostType').value,
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

form.addEventListener('submit', async (e) => {
    e.preventDefault();

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
    const platformPromises = selectedPlatforms.map(async platform => writePost(platform));
    await Promise.allSettled(platformPromises);

    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});
