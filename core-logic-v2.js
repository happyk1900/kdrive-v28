function submitLogin() { 
    try { playCyberSound(); } catch(e) {} 
    var acc = document.getElementById('accInput').value.trim(); 
    var code = document.getElementById('passcodeInput').value.trim(); 
    var statusEl = document.getElementById('loginStatus'); 
    
    if(acc === "" || code === "") { 
        statusEl.innerHTML = "[LỖI]: ĐIỀN ĐỦ THÔNG TIN!"; 
        statusEl.style.color = "#ff3333"; 
        return; 
    } 
    
    statusEl.innerHTML = "🛰️ BOO ĐANG KIỂM TRA..."; 
    statusEl.style.color = "#00e5ff"; 
    
    callAPI('checkLogin', {username: acc, password: code}, 'cb_login', function(res) { 
        // CHỐT ĐỊNH DANH MỚI: ĐỒNG BỘ 2 CHIỀU SESSION & LOCAL
        sessionStorage.setItem('kdrive_session', 'active'); 
        sessionStorage.setItem('kdrive_username', acc); 
        localStorage.setItem('kdrive_logged_in_user', acc); // <-- ĐẢM BẢO TÊN HIỆN BÊN ĐIỆN THỜ
        currentUsername = acc; 
        
        document.getElementById('loginPanelContainer').style.display = 'none'; 
        unlockInteraction(); 
        loginDrumAudio.currentTime = 0; loginDrumAudio.play().catch(e=>{}); 
        if(navigator.vibrate) navigator.vibrate([200, 100, 200]); 
        isLoggedIn = true; triggerHexagonShield(); 
        let hud = document.getElementById('protocolGuide'); if(hud) hud.remove(); 
        document.getElementById('logoutHud').classList.add('logout-active'); 
        document.getElementById('cyberAltarBtn').classList.add('logged-in'); 
        let hIcon = document.getElementById('heartIcon'); hIcon.className = 'heart-icon active'; hIcon.innerHTML = "❤️"; 
        setInterval(() => { document.getElementById('bpmText').innerText = (95 + Math.floor(Math.random() * 15)) + " BPM"; }, 2000); 
        document.getElementById('mainWrapper').classList.add('shake-active'); 
        setTimeout(() => document.getElementById('mainWrapper').classList.remove('shake-active'), 600); 
        pulseTerminal("BOO: AUTHORIZED."); 
        
        const banner = document.getElementById('welcomeHologram'); 
        const tag = document.getElementById('welcomeTag'); 
        banner.style.border = `2px solid #00ff88`; 
        banner.style.boxShadow = `0 0 25px #00ff88, inset 0 0 15px rgba(0,0,0,0.5)`; 
        tag.style.color = "#00ff88"; tag.innerHTML = `[ 🥷 ${res.nickname || acc} ]`; 
        document.getElementById('welcomeBody').innerHTML = "Hệ thống BOO đã sẵn sàng nhận lệnh!"; 
        banner.classList.add('banner-strike'); 
        setTimeout(() => { banner.classList.remove('banner-strike'); initRelic(); spawnNeonRain(); }, 3500); 
    }, function(msg) { 
        statusEl.style.color = "#ff3333"; statusEl.innerHTML = msg; 
    }); 
}
