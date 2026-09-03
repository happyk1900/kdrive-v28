// Tạo thẻ style chứa toàn bộ CSS của HUD và Nút Chat Thế Giới
const hudStyle = document.createElement('style');
hudStyle.innerHTML = `
    /* ========================================= */
    /* CSS CỦA HUD GỐC                           */
    /* ========================================= */
    .cyber-hud-container {
        position: fixed; top: 15px; left: 20px; right: 20px;
        display: flex; justify-content: space-between; align-items: flex-start;
        z-index: 9999999; pointer-events: none;
        font-family: 'Share Tech Mono', monospace; color: #00e5ff;
        text-shadow: 0 0 8px rgba(0,229,255,0.6);
    }
    .hud-left, .hud-right { display: flex; flex-direction: column; gap: 4px; }
    .hud-right { align-items: flex-end; text-align: right; }
    .hud-line { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; display: flex; align-items: center; gap: 6px; }
    .hud-gps { font-size: 8.5px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
    .signal-bars { display: flex; gap: 2px; align-items: flex-end; height: 10px; margin-right: 5px; }
    .bar { width: 3px; background: #00e5ff; animation: signalPulse 1.5s infinite; }
    .bar:nth-child(1) { height: 4px; animation-delay: 0s; }
    .bar:nth-child(2) { height: 7px; animation-delay: 0.2s; }
    .bar:nth-child(3) { height: 10px; animation-delay: 0.4s; }
    .bar:nth-child(4) { height: 7px; animation-delay: 0.6s; opacity: 0.3; }
    @keyframes signalPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; box-shadow: 0 0 8px #00e5ff; } }

    /* ========================================= */
    /* NÚT BẤM CHAT & KHUNG CHAT MỞ RỘNG         */
    /* ========================================= */
    
    .chat-toggle-btn {
        margin-top: 6px; 
        color: #ffd700; 
        font-family: 'Share Tech Mono', monospace;
        font-size: 10px; 
        font-weight: bold;
        letter-spacing: 1px;
        cursor: pointer;
        pointer-events: auto; 
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s ease;
    }
    .chat-toggle-btn:hover {
        text-shadow: 0 0 15px rgba(255, 215, 0, 1);
        transform: scale(1.05);
    }
    
    .chat-badge {
        background: #ff1493;
        color: #fff;
        border-radius: 50%;
        padding: 1px 4px;
        font-size: 8.5px;
        text-shadow: none;
        animation: pulseBadge 1.5s infinite;
    }
    @keyframes pulseBadge { 
        0%, 100% { opacity: 0.7; transform: scale(0.9); } 
        50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px #ff1493; } 
    }

    .world-chat-panel {
        position: fixed;
        right: 20px;
        top: 75px;
        width: 280px;
        height: 380px;
        background: rgba(5, 8, 15, 0.95);
        border: 1px solid rgba(0, 229, 255, 0.4);
        border-radius: 8px;
        z-index: 9999998;
        display: none; 
        flex-direction: column;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        pointer-events: auto;
    }
    .world-chat-panel.active {
        display: flex; 
        animation: slideInChat 0.3s cubic-bezier(0.25, 1, 0.3, 1);
    }
    @keyframes slideInChat {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }

    .chat-panel-header {
        border-bottom: 1px solid rgba(0, 229, 255, 0.2);
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 229, 255, 0.05);
        border-radius: 8px 8px 0 0;
    }
    .chat-panel-title {
        color: #fff;
        font-family: 'Montserrat', sans-serif;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1px;
    }
    .chat-close-btn {
        color: #ff1493;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
        font-size: 16px;
    }

    .chat-messages-area {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,229,255,0.3) transparent;
    }
    
    .chat-msg-line {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 11px;
        color: rgba(255,255,255,0.85);
        line-height: 1.4;
    }
    .chat-msg-line span {
        color: #00e5ff;
        font-weight: bold;
        margin-right: 5px;
    }

    .chat-input-area {
        display: flex; gap: 8px; padding: 10px;
        border-top: 1px solid rgba(0, 229, 255, 0.2);
        background: rgba(0, 229, 255, 0.05);
        border-radius: 0 0 8px 8px;
    }
    .chat-input-area input {
        flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(0,229,255,0.3);
        color: #fff; padding: 6px 10px; border-radius: 4px; outline: none;
        font-family: 'Space Grotesk', sans-serif; font-size: 11px;
    }
    .chat-input-area input:disabled {
        opacity: 0.5; cursor: not-allowed; border-color: rgba(255,255,255,0.1);
    }
    .chat-input-area button {
        background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff;
        color: #00e5ff; font-weight: bold; border-radius: 4px; padding: 0 12px;
        cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 11px;
        transition: 0.2s;
    }
    .chat-input-area button:disabled {
        background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.3); cursor: not-allowed;
    }
    .chat-input-area button:not(:disabled):hover {
        background: rgba(0, 229, 255, 0.4); color: #fff;
    }

    /* ========================================= */
    /* GPS PERMISSION MODAL (CYBERPUNK STYLE)    */
    /* ========================================= */
    .gps-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; height: 100dvh;
        background: rgba(2, 4, 8, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        z-index: 99999999; display: flex; justify-content: center; align-items: center;
        opacity: 0; visibility: hidden; transition: all 0.4s ease;
    }
    .gps-modal-overlay.active { opacity: 1; visibility: visible; }
    
    .gps-modal-box {
        width: 90%; max-width: 340px; background: rgba(8, 14, 26, 0.95);
        border: 1.5px solid #00e5ff; border-radius: 16px; padding: 25px 20px;
        display: flex; flex-direction: column; align-items: center; text-align: center;
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.1);
        transform: scale(0.9); transition: transform 0.3s ease;
    }
    .gps-modal-overlay.active .gps-modal-box { transform: scale(1); }
    
    .gps-icon-radar {
        font-size: 32px; margin-bottom: 12px;
        text-shadow: 0 0 15px #00e5ff;
        animation: radarPulse 2s infinite;
    }
    @keyframes radarPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.15); opacity: 1; text-shadow: 0 0 25px #ff007f; }
    }
    
    .gps-modal-title {
        color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 14px;
        font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;
        margin-bottom: 12px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
    }
    .gps-modal-desc {
        color: #d0f0ff; font-family: 'Space Grotesk', sans-serif; font-size: 12px;
        line-height: 1.6; margin-bottom: 22px; opacity: 0.9;
    }
    
    .gps-btn-group { display: flex; gap: 10px; width: 100%; }
    .gps-btn {
        flex: 1; padding: 12px 10px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
        font-size: 11px; font-weight: 800; text-transform: uppercase; cursor: pointer;
        transition: all 0.3s ease; letter-spacing: 1px;
    }
    .gps-btn-allow {
        background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; color: #00e5ff;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
    }
    .gps-btn-allow:hover {
        background: rgba(0, 229, 255, 0.4); color: #fff; box-shadow: 0 0 18px rgba(0, 229, 255, 0.5);
    }
    .gps-btn-deny {
        background: rgba(255, 0, 60, 0.15); border: 1px solid rgba(255, 0, 60, 0.6); color: #ff003c;
    }
    .gps-btn-deny:hover {
        background: rgba(255, 0, 60, 0.3); color: #fff; box-shadow: 0 0 15px rgba(255, 0, 60, 0.4);
    }
`;
document.head.appendChild(hudStyle);

