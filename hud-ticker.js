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
        img, video { -webkit-user-drag: none; pointer-events: none; }

        /* THANH HUD HỆ THỐNG CỐ ĐỊNH TỐI CAO - KHÔI PHỤC HIỆU ỨNG SÓNG & PHÁT SÁNG */
        .hud-top-bar {
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 50px !important;
            display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 15px !important;
            background: linear-gradient(to bottom, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 70%, rgba(3,5,8,0) 100%) !important;
            z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10.5px !important; color: #00e5ff !important; letter-spacing: 1.5px !important;
        }
        .hud-left, .hud-right { display: flex; flex-direction: column; gap: 2px; }
        .hud-right { text-align: right; color: rgba(255,255,255,0.85); }
        
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

        @keyframes textWaveGlow {
            0% { text-shadow: 0 0 6px rgba(0,255,102,0.5), 0 0 12px rgba(0,255,102,0.2); transform: scale(1); }
            50% { text-shadow: 0 0 15px rgba(0,255,102,1), 0 0 30px rgba(0,255,102,0.6); transform: scale(1.02); }
            100% { text-shadow: 0 0 6px rgba(0,255,102,0.5), 0 0 12px rgba(0,255,102,0.2); transform: scale(1); }
        }

        @keyframes badgePulse {
            0% { opacity: 0.8; text-shadow: 0 0 6px rgba(255,215,0,0.5); }
            100% { opacity: 1; text-shadow: 0 0 16px rgba(255,215,0,1); }
        }

        /* HỘP THOẠI XIN QUYỀN GPS DUY NHẤT 1 LẦN */
        .gps-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(15px);
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

        /* SCENE 0: VIDEO KHỞI ĐẦU */
        #preSplashScreen { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: #000; z-index: 2147483644; display: flex; flex-direction: column; justify-content: center; align-items: center; 
            opacity: 0; visibility: hidden; transition: opacity 0.8s ease; cursor: pointer; pointer-events: none; 
        }
        #preSplashScreen.active { opacity: 1; visibility: visible; pointer-events: auto; }
        #preSplashVideo { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.85; }
        .core-access-btn {
            position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%);
            z-index: 3; pointer-events: auto; cursor: pointer; color: #ffffff; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; white-space: nowrap; padding: 8px 18px; border-radius: 4px; background: rgba(255, 0, 127, 0.15); border: 1px solid rgba(255, 0, 127, 0.8); box-shadow: 0 0 10px rgba(255, 0, 127, 0.4); text-shadow: 0 0 5px #ff007f;
        }
    </style>
</head>
<body>

    <!-- THANH HUD TRẠNG THÁI HỆ THỐNG -->
    <div class="hud-top-bar">
        <div class="hud-left">
            <span class="hud-sys-online" id="hudSysText">SYS.ONLINE</span>
            <span style="color: #fff;" id="hudUserText">USER: GUEST</span>
            <span class="hud-gps" id="hudGpsText">GPS: OFFLINE / UNAUTHORIZED</span>
        </div>
        <div class="hud-right">
            <span style="color: #00e5ff;">K-DRIVE v2.6</span>
            <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
            <span class="hud-chat-badge" id="hudChatText" onclick="playClick()">GLOBAL CHAT 9+</span>
        </div>
    </div>

    <!-- HỘP THOẠI XIN QUYỀN GPS DUY NHẤT 1 LẦN -->
    <div class="gps-modal-overlay" id="gpsModalOverlay">
        <div class="gps-modal-box">
            <div class="gps-modal-title">🛰️ XÁC THỰC TỌA ĐỘ GPS</div>
            <div class="gps-modal-desc">Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu.</div>
            <div class="gps-btn-row">
                <button class="gps-action-btn gps-btn-deny" onclick="handleGps(false)">TỪ CHỐI</button>
                <button class="gps-action-btn gps-btn-allow" onclick="handleGps(true)">ĐỒNG Ý</button>
            </div>
        </div>
    </div>

    <!-- SCENE 0: MÀN HÌNH KHỞI ĐỘNG (VIDEO) -->
    <div id="preSplashScreen" onclick="enterPreSplash()">
        <video id="preSplashVideo" autoplay loop muted playsinline>
            <source src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/video%20khoi%20dau.mp4" type="video/mp4">
        </video>
        <div class="core-access-btn">TRUY CẬP LÕI LƯỢNG TỬ</div>
    </div>

    <script>
        function playClick() {
            try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
        }

        window.addEventListener('DOMContentLoaded', () => {
            const gpsVerified = localStorage.getItem('kdrive_gps_verified');
            const gpsText = document.getElementById('hudGpsText');

            if (gpsVerified === 'true') {
                const cachedLat = localStorage.getItem('kdrive_gps_lat');
                const cachedLon = localStorage.getItem('kdrive_gps_lon');
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
                document.getElementById('gpsModalOverlay').classList.add('active');
            }
        });

        function handleGps(isAllowed) {
            playClick();
            const gpsText = document.getElementById('hudGpsText');
            document.getElementById('gpsModalOverlay').classList.remove('active');

            if(isAllowed && navigator.geolocation) {
                gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        localStorage.setItem('kdrive_gps_verified', 'true');
                        localStorage.setItem('kdrive_gps_lat', lat);
                        localStorage.setItem('kdrive_gps_lon', lon);

                        gpsText.textContent = `GPS: ${lat.toFixed(2)}N, ${lon.toFixed(2)}E`;
                        gpsText.style.color = "#00e5ff";
                    },
                    () => {
                        localStorage.setItem('kdrive_gps_verified', 'false');
                        gpsText.textContent = "GPS: OFFLINE";
                        gpsText.style.color = "#ff3333";
                    },
                    { timeout: 5000 }
                );
            } else {
                localStorage.setItem('kdrive_gps_verified', 'false');
                gpsText.textContent = "GPS: OFFLINE";
                gpsText.style.color = "#ff3333";
            }
        }

        function enterPreSplash() {
            playCall();
            const preSplash = document.getElementById('preSplashScreen');
            preSplash.style.transform = "scale(1.5)";
            preSplash.style.opacity = "0";
            setTimeout(() => {
                preSplash.style.display = 'none';
            }, 800);
        }
    </script>
</body>
</html>
