// ==========================================
// TRẠM CHỈ HUY: PHÂN LUỒNG 2 BỘ NÃO API
// ==========================================
// 1. Link xử lý Đăng Nhập / Tài khoản (Cổng An Ninh Cũ - GIỮ NGUYÊN)
const API_URL = "https://script.google.com/macros/s/AKfycby9__D-oax96p1GG7J3qBAPTWbHjKltEK8Csn3mDIx0L8vHLL3zyMNNundP30-97Xvs/exec";

// 2. Link xử lý Sổ Sinh Tử / Báo cáo (LINK ĐIỆN THỜ MỚI NHẤT)
const REPORT_API_URL = "https://script.google.com/macros/s/AKfycbwLW59QcyxNnk3riMqoTdTfNEfhKxFK1cdtUqVIwpGXYouBLVKW4u1UXwo9RJSzT7Yk/exec";

// ĐỌC ĐỊNH DANH TỪ LOCAL STORAGE ĐỂ GIỮ TÊN BẤT TỬ
let currentUsername = localStorage.getItem('kdrive_logged_in_user') || sessionStorage.getItem('kdrive_username') || 'guest';

function lockInteraction() { document.body.classList.add('popups-active'); }
function unlockInteraction() { document.body.classList.remove('popups-active'); }

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('kdrive_logged_in_user') || sessionStorage.getItem('kdrive_session') === 'active') {
        document.getElementById('loginPanelContainer').style.display = 'none';
        isLoggedIn = true; triggerHexagonShield();
        let hud = document.getElementById('protocolGuide'); if(hud) hud.remove();
        document.getElementById('logoutHud').classList.add('logout-active');
        document.getElementById('cyberAltarBtn').classList.add('logged-in');
        let hIcon = document.getElementById('heartIcon'); hIcon.className = 'heart-icon active'; hIcon.innerHTML = "❤️";
        setInterval(() => { 
            document.getElementById('bpmText').innerText = (95 + Math.floor(Math.random() * 15)) + " BPM"; 
        }, 2000);
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

function togglePass(inputId, iconEl) { 
    let inp = document.getElementById(inputId); 
    if(inp.type === 'password') { inp.type = 'text'; iconEl.innerHTML = EYE_CLOSED; } 
    else { inp.type = 'password'; iconEl.innerHTML = EYE_OPEN; } 
}

let overloadOsc = null; let overloadGain = null;
let initPinchDist = 0; let isPinching = false;
const base64Wallpapers = ["https://i.postimg.cc/J4xHjMr7/1.webp", "https://i.postimg.cc/fRbtKpyD/2.webp", "https://i.postimg.cc/13znH2XR/3.webp", "https://i.postimg.cc/8zCJH9cz/4.webp", "https://i.postimg.cc/K8YkNwjG/5.jpg", "https://i.postimg.cc/SxK2r3R8/6.webp", "https://i.postimg.cc/x1dJRh8R/7.webp"];
const musicTracks = ["https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Kai%20Ripe%20(1).mp3", "https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Kai%20Ripe%20(2).mp3"];
const neonColors = ['#00ff88', '#00e5ff', '#bf00ff', '#ffd700', '#ff3366'];

let currentWallpaperIndex = 0;
let isLoggedIn = false;
let loginDrumAudio = new Audio("https://github.com/happyk1900/-m-thanh-app/raw/refs/heads/main/0604.mp4");
let cameraShutterAudio = new Audio("https://www.myinstants.com/media/sounds/camera-shutter-click-01.mp3");
let bgAudio = new Audio();
bgAudio.loop = false; let currentTrackState = 0; let isMusicPlaying = false; let isMuted = false;

bgAudio.onended = function() { 
    if(!isMuted) { 
        currentTrackState = (currentTrackState % musicTracks.length) + 1; 
        bgAudio.src = musicTracks[currentTrackState - 1]; 
        bgAudio.play().catch(e=>{}); 
        updateAudioUI(currentTrackState);
    } 
};

function updateAudioUI(tNum) { 
    let color = neonColors[(tNum-1)%neonColors.length]; 
    document.getElementById('audioHud').className = 'audio-hud audio-active'; 
    document.getElementById('audioHud').style.setProperty('--neon-color', color);
    document.getElementById('trackText').innerHTML = `[ ▶️ TRK: ${(tNum<10?'0':'')+tNum} ]`; 
    document.getElementById('trackText').style.color = color; 
    document.getElementById('coreSystem').style.setProperty('--core-color', color); 
}

function cycleMusicTracks() { 
    playCyberSound();
    currentTrackState = (currentTrackState % musicTracks.length) + 1; 
    bgAudio.src = musicTracks[currentTrackState - 1]; 
    isMusicPlaying = true; isMuted = false; 
    bgAudio.play().catch(e=>{}); 
    updateAudioUI(currentTrackState);
}

function toggleMuteSystem() { 
    playCyberSound(); 
    if(!isMuted) { 
        isMuted = true; bgAudio.pause(); 
        document.getElementById('audioHud').className = 'audio-hud'; 
        document.getElementById('trackText').innerHTML = "[ 🔇 SYS: OFF ]";
        document.getElementById('trackText').style.color = "#ff3333"; 
    } else { 
        isMuted = false; bgAudio.play().catch(e=>{}); 
        updateAudioUI(currentTrackState); 
    } 
}

const AudioContext = window.AudioContext || window.webkitAudioContext; let actx;
function initAudio() { if(!actx) actx = new AudioContext(); if(actx.state==='suspended') actx.resume(); } 
document.body.addEventListener('touchstart', initAudio, {once:true});

function playCyberSound() { 
    try { 
        initAudio();
        const osc = actx.createOscillator(); const gain = actx.createGain(); 
        osc.connect(gain); gain.connect(actx.destination); 
        osc.type = 'triangle'; const now = actx.currentTime; 
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.12); 
        gain.gain.setValueAtTime(0.5, now); 
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15); 
        osc.start(now); osc.stop(now + 0.15);
    } catch(e){} 
}

