// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.display-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.target}-section`).classList.add('active');
    });
});

// Stopwatch Logic
let swStartTime;
let swElapsedTime = 0;
let swInterval;
let swRunning = false;
let lapCount = 1;

const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('sw-start');
const swPauseBtn = document.getElementById('sw-pause');
const swResetBtn = document.getElementById('sw-reset');
const swLapBtn = document.getElementById('sw-lap');
const lapsList = document.getElementById('laps-list');

function formatTime(ms) {
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let centiseconds = Math.floor((ms % 1000) / 10);

    return (
        (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + 
        `<span class="ms">.${String(centiseconds).padStart(2, '0')}</span>`
    );
}

function updateStopwatch() {
    const now = Date.now();
    swElapsedTime = now - swStartTime;
    swDisplay.innerHTML = formatTime(swElapsedTime);
}

swStartBtn.addEventListener('click', () => {
    if (!swRunning) {
        swStartTime = Date.now() - swElapsedTime;
        swInterval = setInterval(updateStopwatch, 10);
        swRunning = true;
        swStartBtn.disabled = true;
        swPauseBtn.disabled = false;
    }
});

swPauseBtn.addEventListener('click', () => {
    if (swRunning) {
        clearInterval(swInterval);
        swRunning = false;
        swStartBtn.disabled = false;
        swPauseBtn.disabled = true;
    }
});

swResetBtn.addEventListener('click', () => {
    clearInterval(swInterval);
    swRunning = false;
    swElapsedTime = 0;
    swDisplay.innerHTML = '00:00:00<span class="ms">.00</span>';
    swStartBtn.disabled = false;
    swPauseBtn.disabled = true;
    lapsList.innerHTML = '';
    lapCount = 1;
});

swLapBtn.addEventListener('click', () => {
    if (swRunning || swElapsedTime > 0) {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `<span>Lap ${lapCount++}</span><span>${swDisplay.innerHTML}</span>`;
        lapsList.prepend(lapItem);
    }
});

// Timer Logic
let timerInterval;
let timerTimeLeft = 0;
let timerRunning = false;

const tStartBtn = document.getElementById('t-start');
const tPauseBtn = document.getElementById('t-pause');
const tResetBtn = document.getElementById('t-reset');
const tDisplay = document.getElementById('timer-display');
const tInputGroup = document.getElementById('timer-input-group');
const tHoursInput = document.getElementById('t-hours');
const tMinsInput = document.getElementById('t-minutes');
const tSecsInput = document.getElementById('t-seconds');

function formatTimer(ms) {
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimer() {
    if (timerTimeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        alert("Time's up!");
        resetTimerUI();
        return;
    }
    timerTimeLeft -= 1000;
    tDisplay.textContent = formatTimer(timerTimeLeft);
}

function resetTimerUI() {
    clearInterval(timerInterval);
    timerRunning = false;
    tDisplay.classList.add('hidden');
    tInputGroup.classList.remove('hidden');
    tStartBtn.disabled = false;
    tPauseBtn.disabled = true;
    tDisplay.textContent = '00:00:00';
}

tStartBtn.addEventListener('click', () => {
    if (!timerRunning) {
        if (timerTimeLeft === 0) {
            const h = parseInt(tHoursInput.value) || 0;
            const m = parseInt(tMinsInput.value) || 0;
            const s = parseInt(tSecsInput.value) || 0;
            timerTimeLeft = (h * 3600 + m * 60 + s) * 1000;
        }

        if (timerTimeLeft > 0) {
            tDisplay.textContent = formatTimer(timerTimeLeft);
            tDisplay.classList.remove('hidden');
            tInputGroup.classList.add('hidden');
            
            timerInterval = setInterval(updateTimer, 1000);
            timerRunning = true;
            tStartBtn.disabled = true;
            tPauseBtn.disabled = false;
        }
    }
});

tPauseBtn.addEventListener('click', () => {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        tStartBtn.disabled = false;
        tPauseBtn.disabled = true;
    }
});

tResetBtn.addEventListener('click', () => {
    timerTimeLeft = 0;
    resetTimerUI();
    tHoursInput.value = '';
    tMinsInput.value = '';
    tSecsInput.value = '';
});