// Tự động quét ngày tháng năm thực tế trên thiết bị
const today = new Date();
const yyyy = today.getFullYear(); 
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const realDate = `${yyyy}.${mm}.${dd}`;

// Quét Session xem người chơi đã đăng nhập thành công chưa
const isLogged = sessionStorage.getItem('kdrive_session') === 'active';
const userName = isLogged ? sessionStorage.getItem('kdrive_username') : 'GUEST';

// Cài đặt Placeholder và Khóa/Mở ô nhập liệu dựa theo trạng thái đăng nhập (Tiếng Anh toàn bộ)
const chatPlaceholder = isLogged ? "Type a message..." : "Not logged in";
const chatDisabled = isLogged ? "" : "disabled";

// Bơm cụm HTML (HUD + Nút Chat tiếng Anh + Bảng Chat + Modal GPS) vào body
const hudContainer = document.createElement('div');
hudContainer.innerHTML = `
    <!-- KHUNG HUD GỐC (HOÀN TOÀN TIẾNG ANH) -->
    <div class="cyber-hud-container" id="cyberHudBar">
        <div class="hud-left">
            <div class="hud-line">
                <div class="signal-bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
                SYS.ONLINE // ${yyyy}
            </div>
            <div class="hud-line" style="color: #ffffff;">USER: ${userName.toUpperCase()}</div>
            <div class="hud-gps" id="hudGpsCoord">GPS: INITIALIZING...</div>
        </div>
        <div class="hud-right">
            <div class="hud-line" style="letter-spacing: 3px;">K-DRIVE v2.6</div>
            <div class="hud-gps" style="color: #ffffff; font-family: 'Montserrat', sans-serif;">${realDate}</div>
            
            <!-- NÚT BẤM CHAT THẾ GIỚI (GLOBAL CHAT - TIẾNG ANH) -->
            <div class="chat-toggle-btn" id="btnToggleChat">
                GLOBAL CHAT <span class="chat-badge">9+</span>
            </div>
        </div>
    </div>

    <!-- BẢNG CHAT TOÀN CẦU -->
    <div class="world-chat-panel" id="worldChatPanel">
        <div class="chat-panel-header">
            <div class="chat-panel-title">⚡ GLOBAL COMM LINK</div>
            <div class="chat-close-btn" id="btnCloseChat">✖</div>
        </div>
        <div class="chat-messages-area" id="chatMessageArea">
            <div class="chat-msg-line"><span>[System]:</span> Welcome to the K-Drive Quantum Realm.</div>
            <div class="chat-msg-line"><span>Kai:</span> Core locked and loaded, ready for battle.</div>
            <div class="chat-msg-line"><span>Shadow:</span> Lazy players get ready to lose points haha.</div>
            <div class="chat-msg-line"><span>Viper:</span> Clean chat UI design right here.</div>
            <div class="chat-msg-line"><span>Ares:</span> Opening chat panel is way better than scrolling banners.</div>
        </div>
        
        <div class="chat-input-area">
            <input type="text" id="worldChatInput" placeholder="${chatPlaceholder}" ${chatDisabled}>
            <button id="worldChatSendBtn" ${chatDisabled}>SEND</button>
        </div>
    </div>

    <!-- GPS PERMISSION MODAL (XIN QUYỀN ĐỊNH VỊ BAN ĐẦU) -->
    <div class="gps-modal-overlay active" id="gpsModalOverlay">
        <div class="gps-modal-box">
            <div class="gps-icon-radar">🛰️</div>
            <div class="gps-modal-title">QUANTUM GPS PROTOCOL</div>
            <div class="gps-modal-desc">K-Drive system requires location access to synchronize real-world coordinates into the global arena HUD.</div>
            <div class="gps-btn-group">
                <button class="gps-btn gps-btn-deny" id="gpsBtnDeny">OFFLINE</button>
                <button class="gps-btn gps-btn-allow" id="gpsBtnAllow">ALLOW</button>
            </div>
        </div>
    </div>
`;
document.body.appendChild(hudContainer);