function playCyberClick() { 
    if(!actx) initAudio(); 
    try { 
        const osc = actx.createOscillator(); const gain = actx.createGain(); 
        osc.connect(gain); gain.connect(actx.destination);
        osc.type = 'square'; const now = actx.currentTime; 
        osc.frequency.setValueAtTime(800, now); 
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05); 
        gain.gain.setValueAtTime(0.3, now); 
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); 
        osc.start(now);
        osc.stop(now + 0.05); 
    } catch(e){} 
}

function playOverloadRoar() { 
    if(!actx) initAudio(); 
    if(overloadOsc) return; 
    overloadOsc = actx.createOscillator(); overloadGain = actx.createGain();
    overloadOsc.type = 'sawtooth'; overloadOsc.frequency.setValueAtTime(50, actx.currentTime); 
    overloadOsc.frequency.linearRampToValueAtTime(130, actx.currentTime + 1.5); 
    overloadGain.gain.setValueAtTime(0, actx.currentTime); 
    overloadGain.gain.linearRampToValueAtTime(0.4, actx.currentTime + 0.3); 
    overloadOsc.connect(overloadGain); overloadGain.connect(actx.destination); 
    overloadOsc.start();
}

function stopOverloadRoar() { 
    if(overloadGain) { 
        overloadGain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.2); 
        setTimeout(() => { if(overloadOsc) { overloadOsc.stop(); overloadOsc = null; } overloadGain = null; }, 250);
    } 
}
function startBuzz() { } function stopBuzz() { } function playZapPop() { }

