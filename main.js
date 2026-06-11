const platforms = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'threads', label: 'Threads' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'line', label: 'LINE' },
    { id: 'dcard', label: 'Dcard' },
    { id: 'email', label: 'Email' }
];

const gid = id => document.getElementById(id);
const val = id => gid(id).value;

const form = gid('generator-form');
const generateBtn = gid('generate-btn');
const previewText = gid('preview-text');
const platformCheckboxes = gid('platform-checkboxes');
const platformTabsContainer = gid('platform-tabs');
const keyPopover = gid('key-popover');
const keyIcon = gid('groq-key');
const apiKeyInput = gid('groq-api-key');
const previewPanel = gid('preview-panel');
const previewOverlay = gid('preview-overlay');

apiKeyInput.value = localStorage.getItem('groq-api-key') ?? '';
apiKeyInput.addEventListener('input', () => localStorage.setItem('groq-api-key', apiKeyInput.value));

function openPreview() {
    previewPanel.classList.add('open');
    previewOverlay.classList.add('open');
}

function closePreview() {
    previewPanel.classList.remove('open');
    previewOverlay.classList.remove('open');
}

previewOverlay.addEventListener('click', closePreview);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePreview();
});

keyIcon.addEventListener('click', e => {
    e.stopPropagation();
    keyPopover.classList.toggle('visible');
    if (keyPopover.classList.contains('visible')) apiKeyInput.focus();
});

document.addEventListener('click', () => keyPopover.classList.remove('visible'));
keyPopover.addEventListener('click', e => e.stopPropagation());

function getFormData(platform) {
    const key = apiKeyInput.value.trim();
    return {
        platform,
        ...(key && { 'groq-api-key': key }),
        dcardMode: val('dcardMode'),
        promotionTarget: val('promotionTarget'),
        targetAudience: val('targetAudience'),
        promotionStart: val('promotionStart'),
        promotionEnd: val('promotionEnd'),
        keySellingPoints: val('keySellingPoints'),
        eventFlow: val('eventFlow'),
        eventDateTimeLocation: val('eventDateTimeLocation'),
        registrationUrl: val('registrationUrl'),
        unsubscribeUrl: val('unsubscribeUrl'),
        hasImageBrief: gid('imageBrief').value ? 'true' : 'false',
        imageBrief: val('imageBrief') || 'None',
        brandVoice: val('brandVoice'),
        threadsTopicTag: val('threadsTopicTag'),
        priceOffer: val('priceOffer'),
        quotaDeadline: val('quotaDeadline'),
        lineGroupType: val('lineGroupType'),
        isCommercialEvent: val('isCommercialEvent'),
        instagramPostType: val('instagramPostType'),
        extraConstraints: val('extraConstraints'),
    };
}

platforms.forEach((platform, index) => {
    const checkbox = document.createElement('label');
    checkbox.className = 'inline';
    checkbox.innerHTML = `<input type="checkbox" id="${platform.id}" ${index === 0 ? 'checked' : ''} /> ${platform.label}`;
    checkbox.addEventListener('click', () => {
        platformTabs.forEach(t => t.classList.remove('active'));
        for (const t of platformTabs) {
            if (gid(t.dataset.platform).checked) {
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

function setPreview(key, value) {
    previewData[key] = value;
    if (activePlatform === key) {
        previewText.textContent = value;
    }
}

let retryTimer = null;
const contentStarted = new Set();

function showRetryCountdown(delay, platformKey) {
    let remaining = Math.ceil(delay);

    clearInterval(retryTimer);
    setPreview(platformKey, `等候中（剩${remaining}秒）...`);

    const tick = () => {
        if (remaining <= 0) {
            clearInterval(retryTimer);
            retryTimer = null;
            setPreview(platformKey, '製作中...');
            return;
        }
        setPreview(platformKey, `等候中（剩${remaining}秒）...`);
        remaining--;
    };
    retryTimer = setInterval(tick, 1000);
}

function clearRetryStatus() {
    if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
    }
}

async function writePost(platform) {
    const platformKey = platform.toLowerCase();
    contentStarted.delete(platformKey);
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getFormData(platform))
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            setPreview(platformKey, err.error || 'Failed to generate');
            return;
        }

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
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'retry') {
                            showRetryCountdown(parsed.delay, platformKey);
                        } else if (parsed.type === 'error') {
                            clearRetryStatus();
                            setPreview(platformKey, parsed.message);
                        } else {
                            if (!contentStarted.has(platformKey)) {
                                contentStarted.add(platformKey);
                                clearRetryStatus();
                                previewData[platformKey] = '';
                            }
                            const content = parsed.content || '';
                            previewData[platformKey] += content;
                            if (activePlatform === platformKey) {
                                previewText.textContent = previewData[platformKey];
                            }
                        }
                    } catch (err) { }
                }
            }
        }

    } catch (error) {
        console.error(error);
        clearRetryStatus();
        setPreview(platformKey, '失敗 :c');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedPlatforms = [];
    platforms.forEach(p => {
        if (gid(p.id).checked) selectedPlatforms.push(p.label);
    });

    if (selectedPlatforms.length === 0) {
        alert('請至少選擇一個平台');
        return;
    }
    generateBtn.disabled = true;
    platforms.forEach(p => previewData[p.id] = '');
    previewText.textContent = '';
    openPreview();

    generateBtn.classList.add('loading');

    for (let i = 0; i < selectedPlatforms.length; i++) {
        const platform = selectedPlatforms[i];
        const key = platform.toLowerCase();
        setPreview(key, i == 0 ? '製作中...' : '正在等候其他平台...');
    }

    for (const platform of selectedPlatforms) {
        await writePost(platform);
    }

    generateBtn.disabled = false;
    generateBtn.classList.remove('loading');
});
