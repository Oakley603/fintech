// fx-alert.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Chart
    const ctx = document.getElementById('fxChart');
    if (!ctx) return;

    // Mock data
    const labels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const currentRates = [1.75, 1.76, 1.75, 1.74, 1.73, 1.725, 1.72]; 
    const floorRate = 1.72;
    const targetRate = 1.78;

    // Warning trigger
    const isWarning = currentRates[currentRates.length - 1] <= floorRate * 1.05;
    const lineColor = isWarning ? '#E24B4A' : '#0A2463'; 

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Rate (CNY/MYR)',
                    data: currentRates,
                    borderColor: lineColor,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    zIndex: 10
                },
                {
                    label: 'Floor Rate (1.72)',
                    data: Array(7).fill(floorRate),
                    borderColor: '#E24B4A', 
                    borderWidth: 2,
                    borderDash: [5, 5], 
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Target Rate (1.78)',
                    data: Array(7).fill(targetRate),
                    borderColor: '#1D9E75', 
                    borderWidth: 2,
                    borderDash: [5, 5], 
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Acceptable Range Top',
                    data: Array(7).fill(1.76),
                    borderColor: 'transparent',
                    fill: '+1', 
                    backgroundColor: 'rgba(10, 36, 99, 0.1)', 
                    pointRadius: 0
                },
                {
                    label: 'Acceptable Range Bottom',
                    data: Array(7).fill(1.72),
                    borderColor: 'transparent',
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        }
    });

    // 2. Modal Logic
    const demoBtn = document.getElementById('demoAlertBtn');
    const alertModal = document.getElementById('alertModal');
    const ignoreBtn = document.getElementById('ignoreAlertBtn');

    if (demoBtn && alertModal) {
        demoBtn.addEventListener('click', () => {
            alertModal.classList.remove('hidden');
            alertModal.classList.add('flex');
        });
    }

    if (ignoreBtn && alertModal) {
        ignoreBtn.addEventListener('click', () => {
            alertModal.classList.add('hidden');
            alertModal.classList.remove('flex');
        });
    }

    // 3. Tier restrictions for dropdown
    const alertCurrency = document.getElementById('alertCurrency');
    const currentTier = localStorage.getItem('fx_userTier') || 'free';
    if (alertCurrency && (currentTier === 'free' || currentTier === 'basic')) {
        Array.from(alertCurrency.options).forEach(opt => {
            if (opt.value !== 'CNY-MYR') {
                opt.disabled = true;
                opt.text += ' (Pro Only)';
            }
        });
    }
});