const API_URL = "https://script.google.com/macros/s/AKfycby9__D-oax96p1GG7J3qBAPTWbHjKltEK8Csn3mDIx0L8vHLL3zyMNNundP30-97Xvs/exec";

// 1. ĐỌC ĐỊNH DANH TỪ LOCAL STORAGE ĐỂ GIỮ TÊN BẤT TỬ
let currentUsername = localStorage.getItem('kdrive_logged_in_user') || sessionStorage.getItem('kdrive_username') || 'guest';

function lockInteraction() { document.body.classList.add('popups-active'); }
function unlockInteraction() { document.body.classList.remove('popups-active'); }

window.addEventListener('DOMContentLoaded', () => {
    // 2. PHỤC HỒI PHIÊN TỪ LOCAL STORAGE
    if (localStorage.getItem('kdrive_logged_in_user') || sessionStorage.getItem('kdrive_session') === 'active') {
        document.getElementById('loginPanelContainer').style.display = 'none';
        isLoggedIn = true; triggerHexagonShield();
        let hud = document.getElementById('protocolGuide'); if(hud) hud.remove();
        document.getElementById('logoutHud').classList.add('logout-active');
        document.getElementById('cyberAltarBtn').classList.add('logged-in');
        let hIcon = document.getElementById('heartIcon'); hIcon.className = 'heart-icon active'; hIcon.innerHTML = "❤️";
        setInterval(() => { document.getElementById('bpmText').innerText = (95 + Math.floor(Math.random() * 15)) + " BPM"; }, 2000);
        pulseTerminal("BOO: SESSION RESTORED.");
        initRelic();
        spawnNeonRain(); 
    }
});

function isValidUsername(str) { return /^[a-zA-Z0-9]{6,15}$/.test(str); }
function isValidPassword(str) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(str); }
function validateLive(type) { }

const EYE_OPEN = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const EYE_CLOSED = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
function togglePass(inputId, iconEl) { let inp = document.getElementById(inputId); if(inp.type === 'password') { inp.type = 'text'; iconEl.innerHTML = EYE_CLOSED; } else { inp.type = 'password'; iconEl.innerHTML = EYE_OPEN; } }

let overloadOsc = null; let overloadGain = null;
let initPinchDist = 0; let isPinching = false;
const base64Wallpapers = ["https://i.postimg.cc/J4xHjMr7/1.webp", "https://i.postimg.cc/fRbtKpyD/2.webp", "https://i.postimg.cc/13znH2XR/3.webp", "https://i.postimg.cc/8zCJH9cz/4.webp", "https://i.postimg.cc/K8YkNwjG/5.jpg", "https://i.postimg.cc/SxK2r3R8/6.webp", "https://i.postimg.cc/x1dJRh8R/7.webp"];
const musicTracks = ["https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Kai%20Ripe%20(1).mp3", "https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Kai%20Ripe%20(2).mp3"];
const