function spawnNeonRain() {
    if (!isLoggedIn) return;
    const container = document.getElementById('effectsContainer');
    if (!container) return;
    
    const suits = ['♠', '♥', '♣', '♦'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const redValues = ['A', 'K', 'Q', 'J']; 
    const chipColors = ['#ffd700', '#ff66b2', '#b026ff'];
    
    setInterval(() => {
        let el = document.createElement('div');
        let randObj = Math.random(); 

        if (randObj > 0.5) { 
            let suit = suits[Math.floor(Math.random() * suits.length)];
            let val = values[Math.floor(Math.random() * values.length)];
            el.className = 'neon-card-real';
            if (redValues.includes(val)) { 
                el.style.color = '#ff3366'; el.style.borderColor = 'rgba(255, 51, 102, 0.6)'; 
            } else { 
                el.style.color = '#00ff88'; el.style.borderColor = 'rgba(0, 255, 136, 0.6)'; 
            }
            el.innerHTML = `<span class="val">${val}</span><span class="suit">${suit}</span>`;
        } else if (randObj > 0.25) { 
            el.className = 'neon-dollar-real'; el.innerHTML = '<span>100</span>'; el.style.color = '#00ff00'; el.style.borderColor = 'rgba(0, 255, 0, 0.5)';
        } else { 
            el.className = 'neon-coin-real'; el.innerHTML = '<span>C</span>'; el.style.color = chipColors[Math.floor(Math.random() * chipColors.length)];
        }

        el.style.left = Math.random() * 90 + 5 + 'vw';
        el.style.top = Math.random() * 60 + 5 + 'vh'; 
        let scale = Math.random() * 0.7 + 0.6; el.style.setProperty('--drop-scale', scale);
        let duration = Math.random() * 3 + 4; el.style.setProperty('--max-opacity', (Math.random() * 0.4 + 0.5).toString());
        el.style.animation = `quantumMaterialize ${duration}s ease-in-out forwards`;
        container.appendChild(el);
        setTimeout(() => { if(el.parentNode) el.remove(); }, duration * 1000);
    }, 2500); 
}

const hexCanvas = document.getElementById('hexCanvas'); const hexCtx = hexCanvas.getContext('2d');
let hexGrid = []; let canvasW = 0, canvasH = 0;
function initHexGrid() { 
    hexCanvas.width = window.innerWidth; hexCanvas.height = window.innerHeight;
    canvasW = hexCanvas.width; canvasH = hexCanvas.height; hexGrid = []; 
    let r = 24; let h3 = Math.sqrt(3) * r;
    let cols = Math.ceil(canvasW / h3) + 1; let rows = Math.ceil(canvasH / (r*1.5)) + 1;
    for(let row=0; row<rows; row++) { 
        for(let col=0; col<cols; col++) { 
            hexGrid.push({x: col * h3 + (row%2===1 ? h3/2 : 0), y: row * r*1.5, energy: 0});
        } 
    } 
}
window.addEventListener('resize', initHexGrid); initHexGrid();

function renderCanvas() { 
    hexCtx.clearRect(0, 0, canvasW, canvasH); hexCtx.lineWidth = 1.2;
    let isStruggling = document.getElementById('cubeWrapper').classList.contains('overload-active'); 
    for(let hex of hexGrid) { 
        if(isLoggedIn && isStruggling && Math.hypot(hex.x - canvasW/2, hex.y - canvasH*0.516) < 120) hex.energy = Math.random() * 0.9;
        hex.energy *= 0.88; 
        let alpha = (isLoggedIn ? 0.12 : 0.03) + hex.energy; if(alpha>1) alpha=1; 
        let color = '0,255,136';
        if (isStruggling && hex.energy>0.1) color = '255,51,51'; 
        hexCtx.strokeStyle = `rgba(${color},${alpha})`; 
        hexCtx.fillStyle = alpha > 0.22 ? `rgba(${color},${(alpha-0.15)*0.3})` : 'transparent'; 
        hexCtx.beginPath();
        for (let i=0; i<6; i++) { 
            let a = Math.PI/180*(60*i-30); hexCtx.lineTo(hex.x + 20*Math.cos(a), hex.y + 20*Math.sin(a));
        } 
        hexCtx.closePath(); hexCtx.stroke(); 
        if(hexCtx.fillStyle!=='transparent') hexCtx.fill(); 
    } 
    requestAnimationFrame(renderCanvas); 
}
renderCanvas();

const cubeWrapperNode = document.getElementById('cubeWrapper');
cubeWrapperNode.addEventListener('touchstart', (e) => {
    if (!isLoggedIn) return;
    if (e.touches.length === 2) { isPinching = true; initPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }
}, {passive: false});

cubeWrapperNode.addEventListener('touchmove', (e) => {
    if (!isPinching || e.touches.length !== 2) return;
    e.preventDefault(); 
    let currDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    let scale = currDist / initPinchDist;
    if(scale < 1) scale = 1; if(scale > 2.5) scale = 2.5; 
    cubeWrapperNode.style.setProperty('--pinch-scale', scale);
    if(scale > 1.4 && !cubeWrapperNode.classList.contains('overload-active')) { cubeWrapperNode.classList.add('overload-active'); playOverloadRoar(); if(navigator.vibrate) navigator.vibrate([50, 50, 50, 50]); } 
    else if (scale > 1.4 && cubeWrapperNode.classList.contains('overload-active')) { if(navigator.vibrate && Math.random() > 0.8) navigator.vibrate(20); }
}, {passive: false});

cubeWrapperNode.addEventListener('touchend', (e) => {
    if (isPinching && e.touches.length < 2) {
        isPinching = false; cubeWrapperNode.style.setProperty('--pinch-scale', 1); cubeWrapperNode.classList.remove('overload-active');
        stopOverloadRoar(); if(navigator.vibrate) navigator.vibrate(0);
    }
});

function triggerHexagonShield() { 
    if(!isLoggedIn) return; 
    for(let hex of hexGrid) { 
        if(Math.hypot(hex.x - window.innerWidth/2, window.innerHeight*0.516) < 70) hex.energy = 0.6;
    } 
}

let relicEl = document.getElementById('lightningRelic'); let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
let targetRx = rx, targetRy = ry; let relicActive = false; let trailTimer = 0; let isRelicCharged = false;
function checkDailyEnergy() { return false; }

function initRelic() { 
    relicActive = true; relicEl.style.display = 'block'; isRelicCharged = checkDailyEnergy();
    if (!isRelicCharged) { relicEl.classList.add('relic-active'); relicEl.classList.remove('relic-passive'); startBuzz(); } 
    else { relicEl.classList.add('relic-passive'); relicEl.classList.remove('relic-active'); } 
    moveRelic();
}

function moveRelic() { 
    if(!relicActive || !isLoggedIn) return; 
    let dx = targetRx - rx;
    let dy = targetRy - ry; let dist = Math.hypot(dx, dy);
    if(dist < 50) { 
        targetRx = 40 + Math.random() * (window.innerWidth - 80);
        targetRy = 40 + Math.random() * (window.innerHeight - 80); 
    } 
    let speed = 0.003;
    rx += dx * speed; ry += dy * speed; 
    relicEl.style.left = rx + 'px'; relicEl.style.top = ry + 'px';
    trailTimer++; let trailFreq = isRelicCharged ? 8 : 4; 
    if(trailTimer % trailFreq === 0) { 
        let trail = document.createElement('div');
        trail.className = 'relic-trail'; trail.style.left = rx + 'px'; trail.style.top = ry + 'px';
        if (isRelicCharged) { 
            trail.style.boxShadow = '0 0 10px #00ff88, 0 0 20px #00a356'; trail.style.background = '#00ff88';
        } else { 
            trail.style.boxShadow = '0 0 10px #00e5ff, 0 0 25px #00e5ff';
            trail.style.background = '#ffffff'; 
        } 
        document.body.appendChild(trail); setTimeout(() => { if(trail.parentNode) trail.remove(); }, 800);
    } 
    requestAnimationFrame(moveRelic); 
}

function captureRelic() { 
    if(!relicActive) return; if(isMusicPlaying && !isMuted) bgAudio.pause();
    if (!isRelicCharged) { 
        let today = new Date().toLocaleDateString(); localStorage.setItem('lastCapturedDate_' + currentUsername, today); 
        isRelicCharged = true; stopBuzz(); playZapPop();
        if(navigator.vibrate) navigator.vibrate([100, 50, 200, 50, 100]); 
        let flash = document.getElementById('whiteFlash'); flash.style.display = 'block'; flash.style.opacity = '1';
        relicEl.style.transform = `translate(-50%, -50%) scale(5)`; relicEl.style.opacity = '0'; 
        setTimeout(() => { window.location.href = "nhap_the.html"; }, 350);
    } else { 
        if(navigator.vibrate) navigator.vibrate(50); relicEl.style.transform = `translate(-50%, -50%) scale(1.5)`; relicEl.style.opacity = '0';
        setTimeout(() => { window.location.href = "trai_huan_luyen.html"; }, 200); 
    } 
}

function callAPI(action, params, callbackName, onSuccess, onError) { 
    let finalUrl = API_URL + "?action=" + action;
    for (let key in params) { finalUrl += "&" + key + "=" + encodeURIComponent(params[key]); } 
    finalUrl += "&callback=" + callbackName;
    window[callbackName] = function(res) { 
        delete window[callbackName]; let scriptEl = document.getElementById(callbackName); 
        if(scriptEl) document.body.removeChild(scriptEl);
        if (res && res.success) onSuccess(res); else onError(res ? res.msg : "LỖI MÁY CHỦ!"); 
    }; 
    let script = document.createElement('script');
    script.id = callbackName; script.src = finalUrl; script.onerror = function() { onError("LỖI MẠNG!"); }; document.body.appendChild(script);
}

function submitLogin() { 
    try { playCyberSound(); } catch(e) {} 
    var acc = document.getElementById('accInput').value.trim(); var code = document.getElementById('passcodeInput').value.trim(); var statusEl = document.getElementById('loginStatus');
    if(acc === "" || code === "") { statusEl.innerHTML = "[LỖI]: ĐIỀN ĐỦ THÔNG TIN!"; statusEl.style.color = "#ff3333"; return; } 
    statusEl.innerHTML = "🛰️ BOO ĐANG KIỂM TRA..."; statusEl.style.color = "#00e5ff";
    callAPI('checkLogin', {username: acc, password: code}, 'cb_login', function(res) { 
        sessionStorage.setItem('kdrive_session', 'active'); sessionStorage.setItem('kdrive_username', acc); localStorage.setItem('kdrive_logged_in_user', acc); currentUsername = acc; 
        document.getElementById('loginPanelContainer').style.display = 'none'; unlockInteraction(); loginDrumAudio.currentTime = 0; loginDrumAudio.play().catch(e=>{}); if(navigator.vibrate) navigator.vibrate([200, 100, 200]); isLoggedIn = true; triggerHexagonShield(); 
        let hud = document.getElementById('protocolGuide'); if(hud) hud.remove(); document.getElementById('logoutHud').classList.add('logout-active'); document.getElementById('cyberAltarBtn').classList.add('logged-in'); let hIcon = document.getElementById('heartIcon'); hIcon.className = 'heart-icon active'; hIcon.innerHTML = "❤️"; setInterval(() => { document.getElementById('bpmText').innerText = (95 + Math.floor(Math.random() * 15)) + " BPM"; }, 2000); 
        document.getElementById('mainWrapper').classList.add('shake-active');
        setTimeout(() => document.getElementById('mainWrapper').classList.remove('shake-active'), 600); pulseTerminal("BOO: AUTHORIZED."); 
        const banner = document.getElementById('welcomeHologram'); const tag = document.getElementById('welcomeTag'); banner.style.border = `2px solid #00ff88`;
        banner.style.boxShadow = `0 0 25px #00ff88, inset 0 0 15px rgba(0,0,0,0.5)`; tag.style.color = "#00ff88"; tag.innerHTML = `[ 🥷 ${res.nickname || acc} ]`; document.getElementById('welcomeBody').innerHTML = "Hệ thống BOO đã sẵn sàng nhận lệnh!"; banner.classList.add('banner-strike');
        setTimeout(() => { banner.classList.remove('banner-strike'); initRelic(); spawnNeonRain(); }, 3500); 
    }, function(msg) { statusEl.style.color = "#ff3333"; statusEl.innerHTML = msg; });
}

function showLogoutConfirm() { 
    try { playCyberSound(); } catch(e){} 
    document.getElementById('logoutConfirmPanel').style.display = 'flex'; lockInteraction();
}
function confirmLogout(isYes) { 
    try { playCyberSound(); } catch(e){} 
    if(isYes) { 
        document.getElementById('logoutConfirmPanel').style.display = 'none'; pulseTerminal("BOO: LOGGING OUT..."); 
        sessionStorage.removeItem('kdrive_session'); sessionStorage.removeItem('kdrive_username'); localStorage.removeItem('kdrive_logged_in_user');
        setTimeout(() => { window.location.reload(); }, 500); 
    } else { 
        document.getElementById('logoutConfirmPanel').style.display = 'none'; unlockInteraction();
    } 
}
function submitChangePass() { }
function switchPanel(panelName) { 
    try { playCyberSound(); } catch(e){} 
    document.getElementById('panel-login').style.display = 'none'; document.getElementById('panel-register').style.display = 'none';
    document.getElementById('panel-otp').style.display = 'none'; document.getElementById('panel-forgot').style.display = 'none'; document.getElementById('panel-' + panelName).style.display = 'flex'; 
}
function pulseTerminal(text) { 
    const terminal = document.getElementById('terminalStream');
    const newLine = document.createElement('div'); newLine.className = 'terminal-line'; newLine.innerText = `> ${text}`; terminal.appendChild(newLine); if(terminal.children.length > 3) terminal.removeChild(terminal.firstChild);
}
setInterval(() => { pulseTerminal(isLoggedIn ? "BOO: SHIELD ACTIVE" : "AWAITING KAI RIPE..."); }, 4000);
function checkLoginGuard() { 
    if (!isLoggedIn) { 
        try { playCyberSound(); } catch(e){} 
        const warningEl = document.getElementById('hudGuardWarning');
        if(warningEl) { 
            warningEl.className = "hud-warning-text hud-warning-active"; warningEl.innerHTML = "[ ⚠️ BOO TỪ CHỐI LỆNH! ]";
            setTimeout(() => { warningEl.className = "hud-warning-text"; warningEl.innerHTML = ""; }, 2500); 
        } 
        return false; 
    } 
    return true;
}

let capturedVideoUrl = null; let hasUnreadVideo = false;
function openSecretCameraGuard(element) { 
    if (!checkLoginGuard()) return; if(navigator.vibrate) navigator.vibrate(50);
    playCyberClick(); try { cameraShutterAudio.play().catch(e=>{}); } catch(e){}
    let cube = document.getElementById('cubeWrapper'); cube.classList.remove('video-play-mode'); document.querySelector('.projector-beam').classList.remove('beam-on'); cube.classList.add('camera-rec-mode');
    setTimeout(() => { document.getElementById('hiddenCamera').click(); }, 600);
}
window.addEventListener('focus', () => { document.getElementById('cubeWrapper').classList.remove('camera-rec-mode'); });
function handleVideoUpload(event) { 
    const file = event.target.files[0];
    if (file) { capturedVideoUrl = URL.createObjectURL(file); document.getElementById('capturedVideoPlayer').src = capturedVideoUrl; hasUnreadVideo = true; triggerBubble(); } document.getElementById('cubeWrapper').classList.remove('camera-rec-mode');
}
function triggerBubble() { 
    if (!hasUnreadVideo) return; 
    const bubble = document.getElementById('samuraiBubble'); bubble.classList.add('bubble-show'); document.getElementById('bubbleText').innerHTML = "⚠️ MẬT THƯ ĐẾN";
}
function processSamuraiAction(element) { 
    if (!hasUnreadVideo || !capturedVideoUrl) { triggerHexagonShield(); if(navigator.vibrate) navigator.vibrate(50); return; } 
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]); try { playCyberSound(); } catch(e){}
    let cube = document.getElementById('cubeWrapper'); cube.classList.remove('camera-rec-mode'); cube.classList.add('video-play-mode'); document.querySelector('.projector-beam').classList.add('beam-on'); setTimeout(() => { document.getElementById('videoPopup').classList.add('popup-open'); document.getElementById('capturedVideoPlayer').play(); }, 600);
}
function closeVideoModule() { 
    document.getElementById('videoPopup').classList.remove('popup-open'); document.getElementById('capturedVideoPlayer').pause(); document.getElementById('cubeWrapper').classList.remove('video-play-mode'); document.querySelector('.projector-beam').classList.remove('beam-on'); 
}
function triggerStaticNode(element) { 
    if (!checkLoginGuard()) return; if(navigator.vibrate) navigator.vibrate([30]); playCyberClick(); let cube = document.getElementById('cubeWrapper');
    cube.classList.add('phantom-split'); setTimeout(() => { cube.classList.remove('phantom-split'); }, 600); 
}
function rotateWallpapersGuard(element) { 
    currentWallpaperIndex = (currentWallpaperIndex + 1) % base64Wallpapers.length; document.getElementById('kdriveBg').src = base64Wallpapers[currentWallpaperIndex];
}
function showLoginPanel() { document.getElementById('loginPanelContainer').style.display = 'flex'; lockInteraction(); }
function closeLoginPanel() { document.getElementById('loginPanelContainer').style.display = 'none'; unlockInteraction(); }
function showNinjaInfo() { document.getElementById('ninjaPopup').style.display = 'flex'; lockInteraction(); }
function closeNinjaInfo() { document.getElementById('ninjaPopup').style.display = 'none'; unlockInteraction(); }
function openChangePassPanel() { document.getElementById('changePassPanel').style.display = 'flex'; }
function closeChangePassPanel() { document.getElementById('changePassPanel').style.display = 'none'; }

