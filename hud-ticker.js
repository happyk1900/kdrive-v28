<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>K-Drive: Giao Thức Lượng Tử Toàn Cầu</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
        body { background-color: #030508; height: 100vh; height: 100dvh; width: 100vw; display: flex; justify-content: center; align-items: center; margin: 0; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }

        /* THANH HUD HỆ THỐNG CỐ ĐỊNH TỐI CAO */
        .hud-top-bar {
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 50px !important;
            display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 15px !important;
            background: linear-gradient(to bottom, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 70%, rgba(3,5,8,0) 100%) !important;
            z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
        }
        .hud-left, .hud-right { display: flex; flex-direction: column; gap: 2px; }
        .hud-right { text-align: right; color: rgba(255,255,255,0.85); }
        .hud-sys-online { color: #00e5ff; font-weight: 700; text-shadow: 0 0 8px rgba(0,229,255,0.6); }
        .hud-gps { color: #ff007f; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.6); }
        .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.6); cursor: pointer; }

        /* MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (QUẢ CẦU 3D ĐỘNG + DANH SÁCH MỞ RỘNG) */
        #globalLangScreen {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: radial-gradient(circle at center, #0a1128 0%, #030508 85%);
            z-index: 2147483646; display: flex; flex-direction: column; justify-content: center; align-items: center;
            opacity: 1; visibility: visible; transition: opacity 0.8s ease, transform 0.8s ease; padding: 60px 10px 20px 10px;
        }
        .global-globe-container {
            position: relative; width: 160px; height: 160px; border-radius: 50%;
            border: 2px dashed rgba(0, 229, 255, 0.4); box-shadow: 0 0 30px rgba(0, 229, 255, 0.25);
            display: flex; justify-content: center; align-items: center; margin-bottom: 15px;
            background: radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%);
        }
        #globeCanvas { width: 140px; height: 140px; border-radius: 50%; }

        .global-title {
            color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; text-align: center;
            text-shadow: 0 0 10px rgba(255,215,0,0.8);
        }
        
        /* KHUNG CUỘN CHỨA TẤT CẢ CÁC NGÔN NGỮ TRÊN THẾ GIỚI */
        .lang-grid-nodes {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 92%; max-width: 360px;
            max-height: 240px; overflow-y: auto; padding-right: 4px; z-index: 2;
        }
        .lang-grid-nodes::-webkit-scrollbar { width: 4px; }
        .lang-grid-nodes::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.4); border-radius: 4px; }

        .lang-node-btn {
            background: rgba(10, 20, 35, 0.9); backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 229, 255, 0.5); border-radius: 8px; padding: 10px 4px;
            text-align: center; cursor: pointer; color: #ffffff; font-family: 'Montserrat', sans-serif;
            font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
            box-shadow: 0 0 8px rgba(0, 229, 255, 0.2); transition: all 0.2s;
        }
        .lang-node-btn:hover, .lang-node-btn:active {
            background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 15px #00e5ff;
            transform: scale(1.03);
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
        .gps-modal-desc { color: #d0f0ff; font-size: 12px; line-height: 1.6; margin-bottom: 25px; }
        .gps-btn-row { display: flex; gap: 10px; justify-content: center; }
        .gps-action-btn {
            flex: 1; padding: 12px 10px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
            font-size: 11px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
        }
        .gps-btn-allow { background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 12px rgba(0, 229, 255, 0.3); }
        .gps-btn-deny { background: rgba(255, 0, 60, 0.15); border: 1px solid rgba(255, 0, 60, 0.6); color: #ff3333; }
    </style>
</head>
<body>

    <!-- THANH HUD TRẠNG THÁI HỆ THỐNG -->
    <div class="hud-top-bar">
        <div class="hud-left">
            <span class="hud-sys-online" id="hudSysText">SYS.ONLINE // 2026</span>
            <span style="color: #fff;" id="hudUserText">USER: GUEST</span>
            <span class="hud-gps" id="hudGpsText">GPS: OFFLINE / UNAUTHORIZED</span>
        </div>
        <div class="hud-right">
            <span style="color: #00e5ff;">K-DRIVE v2.6</span>
            <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.04</span>
            <span class="hud-chat-badge" id="hudChatText" onclick="playClick()">GLOBAL CHAT 9+</span>
        </div>
    </div>

    <!-- MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (QUẢ CẦU 3D ĐỘNG & TẤT CẢ NGÔN NGỮ) -->
    <div id="globalLangScreen">
        <div class="global-globe-container">
            <canvas id="globeCanvas" width="140" height="140"></canvas>
        </div>
        <div class="global-title" id="globalTitleText">CHỌN MẠNG LƯỚI NGÔN NGỮ TOÀN CẦU</div>
        <div class="lang-grid-nodes">
            <div class="lang-node-btn" onclick="selectLanguage('vi')">TIẾNG VIỆT</div>
            <div class="lang-node-btn" onclick="selectLanguage('en')">ENGLISH</div>
            <div class="lang-node-btn" onclick="selectLanguage('jp')">日本語</div>
            <div class="lang-node-btn" onclick="selectLanguage('kr')">한국어</div>
            <div class="lang-node-btn" onclick="selectLanguage('cn')">中文 (繁體)</div>
            <div class="lang-node-btn" onclick="selectLanguage('zh')">中文 (简体)</div>
            <div class="lang-node-btn" onclick="selectLanguage('fr')">FRANÇAIS</div>
            <div class="lang-node-btn" onclick="selectLanguage('es')">ESPAÑOL</div>
            <div class="lang-node-btn" onclick="selectLanguage('de')">DEUTSCH</div>
            <div class="lang-node-btn" onclick="selectLanguage('ru')">РУССКИЙ</div>
            <div class="lang-node-btn" onclick="selectLanguage('ar')">العربية</div>
            <div class="lang-node-btn" onclick="selectLanguage('hi')">हिन्दी</div>
            <div class="lang-node-btn" onclick="selectLanguage('pt')">PORTUGUÊS</div>
            <div class="lang-node-btn" onclick="selectLanguage('it')">ITALIANO</div>
            <div class="lang-node-btn" onclick="selectLanguage('th')">ไทย</div>
            <div class="lang-node-btn" onclick="selectLanguage('id')">INDONESIA</div>
            <div class="lang-node-btn" onclick="selectLanguage('tr')">TÜRKÇE</div>
            <div class="lang-node-btn" onclick="selectLanguage('nl')">NEDERLANDS</div>
            <div class="lang-node-btn" onclick="selectLanguage('pl')">POLSKI</div>
            <div class="lang-node-btn" onclick="selectLanguage('sv')">SVENSKA</div>
            <div class="lang-node-btn" onclick="selectLanguage('el')">ΕΛΛΗΝΙΚΑ</div>
        </div>
    </div>

    <!-- HỘP THOẠI XIN QUYỀN GPS -->
    <div class="gps-modal-overlay" id="gpsModalOverlay">
        <div class="gps-modal-box">
            <div class="gps-modal-title" id="gpsModalTitle">🛰️ XÁC THỰC TỌA ĐỘ GPS</div>
            <div class="gps-modal-desc" id="gpsModalDesc">Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu.</div>
            <div class="gps-btn-row">
                <button class="gps-action-btn gps-btn-deny" onclick="handleGps(false)">TỪ CHỐI</button>
                <button class="gps-action-btn gps-btn-allow" onclick="handleGps(true)">ĐỒNG Ý</button>
            </div>
        </div>
    </div>

    <script>
        // HOẠT HÌNH QUẢ CẦU 3D XOAY TRÒN (CANVAS WIREFRAME GLOBE)
        const canvas = document.getElementById('globeCanvas');
        const ctx = canvas.getContext('2d');
        let angle = 0;

        function drawGlobe() {
            ctx.clearRect(0, 0, 140, 140);
            const cx = 70, cy = 70, r = 60;

            // Vẽ vòng tròn nền
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Vẽ các đường kinh tuyến / vĩ tuyến xoay
            for (let i = -Math.PI / 2; i <= Math.PI / 2; i += 0.5) {
                ctx.beginPath();
                let latRadius = r * Math.cos(i);
                let latY = cy + r * Math.sin(i) * 0.4;
                ctx.ellipse(cx, latY, latRadius, latRadius * 0.2, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
                ctx.stroke();
            }

            for (let i = 0; i < Math.PI; i += 0.6) {
                ctx.beginPath();
                let currentAngle = i + angle;
                ctx.ellipse(cx + Math.cos(currentAngle) * 15, cy, r * Math.abs(Math.sin(currentAngle)), r, 0, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)';
                ctx.stroke();
            }

            angle += 0.02;
            requestAnimationFrame(drawGlobe);
        }
        drawGlobe();

        function playClick() {
            try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
        }

        function selectLanguage(lang) {
            playClick();
            const langScreen = document.getElementById('globalLangScreen');
            langScreen.style.transform = "scale(1.2)";
            langScreen.style.opacity = "0";
            setTimeout(() => {
                langScreen.style.display = 'none';
                document.getElementById('gpsModalOverlay').classList.add('active');
            }, 800);
        }

        function handleGps(isAllowed) {
            playClick();
            const gpsText = document.getElementById('hudGpsText');
            document.getElementById('gpsModalOverlay').classList.remove('active');

            if(isAllowed && navigator.geolocation) {
                gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        gpsText.textContent = `GPS: ${pos.coords.latitude.toFixed(2)}N, ${pos.coords.longitude.toFixed(2)}E`;
                        gpsText.style.color = "#00e5ff";
                    },
                    () => {
                        gpsText.textContent = "GPS: OFFLINE";
                        gpsText.style.color = "#ff3333";
                    },
                    { timeout: 5000 }
                );
            } else {
                gpsText.textContent = "GPS: OFFLINE";
                gpsText.style.color = "#ff3333";
            }
        }
    </script>
</body>
</html>
