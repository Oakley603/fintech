// ==========================================
// FXGuard 全局权限与状态管理 (tier-manager.js)
// ==========================================

let currentTier = localStorage.getItem('fx_userTier') || 'free';

// 1. 初始化右上角演示用切换面板
function initTierUI() {
    // 新增这一行：如果页面上已经存在这个 ID，就立刻终止，防止重复生成！
    if (document.getElementById('tierSelector')) return; 

    const panel = document.createElement('div');
    // 这里是完整的样式，没有省略号
    panel.className = 'fixed top-4 right-4 z-[9999] bg-white p-3 rounded shadow-xl border border-gray-200 flex flex-col gap-2 text-sm';
    panel.innerHTML = `
        <div class="font-bold text-[#0a2463] border-b pb-1 flex items-center gap-2">
            <i data-lucide="settings" class="w-4 h-4"></i> Tier Simulator
        </div>
        <select id="tierSelector" class="border p-1 rounded outline-none font-medium text-gray-700 cursor-pointer">
            <option value="free" ${currentTier === 'free' ? 'selected' : ''}>Free Tier</option>
            <option value="basic" ${currentTier === 'basic' ? 'selected' : ''}>Basic (¥198/mo)</option>
            <option value="pro" ${currentTier === 'pro' ? 'selected' : ''}>Pro (¥368/mo)</option>
        </select>
    `;
    document.body.appendChild(panel);

    document.getElementById('tierSelector').addEventListener('change', (e) => {
        localStorage.setItem('fx_userTier', e.target.value);
        location.reload(); // 切换后刷新页面以应用新权限
    });
}
// 2. 核心算法：为指定元素动态生成"磨砂玻璃 + 悬浮解锁"效果
function applyFrostedLock(elementId, title, subtitle) {
    const el = document.getElementById(elementId);
    if (!el || el.dataset.locked === 'true') return;
    el.dataset.locked = 'true';

    el.classList.add('relative', 'overflow-hidden');

    const blurWrapper = document.createElement('div');
    blurWrapper.className = 'blur-[4px] opacity-60 pointer-events-none select-none transition-all w-full h-full';
    
    while (el.firstChild) {
        blurWrapper.appendChild(el.firstChild);
    }
    el.appendChild(blurWrapper);

    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px] z-10 pointer-events-auto rounded-lg';
    
    overlay.innerHTML = `
        <div class="bg-white p-3 rounded-full shadow-md mb-3 border border-gray-100">
            <i data-lucide="lock" class="w-8 h-8 text-[#0a2463]"></i>
        </div>
        <h3 class="text-xl font-bold text-[#0a2463] mb-2 shadow-white drop-shadow-md">${title}</h3>
        <p class="text-sm text-gray-800 font-semibold mb-5 bg-white/90 px-4 py-1.5 rounded-full shadow-sm border border-gray-200">${subtitle}</p>
        <button onclick="alert('Redirecting to Pricing Page...')" class="bg-[#0a2463] hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-full shadow-lg transition-all flex items-center gap-2 transform hover:scale-105">
            Upgrade Now <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
    `;
    el.appendChild(overlay);
}

// 3. 根据当前档位，应用拦截和锁定
function applyTierRestrictions() {

    // A. Strategy 页面：多货币优先级限制 (仅 Pro 可见)
    if (currentTier === 'free' || currentTier === 'basic') {
        applyFrostedLock('multiCurrencyBanner', 'Pro Feature', 'Upgrade to ¥368/mo to unlock multi-currency management');
        applyFrostedLock('multiCurrencyRecommendations', 'Pro Feature', 'Unlock advanced priority algorithms');
    }

    // B. Dashboard 页面：预警线模块整体限制 (仅 Basic/Pro 可见)
    if (currentTier === 'free') {
        applyFrostedLock('alertSettingsPanel', 'Basic Feature', 'Upgrade to Basic (¥198) to unlock Rate Alerts');
        applyFrostedLock('alertChartPanel', 'Basic Feature', 'Unlock real-time monitoring and alert zones');
    }

    // C. Dashboard 页面：货币对下拉框限制 (Basic 状态锁死特定货币)
    const alertCurrency = document.getElementById('alertCurrency');
    if (alertCurrency && (currentTier === 'free' || currentTier === 'basic')) {
        Array.from(alertCurrency.options).forEach(opt => {
            if (opt.value !== 'CNY-MYR') {
                opt.disabled = true;
                opt.text += ' 🔒 (Pro Only)';
                opt.title = 'Upgrade to Pro tier to unlock this currency pair';
            }
        });
    }

// E. Data Input 页面：SGD / THB 货币对锁定
    if (currentTier === 'free' || currentTier === 'basic') {
        const checkSGD = document.getElementById('checkSGD');
        const checkTHB = document.getElementById('checkTHB');
        if (checkSGD && checkTHB) {
            [checkSGD, checkTHB].forEach(chk => { chk.disabled = true; chk.checked = false; });
            [document.getElementById('labelSGD'), document.getElementById('labelTHB')].forEach(lbl => {
                lbl.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-50');
                lbl.classList.remove('hover:bg-gray-50', 'cursor-pointer');
                lbl.title = 'Upgrade to Pro tier to unlock';
            });
            document.getElementById('lockSGD').classList.remove('hidden');
            document.getElementById('lockTHB').classList.remove('hidden');
            document.getElementById('textSGD').innerText += ' (Pro Only)';
            document.getElementById('textTHB').innerText += ' (Pro Only)';
        }
    }

    // D. Dashboard 页面：多货币卡片与图表标签锁定 (仅 Pro 可见)
    if (currentTier === 'free' || currentTier === 'basic') {
        applyFrostedLock('rateCardSGD', 'Pro Feature', 'Unlock SGD Tracker');
        applyFrostedLock('rateCardTHB', 'Pro Feature', 'Unlock THB Tracker');
        ['tabSGD', 'tabTHB', 'tabCompare'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = true;
                btn.classList.add('opacity-40', 'cursor-not-allowed');
                btn.classList.remove('hover:bg-gray-100', 'text-gray-600');
                btn.title = "Upgrade to Pro to unlock";
            }
        });
    } else {
        document.querySelectorAll('.tab-lock').forEach(icon => {
            icon.classList.add('hidden');
        });
    }

    // 重新渲染 Lucide 图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 页面加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {
    initTierUI();
    setTimeout(applyTierRestrictions, 100);
});
