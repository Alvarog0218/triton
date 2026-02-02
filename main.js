import './style.css';
import Chart from 'chart.js/auto';

// Constants
const PRICE_PER_BARREL = 60; // UPDATED: Lower price scenario
const INVESTOR_EQUITY_PERCENT = 0.05; // UPDATED: 5% Equity

// State
let state = {
    capacity: 1200,
    days: 24,
    opex: 40 // Conservative default
};

// DOM Elements
const capacityInput = document.getElementById('capacityInput');
const daysInput = document.getElementById('daysInput');
const opexInput = document.getElementById('opexInput');

const capacityVal = document.getElementById('capacityVal');
const daysVal = document.getElementById('daysVal');
const opexVal = document.getElementById('opexVal');

const netPerBarrelEl = document.getElementById('netPerBarrel');
const monthlyNetEl = document.getElementById('monthlyNet');
const investorShareEl = document.getElementById('investorShare');

// Chart Instance
let financialChart = null;

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function calculate() {
    // Safety check: ensure opex doesn't exceed price (loss scenario)
    let marginPerBarrel = PRICE_PER_BARREL - state.opex;
    if (marginPerBarrel < 0) marginPerBarrel = 0; 

    const monthlyTotal = state.capacity * state.days * marginPerBarrel;
    const investorShare = monthlyTotal * INVESTOR_EQUITY_PERCENT;

    // Update Text
    netPerBarrelEl.innerText = formatCurrency(marginPerBarrel);
    monthlyNetEl.innerText = formatCurrency(monthlyTotal);
    investorShareEl.innerText = formatCurrency(investorShare);

    // Update Inputs Display
    capacityVal.innerText = state.capacity;
    daysVal.innerText = state.days;
    opexVal.innerText = "$" + state.opex;

    // Color coding for stress test
    if(state.opex > 45) opexVal.classList.add('text-red-600');
    else opexVal.classList.remove('text-red-600');

    updateChart(monthlyTotal);
}

function initChart() {
    const ctx = document.getElementById('financialChart').getContext('2d');
    
    financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mes 1-2 (Inv)', 'Mes 3 (Log)', 'Mes 4 (Inst)', 'Mes 5 (Inicio)', 'Mes 6', 'Mes 7'],
            datasets: [
                {
                    label: 'Flujo de Caja Inversionista (Acumulado)',
                    data: [0, 0, 0, 0, 0, 0], // Placeholder
                    backgroundColor: '#1e3a8a',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value / 1000 + 'k';
                        }
                    }
                }
            }
        }
    });
}

function updateChart(monthlyTotal) {
    const dataPoints = [];

    // Months 1-4 (Zero Revenue due to timeline)
    dataPoints.push(0, 0, 0);

    // Months 5-7 (Projections)
    // Starting from Month 5
    for (let i = 0; i < 3; i++) {
        // Simplified Logic: Flat 10% Share always
        let monthlyShare = monthlyTotal * INVESTOR_EQUITY_PERCENT;
        dataPoints.push(monthlyShare);
    }

    financialChart.data.datasets[0].data = dataPoints;
    financialChart.update();
}

function resetSim() {
    state.capacity = 1200;
    state.days = 24;
    state.opex = 40;
    
    capacityInput.value = 1200;
    daysInput.value = 24;
    opexInput.value = 40;
    
    calculate();
}

// Event Listeners
if (capacityInput) capacityInput.addEventListener('input', (e) => { state.capacity = parseInt(e.target.value); calculate(); });
if (daysInput) daysInput.addEventListener('input', (e) => { state.days = parseInt(e.target.value); calculate(); });
if (opexInput) opexInput.addEventListener('input', (e) => { state.opex = parseInt(e.target.value); calculate(); });

// Init
if (document.getElementById('financialChart')) {
    initChart();
    calculate();
}

// Mobile Menu Logic
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}