// Logic xử lý Bật / Tắt bảng Chat
document.getElementById('btnToggleChat').addEventListener('click', function() {
    const panel = document.getElementById('worldChatPanel');
    panel.classList.add('active');
    this.style.opacity = '0';
});

document.getElementById('btnCloseChat').addEventListener('click', function() {
    const panel = document.getElementById('worldChatPanel');
    panel.classList.remove('active');
    document.getElementById('btnToggleChat').style.opacity = '1';
});

// Logic xử lý Giao thức Xin quyền GPS
document.getElementById('gpsBtnAllow').addEventListener('click', function() {
    const gpsText = document.getElementById('hudGpsCoord');
    gpsText.textContent = "GPS: ACQUIRING...";
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                gpsText.textContent = `GPS: ${lat}°N, ${lon}°E`;
                closeGpsModal();
            },
            function(error) {
                gpsText.textContent = "GPS: SIGNAL ERROR";
                closeGpsModal();
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    } else {
        gpsText.textContent = "GPS: NOT SUPPORTED";
        closeGpsModal();
    }
});

document.getElementById('gpsBtnDeny').addEventListener('click', function() {
    document.getElementById('hudGpsCoord').textContent = "GPS: OFFLINE / UNAUTHORIZED";
    closeGpsModal();
});

function closeGpsModal() {
    const modal = document.getElementById('gpsModalOverlay');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 400);
}