// ===================================================
// K-DRIVE MODULE ĐỘC LẬP: SỔ SINH TỬ (REPORT DASHBOARD V-ULTIMATE)
// ===================================================

class ReportDashboard {
    constructor(username) {
        this.username = username;
        this.popupEl = null;
        this.hexInterval = null;
        this.meteorAnimFrame = null;
        this.reportData = null; 
        this.currentMode = 'weekly'; 
        this.animFrames = {};
    }

    renderHTML() {
        if (document.getElementById('reportPopup')) {
            document.getElementById('reportPopup').remove();
        }

        this.popupEl = document.createElement('div');
        this.popupEl.className = 'gateway-popup';
        this.popupEl.id = 'reportPopup';
        this.popupEl.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0; width: 92%; max-width: 380px; padding: 2.5px; border-radius: 12px; overflow: hidden; display: flex; z-index: 99999; background: #111; flex-direction: column;';
        
        this.popupEl.dashboardRef = this;
        const innerHTML = `
            <style>
                @keyframes sciCriticalPulse { 0% { box-shadow: 0 0 10px rgba(255, 51, 51, 0.5); border-color: rgba(255, 51, 51, 0.5); } 50% { box-shadow: 0 0 30px rgba(255, 51, 51, 1); border-color: rgba(255, 51, 51, 1); } 100% { box-shadow: 0 0 10px rgba(255, 51, 51, 0.5); border-color: rgba(255, 51, 51, 0.5); } }
                @keyframes sciWarningPulse { 0% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.3); border-color: rgba(255, 170, 0, 0.3); } 50% { box-shadow: 0 0 15px rgba(255, 170, 0, 0.8); border-color: rgba(255, 170, 0, 0.8); } 100% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.3); border-color: rgba(255, 170, 0, 0.3); } }
                .sci-critical { animation: sciCriticalPulse 0.8s infinite; background: rgba(50, 0, 0, 0.8) !important; color: #ff3333 !important; border: 1px solid #ff3333 !important; }
                .sci-warning { animation: sciWarningPulse 1.5s infinite; background: rgba(50, 30, 0, 0.8) !important; color: #ffaa00 !important; border: 1px dashed #ffaa00 !important; }
                
                @keyframes cyberGlitch {
                    0% { opacity: 1; transform: translate(0) skew(0deg); filter: drop-shadow(0 0 0px rgba(0,255,136,0)); }
                    20% { opacity: 0.8; transform: translate(-2px, 1px) skew(-2deg); filter: drop-shadow(-2px 0 0px rgba(255,51,51,0.8)); }
                    40% { opacity: 0.9; transform: translate(2px, -1px) skew(2deg); filter: drop-shadow(2px 0 0px rgba(0,229,255,0.8)); }
                    60% { opacity: 0.4; transform: translate(-1px, 2px) skew(0deg); }
                    80% { opacity: 1; transform: translate(1px, -2px) skew(1deg); }
                    100% { opacity: 1; transform: translate(0) skew(0deg); filter: drop-shadow(0 0 0px rgba(0,0,0,0)); }
                }
                .glitch-anim { animation: cyberGlitch 0.4s ease-out; }
                
                @keyframes goldSparkle {
                    0% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.2); transform: scale(1); }
                    50% { text-shadow: 0 0 35px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 255, 255, 0.8); color: #fff; transform: scale(1.05); }
                    100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.2); transform: scale(1); }
                }
                .sparkle-active { animation: goldSparkle 0.6s ease-out; }
            </style>
            
            <div class="led-spinner" id="repLedSpinner"></div>
            <div class="popup-inner-content" style="position: relative; z-index: 2; width: 100%; height: 100%; background: rgba(10,10,10,0.95); border-radius: 10px; padding: 15px 10px; box-sizing: border-box; display: flex; flex-direction: column;">
                <canvas id="reportHexCanvas" class="report-hex-bg" style="z-index: 0;"></canvas>
                <!-- Lưới đạn sao băng chiến thuật -->
                <canvas id="meteorCanvas" style="position: absolute; top:0; left:0; width:100%; height:100%; z-index: 1; pointer-events: none; border-radius: 10px;"></canvas>
          
                <div class="close-btn" id="repCloseBtn" style="position: absolute; top: 15px; right: 15px; width: 32px; height: 32px; z-index: 10; background: rgba(0,0,0,0.7); border: 1px solid #555; display: flex; align-items: center; justify-content: center; padding: 0; box-shadow: 0 0 10px rgba(0,0,0,0.5); border-radius: 50%; cursor: pointer;">
                    <svg viewBox="0 0 100 100" width="16" height="16" style="stroke: currentColor; fill: none; transition: transform 0.3s;" onmouseover="this.style.transform='rotate(90deg)'" onmouseout="this.style.transform='rotate(0deg)'">
                        <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z" stroke-width="5" />
                        <circle cx="50" cy="50" r="10" stroke-width="3" />
                    </svg>
                 </div>
                
                <div style="text-align: center; margin-top: 5px; margin-bottom: 10px; position: relative; z-index: 3;">
                    <div style="font-size: 11px; color: #d2d2d2; font-family: 'Share Tech Mono', monospace; letter-spacing: 2px;">[ HỒ SƠ CHIẾN BINH ]</div>
                    <div id="repAccountName" style="font-size: 22px; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.8); text-transform: uppercase;">${this.username}</div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 15px; position: relative; z-index: 3; background: rgba(0,0,0,0.6); padding: 4px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
                    <div id="tabWeekly" style="flex: 1; text-align: center; padding: 8px 0; background: #00e5ff; color: #000; box-shadow: 0 0 10px #00e5ff; font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;">[ TUẦN HIỆN TẠI ]</div>
                    <div id="tabAllTime" style="flex: 1; text-align: center; padding: 8px 0; background: transparent; color: #777; border: 1px solid #333; font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;">[ TOÀN CHIẾN DỊCH ]</div>
                </div>

                <div id="repDataContainer" style="position: relative; z-index: 3; width: 100%;">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <div id="repRankTitle" style="font-size: 20px; font-weight: 900; font-family: 'Space Grotesk', sans-serif; letter-spacing: 1px; color: #888;">ĐANG ĐO...</div>
                    </div>
                    
                    <div style="margin-bottom: 15px; padding: 0 10px; width: 100%; box-sizing: border-box; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #aaa; font-family: 'Share Tech Mono', monospace; margin-bottom: 6px;">
                            <span style="letter-spacing: 1px;">TỔNG <span class="itm-label" style="color: #ff33cc !important; font-weight: bold; text-shadow: 0 0 10px rgba(255, 51, 204, 0.5);">ITM</span> SINH TỒN</span>
                            <span id="repItmProgressText" style="font-weight: bold; color: #aaa; font-size: 13px;">0%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; box-shadow: inset 0 0 5px rgba(0,0,0,0.8); position: relative;">
                            <div style="position: absolute; left: 20%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.3); z-index: 2;"></div>
                            <div style="position: absolute; left: 35%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.3); z-index: 2;"></div>
                            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.3); z-index: 2;"></div>
                            <div id="repRankBar" style="height: 100%; width: 0%; background: #555; transition: width 1.5s ease-out, background 0.5s; position: relative; z-index: 1; border-radius: 4px;"></div>
                        </div>
                        <div style="display: flex; justify-content: center; margin-top: 6px;">
                            <div id="repNextRankHint" style="font-size: 10px; font-family: 'Space Grotesk', sans-serif; font-style: italic; color: #888; text-align: center;">Đang phân tích...</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-family: 'Share Tech Mono', monospace; background: rgba(0,0,0,0.5); padding: 10px 0; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center; flex: 1; border-right: 1px dashed rgba(255,255,255,0.2);">
                            <div style="font-size: 10px; color: #888; margin-bottom: 3px;">(SỐ MẠNG)</div>
                            <div id="repTotalMatches" style="font-size: 18px; color: #fff; font-weight: bold;">--</div>
                        </div>
                        <div style="text-align: center; flex: 1; border-right: 1px dashed rgba(255,255,255,0.2);">
                            <div style="font-size: 10px; color: #888; margin-bottom: 3px;">(SỐ NGÀY)</div>
                            <div id="repTotalDays" style="font-size: 18px; color: #fff; font-weight: bold;">--</div>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 10px; color: #888; margin-bottom: 3px;">THỜI LƯỢNG</div>
                            <div style="font-size: 18px; color: #fff; font-weight: bold;"><span id="repTotalDuration">--</span><span style="font-size:10px; color:#aaa;">h</span></div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
                        <div style="font-size: 11px; color: #aaa; margin-bottom: 5px; font-family: 'Share Tech Mono', monospace; letter-spacing: 1px;">LÃI RÒNG (NET PROFIT)</div>
                        <div id="repNetProfit" style="font-size: 32px; font-weight: bold; font-family: 'Space Grotesk', sans-serif; color: #888; transition: color 0.3s;">--</div>
                        <div style="margin-top: 8px; font-size: 12px; font-family: 'Share Tech Mono', monospace; letter-spacing: 1px;">
                            <span style="color:#777;">HIỆU SUẤT: </span><span id="repHourlyRate">--</span>
                        </div>
                    </div>
                </div>

                <div id="repBooQuote" style="text-align: center; font-size: 11px; font-family: 'Share Tech Mono', monospace; min-height: 15px; font-weight: bold; padding: 8px 10px; border-radius: 4px; transition: 0.3s; line-height: 1.4; position: relative; z-index: 3; color: #888;">
                    > BOO: ĐANG TRUY XUẤT TỪ ĐIỆN THỜ...
                </div>
            </div>
        `;
        this.popupEl.innerHTML = innerHTML;
        document.body.appendChild(this.popupEl);
        
        document.getElementById('repCloseBtn').addEventListener('click', () => this.close());
        
        document.getElementById('tabWeekly').addEventListener('click', () => { playCyberClick(); this.switchTab('weekly'); });
        document.getElementById('tabAllTime').addEventListener('click', () => { playCyberClick(); this.switchTab('allTime'); });
    }

