(function() {
    // 1. Tự động nạp Google Fonts và CSS chuẩn của HUD mẫu cũ
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* THANH HUD HỆ THỐNG CỐ ĐỊNH TỐI CAO */
            .hud-top-bar {
                position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 50px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 15px !important;
                background: linear-gradient(to bottom, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 70%, rgba(3,5,8,0) 100%) !important;
                z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10.5px !important; color: #00e5ff !important; letter-spacing: 1.5px !important;
                pointer-events: auto !important;
            }
            .hud-left, .hud-right { display: flex; flex-direction: column; gap: 2px; }
            .hud-right { text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 6px; }
            .hud-sys-online { 
                color: #00ff66; 
                font-weight: 900; 
                text-shadow: 0 0 10px rgba(0,255,102,0.8), 0 0 20px rgba(0,255,102,0.4); 
                animation: textWaveGlow 2.5s infinite alternate ease-in-out;
            }
            .hud-gps { 
                color: #ff007f; 
                font-weight: 700; 
                text-shadow: 0 0 8px rgba(255,0,127,0.7); 
            }
            .hud-chat-badge { 
                color: #ffd700; 
                font-weight: 900; 
                text-shadow: 0 0 10px rgba(255,215,0,0.8); 
                cursor: pointer; 
                animation: badgePulse 2s infinite alternate ease-in-out;
            }

            /* BỘ CỘT SÓNG NHẤP NHÁY (SIGNAL BARS) */
            .signal-bars {
                display: flex;
                align-items: flex-end;
                gap: 2px;
                height: 10px;
            }
            .signal-bar {
                width: 2.5px;
                background-color: #00ff66;
                box-shadow: 0 0 6px rgba(0,255,102,0.8);
                animation: signalPulse 1.2s infinite ease-in-out alternate;
            }
            .signal-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
            .signal-bar:nth-child(2) { height: 7px; animation-delay: 0.3s; }
            .signal-bar:nth-child(3) { height: 10px; animation-delay: 0.6s; }

            @keyframes signalPulse {
                0% { opacity: 0.3; transform: scaleY(0.6); }
                100% { opacity: 1; transform: scaleY(1); }
            }

            @keyframes textWaveGlow {
                0% { text-shadow: 0 0 6px rgba(0,255,102,0.5), 0 0 12px rgba(0,255,102,0.2); transform: scale(1); }
                50% { text-shadow: 0 0 15px rgba(0,255,102,1), 0 0 30px rgba(0,255,102,0.6); transform: scale(1.02); }
                100% { text-shadow: 0 0 6px rgba(0,255,102,0.5), 0 0 12px rgba(0,255,102,0.2); transform: scale(1); }
            }

            @keyframes badgePulse {
                0% { opacity: 0.8; text-shadow: 0 0 6px rgba(255,215,0,0.5); }
                100% { opacity: 1; text-shadow: 0 0 16px rgba(255,215,0,1); }
            }

            /* HỘP THOẠI XIN QUYỀN GPS SONG NGỮ VIỆT - ANH */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(15px);
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .gps-modal-box {
                width: 90%; max-width: 340px; background: rgba(5, 12, 22, 0.95);
                border: 1.5px solid #ff007f; border-radius: 16px; padding: 22px 18px;
                text-align: center; box-shadow: 0 0 35px rgba(255, 0, 127, 0.4);
            }
            .gps-modal-title {
                color: #ff007f; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;
                text-shadow: 0 0 10px rgba(255, 0, 127, 0.8);
            }
            .gps-modal-desc { 
                color: #d0f0ff; font-size: 11.5px; line-height: 1.5; margin-bottom: 20px; 
                font-family: 'Space Grotesk', sans-serif; text-align: left; 
                background: rgba(0,229,255,0.05); padding: 10px; border-radius: 8px; border-left: 2px solid #00e5ff;
            }
            .gps-modal-desc p { margin-bottom: 6px; }
            .gps-modal-desc p:last-child { margin-bottom: 0; opacity: 0.85; font-style: italic; }
            
            .gps-btn-row { display: flex; gap: 10px; justify-content: center; }
            .gps-action-btn {
                flex: 1; padding: 12px 8px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
                font-size: 10.5px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
            }
            .gps-btn-allow { background: rgba(0, 229, 255, 0.2); border: 1.5px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 12px rgba(0, 229, 255, 0.3); }
            .gps-btn-deny { background: rgba(255, 0, 60, 0.15); border: 1.5px solid rgba(255, 0, 60, 0.6); color: #ff3333; }
        `;
        document.head.appendChild(style);
    }

    // 2. Tự động chèn khung HUD và Modal GPS vào đầu trang khi tải xong
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('kdriveGlobalHud')) return;

        const container = document.createElement('div');
        container.id = 'kdriveGlobalHud';
        container.innerHTML = `
            <div class="hud-top-bar">
                <div class="hud-left">
                    <div class="hud-sys-row">
                        <div class="signal-bars">
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                        </div>
                        <span class="hud-sys-online" id="hudSysText">SYS.ONLINE</span>
                    </div>
                    <span style="color: #fff;" id="hudUserText">USER: GUEST</span>
                    <span class="hud-gps" id="hudGpsText">GPS: OFFLINE / UNAUTHORIZED</span>
                </div>
                <div class="hud-right">
                    <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-box">
                    <div class="gps-modal-title">🛰️ XÁC THỰC GPS / GPS VERIFICATION</div>
                    <div class="gps-modal-desc">
                        <p>🇻🇳 Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.</p>
                        <p>🇬🇧 System requires location access to synchronize global Quantum Arena mapping.</p>
                    </div>
                    <div class="gps-btn-row">
                        <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn">TỪ CHỐI / DENY</button>
                        <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn">ĐỒNG Ý / ACCEPT</button>
                    </div>
                </div>
            </div>
        `;
        document.body.prepend(container);

        function playClickSound() {
            try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
        }

        const username = sessionStorage.getItem('kdrive_username');
        if (username) {
            const userEl = document.getElementById('hudUserText');
            if (userEl) userEl.textContent = `USER: ${username.toUpperCase()}`;
        }

        const chatBadge = document.getElementById('hudChatText');
        if (chatBadge) {
            chatBadge.addEventListener('click', () => {
                playClickSound();
                alert("Mở kênh Global Chat lượng tử.");
            });
        }

        // Kiểm tra GPS dựa trên sessionStorage (mỗi khi vào lại app / login sẽ hỏi lại từ đầu)
        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        const gpsText = document.getElementById('hudGpsText');
        const modalOverlay = document.getElementById('gpsModalOverlay');

        if (gpsVerified === 'true') {
            const cachedLat = sessionStorage.getItem('kdrive_gps_lat');
            const cachedLon = sessionStorage.getItem('kdrive_gps_lon');
            if (cachedLat && cachedLon) {
                gpsText.textContent = `GPS: ${Number(cachedLat).toFixed(2)}N, ${Number(cachedLon).toFixed(2)}E`;
                gpsText.style.color = "#00e5ff";
            } else {
                gpsText.textContent = "GPS: SYNCHRONIZED";
                gpsText.style.color = "#00e5ff";
            }
        } else if (gpsVerified === 'false') {
            gpsText.textContent = "GPS: OFFLINE";
            gpsText.style.color = "#ff3333";
        } else {
            if (modalOverlay) modalOverlay.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => handleGpsResponse(true));
        document.getElementById('gpsDenyBtn').addEventListener('click', () => handleGpsResponse(false));

        function handleGpsResponse(isAllowed) {
            playClickSound();
            if (modalOverlay) modalOverlay.classList.remove('active');

            if (isAllowed && navigator.geolocation) {
                gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        sessionStorage.setItem('kdrive_gps_verified', 'true');
                        sessionStorage.setItem('kdrive_gps_lat', lat);
                        sessionStorage.setItem('kdrive_gps_lon', lon);

                        gpsText.textContent = `GPS: ${lat.toFixed(2)}N, ${lon.toFixed(2)}E`;
                        gpsText.style.color = "#00e5ff";
                    },
                    () => {
                        sessionStorage.setItem('kdrive_gps_verified', 'false');
                        gpsText.textContent = "GPS: OFFLINE";
                        gpsText.style.color = "#ff3333";
                    },
                    { timeout: 5000 }
                );
            } else {
                sessionStorage.setItem('kdrive_gps_verified', 'false');
                gpsText.textContent = "GPS: OFFLINE";
                gpsText.style.color = "#ff3333";
            }
        }
    });
})();
