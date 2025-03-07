// Initialize Lucide icons
lucide.createIcons();

// State
let isDark = false;
let brightness = 50;
let temperature = 21;
let isLocked = true;
let activeTab = 'home';
let currentColor = '#FFD700';

// DOM Elements
const app = document.querySelector('.app');
const themeToggle = document.getElementById('themeToggle');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const lampLight = document.querySelector('.lamp-light');
const tempSlider = document.getElementById('tempSlider');
const tempValue = document.getElementById('tempValue');
const lockToggle = document.getElementById('lockToggle');
const lockStatus = document.getElementById('lockStatus');
const navButtons = document.querySelectorAll('.nav-button');
const colorPicker = document.getElementById('colorPicker');
const colorPointer = document.getElementById('colorPointer');
const colorValue = document.getElementById('colorValue');
const colorPresets = document.querySelectorAll('.color-preset');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    app.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
    lucide.createIcons();
});

// Brightness Control
brightnessSlider.addEventListener('input', (e) => {
    brightness = e.target.value;
    brightnessValue.textContent = brightness;
    
    // Update lamp brightness
    lampLight.style.opacity = brightness / 100;
    lampLight.style.filter = `blur(${8 + (100 - brightness) / 10}px)`;
    
    // Add flicker effect when near 0
    if (brightness < 10) {
        lampLight.style.animation = 'flicker 0.5s infinite';
    } else {
        lampLight.style.animation = 'none';
    }
});

// Temperature Control
tempSlider.addEventListener('input', (e) => {
    temperature = e.target.value;
    tempValue.textContent = temperature;
});

// Lock Toggle
lockToggle.addEventListener('click', () => {
    isLocked = !isLocked;
    lockToggle.classList.toggle('locked');
    lockToggle.classList.toggle('unlocked');
    lockStatus.textContent = isLocked ? 'Locked' : 'Unlocked';
    lockToggle.innerHTML = `<i data-lucide="${isLocked ? 'lock' : 'unlock'}"></i>`;
    lucide.createIcons();
});

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        activeTab = tab;
        
        // Update active states
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Color Picker Functionality
function updateColor(color) {
    currentColor = color;
    colorValue.textContent = color;
    lampLight.style.background = color;
    document.documentElement.style.setProperty('--lamp-glow', color);
}

function getColorAtPosition(x, y) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const rect = colorPicker.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#FF0000');
    gradient.addColorStop(0.17, '#FF7F00');
    gradient.addColorStop(0.33, '#FFFF00');
    gradient.addColorStop(0.5, '#00FF00');
    gradient.addColorStop(0.67, '#0000FF');
    gradient.addColorStop(0.83, '#4B0082');
    gradient.addColorStop(1, '#8F00FF');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const pixelData = ctx.getImageData(x - rect.left, y - rect.top, 1, 1).data;
    return `#${[...pixelData].slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Color Picker Events
let isDragging = false;

colorPicker.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePointerPosition(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updatePointerPosition(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function updatePointerPosition(e) {
    const rect = colorPicker.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX, rect.left), rect.right);
    const y = Math.min(Math.max(e.clientY, rect.top), rect.bottom);
    
    colorPointer.style.left = `${x - rect.left}px`;
    colorPointer.style.top = `${y - rect.top}px`;
    
    const color = getColorAtPosition(x, y);
    updateColor(color);
}

// Color Presets
colorPresets.forEach(preset => {
    preset.addEventListener('click', () => {
        const color = preset.dataset.color;
        updateColor(color);
    });
});

// Add flicker animation
const style = document.createElement('style');
style.textContent = `
@keyframes flicker {
    0% { opacity: var(--base-opacity); }
    25% { opacity: calc(var(--base-opacity) * 0.8); }
    50% { opacity: var(--base-opacity); }
    75% { opacity: calc(var(--base-opacity) * 0.6); }
    100% { opacity: var(--base-opacity); }
}`;
document.head.appendChild(style);