    switchTab(mode) {
        if(this.currentMode === mode || !this.reportData) return;
        this.currentMode = mode;
        
        let tabW = document.getElementById('tabWeekly');
        let tabA = document.getElementById('tabAllTime');

        if (mode === 'weekly') {
            tabW.style.cssText = 'flex: 1; text-align: center; padding: 8px 0; background: #00e5ff; color: #000; box-shadow: 0 0 10px #00e5ff; font-family: "Share Tech Mono", monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;';
            tabA.style.cssText = 'flex: 1; text-align: center; padding: 8px 0; background: transparent; color: #777; border: 1px solid #333; font-family: "Share Tech Mono", monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;';
        } else {
            // Cập nhật tab TOÀN CHIẾN DỊCH thành màu Neon Amber (Cam)
            tabA.style.cssText = 'flex: 1; text-align: center; padding: 8px 0; background: #ffbf00; color: #000; box-shadow: 0 0 10px #ffbf00; font-family: "Share Tech Mono", monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;';
            tabW.style.cssText = 'flex: 1; text-align: center; padding: 8px 0; background: transparent; color: #777; border: 1px solid #333; font-family: "Share Tech Mono", monospace; font-size: 13px; font-weight: bold; border-radius: 2px; cursor: pointer; transition: 0.3s;';
        }
        
        const container = document.getElementById('repDataContainer');
        container.classList.remove('glitch-anim');
        void container.offsetWidth; 
        container.classList.add('glitch-anim');
        
        if(navigator.vibrate) navigator.vibrate([20, 20, 20]);
        this.renderData(mode);
        setTimeout(() => { container.classList.remove('glitch-anim'); }, 400);
    }

