// ================= MODULE HUD & GIAO THỨC KHỞI ĐỘNG K-DRIVE =================
(function() {
    // 1. Tiêm CSS giao diện toàn cục vào trang
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
        
        /* THANH HUD HỆ THỐNG CỐ ĐỊNH TỐI CAO */
        .hud-top-bar {
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 50px !important;
            display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 15px !important;
            background: linear-gradient(to bottom, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 70%, rgba(3,5,8,0) 100%) !important;
            z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
            visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;
        }
        .hud-left, .hud-right { display: flex; flex-direction: column; gap: 2px; }
        .hud-right { text-align: right; color: rgba(255,255,255,0.85); }
        .hud-sys-online { color: #00e5ff; font-weight: 700; text-shadow: 0 0 8px rgba(0,229,255,0.6); }
        .hud-gps { color: #ff007f; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.6); }
        .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.6); cursor: pointer; }

        /* MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (QUẢ CẦU 3D) */
        #globalLangScreen {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: radial-gradient(circle at center, #0a1128 0%, #030508 85%);
            z-index: 2147483646; display: flex; flex-direction: column; justify-content: center; align-items: center;
            opacity: 1 !important; visibility: visible !important; transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .global-globe-container {
            position: relative; width: 220px; height: 220px; border-radius: 50%;
            border: 2px dashed rgba(0, 229, 255, 0.5); box-shadow: 0 0 50px rgba(0, 229, 255, 0.3), inset 0 0 35px rgba(0, 229, 255, 0.2);
            display: flex; justify-content: center; align-items: center; animation: globeRotate 15s linear infinite;
            margin-bottom: 25px; background: radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%);
        }
        @keyframes globeRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .globe-core-icon {
            position: absolute; font-size: 50px; animation: globeRotateReverse 15s linear infinite;
            text-shadow: 0 0 25px #00e5ff;
        }
        @keyframes globeRotateReverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        .global-title {
            color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 20px; text-align: center;
            text-shadow: 0 0 12px rgba(255,215,0,0.8);
        }
        .lang-grid-nodes {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 88%; max-width: 320px;
            z-index: 2;
        }
        .lang-node-btn {
            background: rgba(10, 20, 35, 0.9); backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 229, 255, 0.6); border-radius: 10px; padding: 12px 6px;
            text-align: center; cursor: pointer; color: #ffffff; font-family: 'Montserrat', sans-serif;
            font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
            box-shadow: 0 0 12px rgba(0, 229, 255, 0.25); transition: all 0.3s; pointer-events: auto;
        }
        .lang-node-btn:hover, .lang-node-btn:active {
            background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 20px #00e5ff;
            transform: scale(1.05);
        }

        /* HỘP THOẠI XIN QUYỀN GPS */
        .gps-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(15px);
            z-index: 2147483645; display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
        }
        .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .gps-modal-box {
            width: 90%; max-width: 340px; background: rgba(5, 12, 22, 0.95);
            border: 1.5px solid #ff007f; border-radius: 16px; padding: 25px 20px;
            text-align: center; box-shadow: 0 0 35px rgba(255, 0, 127, 0.4);
        }
        .gps-modal-title {
            color: #ff007f; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;
            text-shadow: 0 0 10px rgba(255, 0, 127, 0.8);
        }
        .gps-modal-desc {
            color: #d0f0ff; font-size: 12px; line-height: 1.6; margin-bottom: 25px; font-family: 'Space Grotesk', sans-serif;
        }
        .gps-btn-row { display: flex; gap: 10px; justify-content: center; }
        .gps-action-btn {
            flex: 1; padding: 12px 10px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
            font-size: 11px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
        }
        .gps-btn-allow {
            background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; color: #00e5ff;
            box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
        }
        .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.4); box-shadow: 0 0 20px #00e5ff; }
        .gps-btn-deny {
            background: rgba(255, 0, 60, 0.15); border: 1px solid rgba(255, 0, 60, 0.6); color: #ff3333;
        }
        .gps-btn-deny:hover { background: rgba(255, 0, 60, 0.3); box-shadow: 0 0 15px #ff003c; }
    `;
    document.head.appendChild(styleEl);

    // 2. Chèn cấu trúc HTML của HUD, Quả cầu chọn ngôn ngữ và Hộp GPS vào DOM nếu chưa có
    const hudContainer = document.createElement('div');
    hudContainer.innerHTML = `
        <!-- THANH HUD TRẠNG THÁI HỆ THỐNG -->
        <div class="hud-top-bar" id="mainHudBar">
            <div class="hud-left">
                <span class="hud-sys-online" id="hudSysText">SYS.ONLINE // 2026</span>
                <span style="color: #fff;" id="hudUserText">USER: GUEST</span>
                <span class="hud-gps" id="hudGpsText">GPS: OFFLINE / UNAUTHORIZED</span>
            </div>
            <div class="hud-right">
                <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.04</span>
                <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
            </div>
        </div>

        <!-- MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (QUẢ CẦU 3D) -->
        <div id="globalLangScreen">
            <div class="global-globe-container">
                <div class="globe-core-icon">🌐</div>
            </div>
            <div class="global-title" id="globalTitleText">CHỌN MẠNG LƯỚI NGÔN NGỮ</div>
            <div class="lang-grid-nodes">
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('vi')">TIẾNG VIỆT</div>
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('en')">ENGLISH</div>
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('jp')">日本語</div>
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('kr')">한국어</div>
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('cn')">中文</div>
                <div class="lang-node-btn" onclick="window.KDriveHUD.selectLanguage('fr')">FRANÇAIS</div>
            </div>
        </div>

        <!-- HỘP THOẠI XIN QUYỀN GPS -->
        <div class="gps-modal-overlay" id="gpsModalOverlay">
            <div class="gps-modal-box">
                <div class="gps-modal-title" id="gpsModalTitle">🛰️ XÁC THỰC TỌA ĐỘ GPS</div>
                <div class="gps-modal-desc" id="gpsModalDesc">Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu. Dữ liệu được mã hóa bảo mật tuyệt đối.</div>
                <div class="gps-btn-row">
                    <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn" onclick="window.KDriveHUD.handleGps(false)">TỪ CHỐI</button>
                    <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn" onclick="window.KDriveHUD.handleGps(true)">ĐỒNG Ý</button>
                </div>
            </div>
        </div>
    `;
    document.body.prepend(hudContainer);

    // 3. Khởi tạo các hàm điều khiển toàn cục cho HUD
    window.KDriveHUD = {
        selectLanguage: function(lang) {
            try {
                const snd = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
                snd.volume = 0.5;
                snd.play().catch(e => {});
            } catch(err) {}

            const langScreen = document.getElementById('globalLangScreen');
            if(langScreen) {
                langScreen.style.transform = "scale(1.2)";
                langScreen.style.opacity = "0";
                setTimeout(() => {
                    langScreen.style.display = 'none';
                    // Bật hộp GPS sau khi chọn xong ngôn ngữ
                    const gpsModal = document.getElementById('gpsModalOverlay');
                    if(gpsModal) gpsModal.classList.add('active');
                }, 800);
            }
        },

        handleGps: function(isAllowed) {
            try {
                const snd = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
                snd.volume = 0.5;
                snd.play().catch(e => {});
            } catch(err) {}

            const gpsText = document.getElementById('hudGpsText');
            const gpsModal = document.getElementById('gpsModalOverlay');
            if(gpsModal) gpsModal.classList.remove('active');

            if(isAllowed && navigator.geolocation) {
                if(gpsText) gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let lat = position.coords.latitude.toFixed(2);
                        let lon = position.coords.longitude.toFixed(2);
                        if(gpsText) {
                            gpsText.textContent = `GPS: ${lat}N, ${lon}E`;
                            gpsText.style.color = "#00e5ff";
                        }
                    },
                    (error) => {
                        if(gpsText) {
                            gpsText.textContent = "GPS: OFFLINE";
                            gpsText.style.color = "#ff3333";
                        }
                    },
                    { timeout: 5000 }
                );
            } else {
                if(gpsText) {
                    gpsText.textContent = "GPS: OFFLINE";
                    gpsText.style.color = "#ff3333";
                }
            }
        }
    };
})();