    drawHexGrid(colorRGB) {
        const canvas = document.getElementById('reportHexCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth || 380;
        canvas.height = canvas.offsetHeight || 400;
        
        let r = 20; let h3 = Math.sqrt(3) * r; 
        let cols = Math.ceil(canvas.width / h3) + 1; let rows = Math.ceil(canvas.height / (r*1.5)) + 1;
        
        let offset = 0;
        if(this.hexInterval) clearInterval(this.hexInterval);
        this.hexInterval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.lineWidth = 1; offset += 0.05;
            for(let row=0; row<rows; row++) { 
                for(let col=0; col<cols; col++) { 
                    let x = col * h3 + (row%2===1 ? h3/2 : 0); let y = row * r*1.5;
                    let alpha = 0.05 + Math.sin(x*0.05 + y*0.05 + offset) * 0.15; 
                    ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`; ctx.beginPath();
                    for (let i=0; i<6; i++) { let a = Math.PI/180*(60*i-30); ctx.lineTo(x + r*Math.cos(a), y + r*Math.sin(a)); }
                    ctx.closePath(); ctx.stroke();
                }
            }
        }, 50);
    }

    drawMeteors(xrayData) {
        const canvas = document.getElementById('meteorCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let meteors = [];
        
        const addMeteors = (amount, isProfit) => {
            let count = Math.abs(amount) > 0 ? 6 : 0; 
            for(let i=0; i<count; i++) {
                let y = Math.random() * canvas.height;
                let x = isProfit ? (Math.random() * -100) : (canvas.width + Math.random() * 100);
                let speed = Math.random() * 6 + 12;
                let vx = isProfit ? speed : -speed;
                let vy = (Math.random() - 0.5) * 5; 
                let color = isProfit ? '#00e5ff' : '#ffaa00'; 
                if (amount < -5000000) color = '#ff3333'; 
                meteors.push({x, y, vx, vy, len: Math.random()*40 + 20, color, life: 1.0});
            }
        };

        addMeteors(xrayData["DEEPSTACK"] || 0, (xrayData["DEEPSTACK"] || 0) > 0);
        addMeteors(xrayData["MULTIDAY"] || 0, (xrayData["MULTIDAY"] || 0) > 0);
        addMeteors(xrayData["DAILY"] || 0, (xrayData["DAILY"] || 0) > 0);

        if(this.meteorAnimFrame) cancelAnimationFrame(this.meteorAnimFrame);

        const animate = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            let active = false;
            for(let m of meteors) {
                if(m.life > 0) {
                    active = true;
                    m.x += m.vx; m.y += m.vy;
                    m.life -= 0.018; 
                    ctx.beginPath();
                    ctx.moveTo(m.x, m.y);
                    ctx.lineTo(m.x - m.vx*2, m.y - m.vy*2); 
                    ctx.strokeStyle = m.color;
                    ctx.globalAlpha = Math.max(0, m.life);
                    ctx.lineWidth = 1.5;
                    ctx.lineCap = "round";
                    ctx.stroke();
                }
            }
            if(active) {
                this.meteorAnimFrame = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0,0,canvas.width,canvas.height);
            }
        };
        animate();
    }

    animateValue(objId, start, end, duration, formatStr = '') {
        let obj = document.getElementById(objId);
        if (!obj) return;
        
        if (this.animFrames[objId]) window.cancelAnimationFrame(this.animFrames[objId]);
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            let currentVal = Math.floor(progress * (end - start) + start);
            let txt = currentVal;
            if (formatStr === 'money') { txt = (currentVal > 0 ? "+" : "") + currentVal.toLocaleString('en-US'); } 
            else if (formatStr === 'hourly') { txt = (currentVal > 0 ? "+" : "") + currentVal.toLocaleString('en-US') + "/ 1 giờ"; } 
            
            obj.innerText = txt;
            if (progress < 1) {
                this.animFrames[objId] = window.requestAnimationFrame(step);
            } else {
                let finalTxt = end;
                if (formatStr === 'money') { finalTxt = (end > 0 ? "+" : "") + end.toLocaleString('en-US'); } 
                else if (formatStr === 'hourly') { finalTxt = (end > 0 ? "+" : "") + end.toLocaleString('en-US') + "/ 1 giờ"; } 
                obj.innerText = finalTxt;
            }
        };
        this.animFrames[objId] = window.requestAnimationFrame(step);
    }

    formatMoneyShort(amount) {
        if (!amount) return "0";
        let sign = amount > 0 ? "+" : "";
        let m = amount / 1000000;
        let mStr = (m % 1 === 0) ? m.toString() : m.toFixed(1);
        return sign + mStr + "M";
    }

    renderData(mode) {
        if(!this.reportData) return;
        let data = this.reportData[mode];
        
        // SỐ MẠNG | SỐ NGÀY | THỜI LƯỢNG (Ép kiểu chống NaN tuyệt đối)
        this.animateValue('repTotalMatches', 0, data.matches || 0, 600);
        this.animateValue('repTotalDays', 0, data.days || 0, 600);
        this.animateValue('repTotalDuration', 0, Math.floor((data.duration || 0) / 60), 600); 
        
        // TÍNH ITM (%) VÀ RENDER THANH SINH TỒN
        // Ưu tiên tính ITM theo data.itmDays (nếu backend gửi về) hoặc tính từ số win/matches
        let itmPct = 0;
        if (typeof data.itmDays !== 'undefined') {
            itmPct = data.days > 0 ? Math.round((data.itmDays / data.days) * 100) : 0;
        } else {
            itmPct = data.matches > 0 ? Math.round((data.wins / data.matches) * 100) : 0;
        }

        this.animateValue('repItmProgressText', 0, itmPct, 600, 'percent');

        let profitVal = data.profit || 0;
        let hours = (data.duration || 0) / 60;
        let hourlyRate = hours > 0 ? Math.round(profitVal / hours) : 0;

        let hrRateEl = document.getElementById('repHourlyRate');
        if (hourlyRate > 0) { hrRateEl.style.color = "#00e5ff"; } else if (hourlyRate < 0) { hrRateEl.style.color = "#ff3333"; }
        this.animateValue('repHourlyRate', 0, hourlyRate, 600, 'hourly');
        
        let profitEl = document.getElementById('repNetProfit');
        if (profitVal > 0) { 
            profitEl.style.color = "#00e5ff"; profitEl.style.textShadow = "0 0 20px rgba(0, 229, 255, 0.7)";
        } else if (profitVal < 0) { 
            profitEl.style.color = "#ff3333"; profitEl.style.textShadow = "0 0 20px rgba(255, 51, 51, 0.7)"; 
        }
        this.animateValue('repNetProfit', 0, profitVal, 600, 'money');
        
        profitEl.classList.remove('sparkle-active');
        void profitEl.offsetWidth; 
        profitEl.classList.add('sparkle-active');
        
        let rankTitle = ""; let rankClass = ""; let rankColorRGB = ""; let hexColor = "";
        if (itmPct < 20) { 
            rankTitle = "TẬP SỰ"; rankClass = "rank-rookie"; rankColorRGB = "#a0a0a0"; hexColor = "160, 160, 160";
        } else if (itmPct < 35) { 
            rankTitle = "CHIẾN BINH"; rankClass = "rank-warrior"; rankColorRGB = "#00e5ff"; hexColor = "0, 229, 255";
        } else if (itmPct < 50) { 
            rankTitle = "THỦ LĨNH"; rankClass = "rank-leader"; rankColorRGB = "#bf00ff"; hexColor = "191, 0, 255";
        } else { 
            rankTitle = "HUYỀN THOẠI"; rankClass = "rank-legendary"; rankColorRGB = "#ffd700"; hexColor = "255, 215, 0"; 
        }

        let sciStatus = data.sci ? data.sci.status : "SAFE";
        let finalQuote = data.sci ? data.sci.command : "> BOO: PHONG ĐỘ ỔN ĐỊNH.";

        this.popupEl.classList.remove('rank-rookie', 'rank-warrior', 'rank-leader', 'rank-legendary');
        this.popupEl.classList.add(rankClass);
        
        let rankBar = document.getElementById('repRankBar');
        rankBar.style.width = Math.min(itmPct, 100) + "%";
        rankBar.style.background = rankColorRGB;
        rankBar.style.boxShadow = `0 0 10px rgba(${hexColor}, 0.8)`;
        
        document.getElementById('repItmProgressText').style.color = rankColorRGB;
        document.getElementById('repRankTitle').innerText = `ĐẲNG CẤP: [ ${rankTitle} ]`;
        document.getElementById('repRankTitle').style.color = rankColorRGB; 
        document.getElementById('repRankTitle').style.textShadow = `0 0 15px rgba(${hexColor}, 0.8)`;

        // THỂ LOẠI (THAY THẾ X-QUANG)
        let xray = data.xray || {};
        let deepStr = this.formatMoneyShort(xray["DEEPSTACK"]);
        let multiStr = this.formatMoneyShort(xray["MULTIDAY"]);
        let dailyStr = this.formatMoneyShort(xray["DAILY"]);
        let hintEl = document.getElementById('repNextRankHint');
        hintEl.innerHTML = `🎮 THỂ LOẠI: DEEP (${deepStr}) | MULTI (${multiStr}) | DAILY (${dailyStr})`;

        // KÍCH HOẠT MƯA SAO BĂNG CHIẾN THUẬT
        this.drawMeteors(xray);

        // BÓC TÁCH MÀU SẮC SCI BOX THEO CHIẾN LƯỢC MỚI CỦA BOO
        let quoteEl = document.getElementById('repBooQuote');
        let itmBarContainer = document.getElementById('repRankBar').parentElement;
        
        quoteEl.innerText = finalQuote;
        quoteEl.classList.remove('sci-critical', 'sci-warning');

        if (sciStatus === "CRITICAL") {
            quoteEl.classList.add('sci-critical');
            itmBarContainer.style.boxShadow = "0 0 15px rgba(255,51,51,0.8), inset 0 0 5px rgba(0,0,0,0.8)";
            itmBarContainer.style.border = "1px solid #ff3333";
        } else if (sciStatus === "WARNING") {
            quoteEl.classList.add('sci-warning');
            itmBarContainer.style.boxShadow = "0 0 10px rgba(255,170,0,0.5), inset 0 0 5px rgba(0,0,0,0.8)";
            itmBarContainer.style.border = "1px dashed #ffaa00";
        } else {
            quoteEl.style.color = rankColorRGB;
            quoteEl.style.border = "none";
            quoteEl.style.background = "transparent";
            itmBarContainer.style.boxShadow = "inset 0 0 5px rgba(0,0,0,0.8)";
            itmBarContainer.style.border = "none";
        }

        this.drawHexGrid(hexColor);
    }

    fetchAndPopulate() {
        this.drawHexGrid('136, 136, 136');
        let payload = { action: "report", account: this.username }; 
        fetch(REPORT_API_URL, { method: "POST", body: JSON.stringify(payload) })
        .then(res => res.json())
        .then(res => {
            if(res.status === "success") {
                this.reportData = res.data; 
                this.currentMode = 'weekly'; 
                this.renderData('weekly');
                pulseTerminal(`BOO: DỮ LIỆU ĐÃ ĐƯỢC CHUẨN Y.`);
            } else { document.getElementById('repNetProfit').innerText = "LỖI DỮ LIỆU"; }
        })
        .catch(err => { document.getElementById('repNetProfit').innerText = "MẤT KẾT NỐI ĐIỆN THỜ"; });
    }

    open() { this.renderHTML(); lockInteraction(); this.fetchAndPopulate(); }
    close() { 
        if(this.hexInterval) clearInterval(this.hexInterval);
        if(this.meteorAnimFrame) cancelAnimationFrame(this.meteorAnimFrame);
        for (let key in this.animFrames) { window.cancelAnimationFrame(this.animFrames[key]); }
        if(this.popupEl) { this.popupEl.remove(); this.popupEl = null; } unlockInteraction(); 
    }
}

function fetchBattleReport() {
    if (!checkLoginGuard()) return; 
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]);
    playCyberClick();
    pulseTerminal("BOO: ĐANG TRUY XUẤT DỮ LIỆU...");
    const dashboard = new ReportDashboard(currentUsername);
    dashboard.open();
}
