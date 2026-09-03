<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>K-Drive: Giao Thức Lượng Tử Toàn Cầu</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        body { background-color: #030508; height: 100vh; height: 100dvh; width: 100vw; display: flex; justify-content: center; align-items: center; margin: 0; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }
        img, video { -webkit-user-drag: none; pointer-events: none; }

        /* ================= THANH HUD HỆ THỐNG TRÊN CÙNG ================= */
        .hud-top-bar {
            position: absolute; top: 0; left: 0; width: 100%; height: 50px;
            display: flex; justify-content: space-between; align-items: center; padding: 0 15px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
            z-index: 99999; font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; color: #00e5ff; letter-spacing: 1px;
            pointer-events: none;
        }
        .hud-left, .hud-right { display: flex; flex-direction: column; gap: 2px; }
        .hud-right { text-align: right; color: rgba(255,255,255,0.85); }
        .hud-sys-online { color: #00e5ff; font-weight: 700; text-shadow: 0 0 8px rgba(0,229,255,0.6); }
        .hud-gps { color: #ff007f; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.6); }
        .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.6); pointer-events: auto; cursor: pointer; }

        /* ================= MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (BẢN ĐỒ / LƯỚI KHÔNG GIAN) ================= */
        #globalLangScreen {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #0a1128 0%, #030508 85%);
            z-index: 99999999; display: flex; flex-direction: column; justify-content: center; align-items: center;
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .global-globe-container {
            position: relative; width: 280px; height: 280px; border-radius: 50%;
            border: 2px dashed rgba(0, 229, 255, 0.4); box-shadow: 0 0 40px rgba(0, 229, 255, 0.2), inset 0 0 30px rgba(0, 229, 255, 0.15);
            display: flex; justify-content: center; align-items: center; animation: globeRotate 20s linear infinite;
            margin-bottom: 30px; background: radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%);
        }
        @keyframes globeRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .globe-core-icon {
            position: absolute; font-size: 45px; animation: globeRotateReverse 20s linear infinite;
            text-shadow: 0 0 20px #00e5ff;
        }
        @keyframes globeRotateReverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        .global-title {
            color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; text-align: center;
            text-shadow: 0 0 12px rgba(255,215,0,0.8);
        }
        .lang-grid-nodes {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 85%; max-width: 320px;
            z-index: 2;
        }
        .lang-node-btn {
            background: rgba(10, 20, 35, 0.85); backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 229, 255, 0.5); border-radius: 10px; padding: 12px 8px;
            text-align: center; cursor: pointer; color: #ffffff; font-family: 'Montserrat', sans-serif;
            font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
            box-shadow: 0 0 12px rgba(0, 229, 255, 0.2); transition: all 0.3s;
        }
        .lang-node-btn:hover, .lang-node-btn:active {
            background: rgba(0, 229, 255, 0.25); border-color: #00e5ff; box-shadow: 0 0 20px #00e5ff;
            transform: scale(1.05);
        }

        /* ================= HỘP THOẠI XIN QUYỀN GPS (CYBERNETIC PERMISSION MODAL) ================= */
        .gps-modal-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px);
            z-index: 9999999; display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
        }
        .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .gps-modal-box {
            width: 90%; max-width: 340px; background: rgba(5, 12, 22, 0.95);
            border: 1.5px solid #ff007f; border-radius: 16px; padding: 25px 20px;
            text-align: center; box-shadow: 0 0 35px rgba(255, 0, 127, 0.4);
            transform: scale(0.9); transition: transform 0.3s;
        }
        .gps-modal-overlay.active .gps-modal-box { transform: scale(1); }
        .gps-modal-title {
            color: #ff007f; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;
            text-shadow: 0 0 10px rgba(255, 0, 127, 0.8);
        }
        .gps-modal-desc {
            color: #d0f0ff; font-size: 12px; line-height: 1.6; margin-bottom: 25px;
            font-family: 'Space Grotesk', sans-serif;
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

        /* ================= SCENE 0: MÀN HÌNH KHỞI ĐỘNG (VIDEO) ================= */
        #preSplashScreen { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            background: #000; z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; 
            opacity: 0; visibility: hidden; transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out; 
            cursor: pointer; pointer-events: none; 
        }
        #preSplashScreen.active { opacity: 1; visibility: visible; pointer-events: auto; }
        #preSplashVideo { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; opacity: 0.85; pointer-events: none; }
        .pre-splash-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, transparent 15%, rgba(0,0,0,0.8) 120%); z-index: 2; pointer-events: none; }

        .core-access-btn {
            position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%);
            z-index: 3; pointer-events: auto; cursor: pointer; color: #ffffff; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; white-space: nowrap; padding: 8px 18px; border-radius: 4px; background: rgba(255, 0, 127, 0.15); backdrop-filter: blur(4px); border: 1px solid rgba(255, 0, 127, 0.8); box-shadow: 0 0 10px rgba(255, 0, 127, 0.4), inset 0 0 5px rgba(255, 0, 127, 0.2); text-shadow: 0 0 5px #ff007f, 0 0 10px #ff007f; animation: electricGlow 2.5s infinite;
        }

        @keyframes electricGlow {
            0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 127, 0.4), inset 0 0 5px rgba(255, 0, 127, 0.2); text-shadow: 0 0 5px #ff007f; }
            50% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.5), inset 0 0 8px rgba(0, 229, 255, 0.3); text-shadow: 0 0 8px #00e5ff; border-color: rgba(0, 229, 255, 0.8); }
        }

        /* ================= SCENE 1: QUẦY LỄ TÂN ================= */
        #splashScreen { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #030508; z-index: 99999; display: flex; flex-direction: column; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.8s ease; }
        #splashScreen.active { opacity: 1; visibility: visible; }
        .splash-bg-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transform: scale(1.05) translateY(15px); }
        
        .cyber-ticker-wrap {
            position: absolute; top: 29.5%; left: 0; width: 100%; height: 26px;
            background: rgba(0,0,0,0.7); border-top: 1px solid rgba(255,215,0,0.3); border-bottom: 1px solid rgba(255,215,0,0.3);
            display: flex; align-items: center; overflow: hidden; z-index: 15; box-shadow: 0 0 10px rgba(255,215,0,0.1);
        }
        .ticker-content {
            white-space: nowrap; color: #ffd700; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700;
            letter-spacing: 2px; text-shadow: 0 0 8px rgba(255,215,0,0.8);
            animation: tickerScroll 25s linear infinite;
        }
        @keyframes tickerScroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150%); } }

        .splash-boxes-container { 
            position: absolute; bottom: 165px; left: 50%; transform: translateX(-50%); 
            width: 88%; max-width: 350px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; z-index: 10; transition: opacity 0.3s; 
        }
        .cyber-box { 
            position: relative; background: rgba(3, 7, 14, 0.35); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); 
            border: 1px solid rgba(0, 229, 255, 0.45); border-radius: 10px; padding: 12px 5px; text-align: center; 
            cursor: pointer; pointer-events: auto; overflow: hidden; box-shadow: 0 0 12px rgba(0, 229, 255, 0.15); 
            transition: all 0.2s ease; animation: boxElectricFlicker 4s infinite;
        }
        .cyber-box:active { transform: scale(0.95); background: rgba(0, 229, 255, 0.25); border-color: #00e5ff; }
        .cyber-text { 
            position: relative; z-index: 2; color: #ffffff; font-family: 'Montserrat', sans-serif; font-weight: 900; 
            font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(255,255,255,0.7); 
        }
        @keyframes boxElectricFlicker {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 229, 255, 0.15); border-color: rgba(0, 229, 255, 0.45); }
            50% { box-shadow: 0 0 18px rgba(255, 0, 127, 0.3); border-color: rgba(255, 0, 127, 0.7); }
            75% { box-shadow: 0 0 22px rgba(0, 229, 255, 0.5); border-color: #00e5ff; }
        }

        .splash-bottom-area { position: absolute; bottom: 95px; left: 0; width: 100%; display: flex; justify-content: center; z-index: 10; }
        .hologram-hold-btn { 
            position: relative; width: 88%; max-width: 350px; padding: 15px 20px; 
            background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://github.com/happyk1900/-m-thanh-app/blob/main/QUAY%20VE%203S%20(1).png?raw=true'); 
            background-size: cover; background-position: center; opacity: 0.85; 
            border: 1.5px solid rgba(255, 0, 127, 0.6); border-radius: 10px; 
            display: flex; justify-content: center; align-items: center; cursor: pointer; overflow: hidden; pointer-events: auto; 
            box-shadow: 0 0 15px rgba(255, 0, 128, 0.3); transition: opacity 0.3s ease, border-color 0.3s; 
        }
        .hologram-hold-btn:hover { opacity: 1; }
        .hologram-hold-btn:active { transform: scale(0.98); }
        .hologram-hold-btn.electric-active { opacity: 1; border-color: #00e5ff !important; box-shadow: 0 0 35px rgba(0, 229, 255, 0.8); }
        .holo-progress-bar { position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), rgba(255, 255, 255, 0.8)); z-index: 1; transition: width 0.05s linear; }
        
        .holo-text-wrap { 
            position: relative; z-index: 2; width: 100%; text-align: center; color: #ffffff; 
            font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 900; letter-spacing: 2px; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.8); text-transform: uppercase; 
        }
        .holo-text-wrap.glitch-flash { animation: textElectricFlash 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes textElectricFlash {
            0% { transform: scale(1); filter: brightness(1); color: #ffffff; }
            30% { transform: scale(1.08) skewX(-10deg); filter: brightness(2.5) drop-shadow(0 0 12px #ff007f); color: #ff007f; }
            60% { transform: scale(0.96) skewX(10deg); filter: brightness(3) drop-shadow(0 0 15px #00e5ff); color: #00e5ff; }
            100% { transform: scale(1); filter: brightness(1); color: #ffffff; }
        }

        /* MODAL THÔNG TIN & LOGIN */
        .info-modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.88); backdrop-filter: blur(10px); z-index: 9999999; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: all 0.3s ease; pointer-events: none; }
        .info-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
        .info-modal-content { width: 92%; max-width: 380px; background-color: rgba(5, 10, 18, 0.98); border: 1.5px solid #00e5ff; border-radius: 18px; padding: 20px 15px 15px 15px; box-shadow: 0 0 35px rgba(0, 229, 255, 0.35); transform: scale(0.9); transition: transform 0.3s ease; display: flex; flex-direction: column; align-items: center; }
        .info-modal-overlay.active .info-modal-content { transform: scale(1); }
        .info-modal-title { color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900; text-align: center; margin-bottom: 12px; text-transform: uppercase; text-shadow: 0 0 12px rgba(255,215,0,0.8); letter-spacing: 1.5px; border-bottom: 1px solid rgba(255, 215, 0, 0.3); width: 100%; padding-bottom: 10px; }
        .modal-image-wrapper { width: 100%; height: 160px; margin-bottom: 12px; border-radius: 12px; border: 1px solid rgba(0, 229, 255, 0.4); overflow: hidden; display: flex; justify-content: center; align-items: center; background: #000; }
        .modal-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .carousel-track { display: flex; width: 100%; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .carousel-track::-webkit-scrollbar { display: none; }
        .slide-item { flex: 0 0 100%; width: 100%; padding: 0 10px; scroll-snap-align: center; color: #d0f0ff; font-size: 13px; line-height: 1.7; text-align: left; font-family: 'Space Grotesk', sans-serif; }
        .slide-item b { color: #00e5ff; font-weight: 700; }
        .carousel-dots { display: flex; gap: 8px; justify-content: center; margin: 10px 0 15px 0; }
        .dot { width: 8px; height: 8px; background: rgba(0, 229, 255, 0.3); border-radius: 50%; transition: 0.3s; }
        .dot.active { background: #00e5ff; width: 22px; border-radius: 4px; box-shadow: 0 0 10px #00e5ff; }
        .close-info-btn { width: 90%; padding: 11px; background: rgba(0, 229, 255, 0.15); border: 1px solid #00e5ff; color: #00e5ff; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 800; text-transform: uppercase; cursor: pointer; pointer-events: auto; }

        .kdrive-image-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #010204; z-index: 1; overflow: hidden; }
        .kdrive-bg-target { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2; opacity: 0; visibility: hidden; transition: opacity 1.5s ease-in-out; }
        .kdrive-bg-target.active { opacity: 1; visibility: visible; }
        
        .gateway-popup { 
            position: absolute; top: 50%; left: 50%; width: 92%; max-width: 340px; 
            background: rgba(10, 15, 25, 0.5); backdrop-filter: blur(20px); 
            border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 20px; padding: 30px 25px; z-index: 99999; 
            opacity: 0; transform: translate(-50%, -40%) scale(0.95); pointer-events: none; visibility: hidden; 
            transition: all 0.8s cubic-bezier(0.25, 1, 0.3, 1); box-shadow: 0 15px 35px rgba(0,0,0,0.8); 
        }
        .gateway-popup.active { opacity: 1; transform: translate(-50%, -50%) scale(1); pointer-events: auto; visibility: visible; }
        .gateway-popup h2 { color: #ffffff; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900; letter-spacing: 2px; margin-bottom: 25px; text-shadow: 0 0 15px rgba(0, 229, 255, 0.9); text-transform: uppercase; text-align: center; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px; }
        .input-wrapper { position: relative; width: 100%; margin-bottom: 18px; }
        .login-input { width: 100%; padding: 14px 40px 14px 15px; background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; color: #00e5ff; outline: none; text-align: center; font-weight: 700; font-family: 'Montserrat', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
        .login-input::placeholder { color: rgba(255,255,255,0.4); }
        .eye-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #00e5ff; font-size: 14px; }
        .account-options-row { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 10.5px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; text-transform: uppercase; }
        .remember-toggle { color: rgba(255, 255, 255, 0.7); cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .remember-toggle .check-box { display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; border: 1px solid rgba(0, 229, 255, 0.6); border-radius: 4px; background: rgba(0, 0, 0, 0.6); }
        .remember-toggle.active .check-box { background: rgba(0, 229, 255, 0.2); border-color: #00e5ff; }
        .remember-toggle.active .check-box::after { content: '✔'; color: #00e5ff; font-size: 12px; }
        .change-pass-link { color: rgba(255, 255, 255, 0.6); cursor: pointer; }
        .login-btn-submit { width: 100%; padding: 15px 20px; background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(0, 150, 255, 0.35)); color: #ffffff; font-weight: 900; font-size: 12px; letter-spacing: 4px; border: 1px solid rgba(0, 229, 255, 0.5); border-radius: 12px; cursor: pointer; text-transform: uppercase; }
        .back-home-btn { width: 100%; padding: 12px; background: transparent; border: 1px solid rgba(0, 229, 255, 0.2); color: #00e5ff; border-radius: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; }
        #successVideo { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 9999999; display: none; background: #000; }
    </style>
</head>
<body oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">

    <audio id="preAudio" crossorigin="anonymous" src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Hello!.mp3" preload="auto" loop></audio>
    <audio id="bgMusic" crossorigin="anonymous" src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Hello,%20I%20am%20Master%20Boo..mp3" preload="auto" loop></audio>
    <audio id="toriiAudio" crossorigin="anonymous" src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Path%20of%20the%20Ninja.mp3" preload="auto" loop></audio>
    <video id="successVideo" src="https://github.com/happyk1900/-m-thanh-app/raw/refs/heads/main/VIDEO%20DANG%20NHAP.mp4" playsinline></video>

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
            <span class="hud-chat-badge" id="hudChatText" onclick="playHologramClick()">GLOBAL CHAT 9+</span>
        </div>
    </div>

    <!-- MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU (BƯỚC 1) -->
    <div id="globalLangScreen">
        <div class="global-globe-container">
            <div class="globe-core-icon">🌐</div>
        </div>
        <div class="global-title" id="globalTitleText">CHỌN MẠNG LƯỚI NGÔN NGỮ</div>
        <div class="lang-grid-nodes">
            <div class="lang-node-btn" onclick="selectLanguage('vi')">TIẾNG VIỆT</div>
            <div class="lang-node-btn" onclick="selectLanguage('en')">ENGLISH</div>
            <div class="lang-node-btn" onclick="selectLanguage('jp')">日本語</div>
            <div class="lang-node-btn" onclick="selectLanguage('kr')">한국어</div>
            <div class="lang-node-btn" onclick="selectLanguage('cn')">中文</div>
            <div class="lang-node-btn" onclick="selectLanguage('fr')">FRANÇAIS</div>
        </div>
    </div>

    <!-- HỘP THOẠI XIN QUYỀN GPS (BƯỚC 2) -->
    <div class="gps-modal-overlay" id="gpsModalOverlay">
        <div class="gps-modal-box">
            <div class="gps-modal-title" id="gpsModalTitle">🛰️ XÁC THỰC TỌA ĐỘ GPS</div>
            <div class="gps-modal-desc" id="gpsModalDesc">Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu. Dữ liệu được mã hóa bảo mật tuyệt đối.</div>
            <div class="gps-btn-row">
                <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn" onclick="handleGpsPermission(false)">TỪ CHỐI</button>
                <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn" onclick="handleGpsPermission(true)">ĐỒNG Ý</button>
            </div>
        </div>
    </div>

    <!-- SCENE 0: MÀN HÌNH KHỞI ĐỘNG (VIDEO) -->
    <div id="preSplashScreen" onclick="enterPreSplash()">
        <video id="preSplashVideo" autoplay loop muted playsinline>
            <source src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/video%20khoi%20dau.mp4" type="video/mp4">
        </video>
        <div class="pre-splash-overlay"></div>
        <div class="core-access-btn" id="preBtnText">TRUY CẬP LÕI LƯỢNG TỬ</div>
    </div>

    <!-- SCENE 1: QUẦY LỄ TÂN -->
    <div id="splashScreen">
        <div class="cyber-ticker-wrap">
            <div class="ticker-content" id="tickerText">K-DRIVE: KHÔNG CHỈ LÀ GAME - LÀ GIAO THỨC SỐ HÓA SINH MỆNH TIÊN PHONG ⬢ CHUYỂN HOÁ TRỰC TIẾP THỂ CHẤT VÀ TRÍ LỰC VÀO KHÔNG GIAN LƯỢNG TỬ</div>
        </div>

        <div class="glitch-disclaimer-overlay" id="glitchDisclaimer">
            <div class="glitch-text-core" id="glitchTitle">⚠️ MIỄN TRỪ TRÁCH NHIỆM ⚠️</div>
            <div class="glitch-sub-text" id="glitchSub">Đang đồng bộ ấn ký sinh học. Bằng việc truy cập, Đạo chúng chấp nhận tiến nhập Không gian Lượng tử.</div>
        </div>

        <img src="https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20NEN%20NU.png?raw=true" class="splash-bg-image" alt="Cyber City">

        <div class="splash-boxes-container" id="boxContainer">
            <div class="cyber-box" onclick="openInfoModal('nhapmon')"><span class="cyber-text" id="box1Text">ĐĂNG KÝ</span></div>
            <div class="cyber-box" onclick="openInfoModal('tongquan')"><span class="cyber-text" id="box2Text">TỔNG QUAN</span></div>
            <div class="cyber-box" onclick="openInfoModal('luatchoi')"><span class="cyber-text" id="box3Text">LUẬT CHƠI</span></div>
            <div class="cyber-box" onclick="openInfoModal('santhuong')"><span class="cyber-text" id="box4Text">SĂN THƯỞNG</span></div>
        </div>

        <div class="splash-bottom-area">
            <div class="hologram-hold-btn" id="holoHoldBtn" 
                 onmousedown="startHoloHold(event)" ontouchstart="startHoloHold(event)"
                 onmouseup="cancelHoloHold(event)" ontouchend="cancelHoloHold(event)" onmouseleave="cancelHoloHold(event)">
                <div class="holo-progress-bar" id="holoProgressBar"></div>
                <div class="holo-text-wrap" id="holoTextRotator">GIỮ 3 GIÂY ĐỂ VÀO</div>
            </div>
        </div>
    </div>

    <!-- MODAL THÔNG TIN -->
    <div class="info-modal-overlay" id="infoModalOverlay">
        <div class="info-modal-content">
            <div class="info-modal-title" id="infoTitle">TIÊU ĐỀ</div>
            <div class="modal-image-wrapper"><img id="modalIllustration" src="" alt="Minh họa"></div>
            <div class="carousel-track" id="carouselTrack" onscroll="updateDots()"></div>
            <div class="carousel-dots" id="carouselDots"></div>
            <button class="close-info-btn" id="closeBtnText" onclick="closeInfoModal()">ĐÓNG LẠI</button>
        </div>
    </div>

    <!-- CỔNG TORII & LOGIN (SCENE 2) -->
    <div class="kdrive-image-wrapper">
        <img src="https://raw.githubusercontent.com/happyk1900/-m-thanh-app/main/ANH%20DANG%20NHAP.png" id="bg-login" class="kdrive-bg-target" alt="Login Background">
        <div class="gateway-popup" id="loginPanelContainer">
            <div id="panel-login" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                <h2 id="loginTitleText">XÁC THỰC DANH TÍNH</h2>
                <div class="input-wrapper">
                    <input type="text" id="accInput" class="login-input" placeholder="Danh Tính Đạo Chúng">
                </div>
                <div class="input-wrapper">
                    <input type="password" id="passcodeInput" class="login-input" placeholder="Ấn Ký Bí Mật">
                    <span class="eye-icon" onclick="togglePass('passcodeInput', this)">👁</span>
                </div>
                <div class="account-options-row">
                    <div class="remember-toggle active" onclick="toggleRemember(this); playHologramClick();">
                        <span class="check-box"></span><span id="rememberText">GHI NHỚ ẤN</span>
                    </div>
                    <span class="change-pass-link" id="forgotText" onclick="playHologramClick()">QUÊN MẬT ẤN?</span>
                </div>
                <button class="login-btn-submit" id="submitBtnText" onclick="playHologramClick(); submitLogin();">TIẾN NHẬP</button>
                <div id="loginStatus" style="margin-top: 15px; font-weight: 700; text-align: center; font-size: 10px; color: #fff;"></div>
                <div class="bottom-links" style="margin-top: 20px; width: 100%; border-top: 1px dashed rgba(0,229,255,0.2); padding-top: 15px;">
                    <button class="back-home-btn" onclick="playHologramClick(); location.reload();">
                        <span>⟵</span> <span id="registerLinkText">QUAY LẠI TRANG CHỦ</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const modalImages = {
            nhapmon: "https://github.com/happyk1900/-m-thanh-app/blob/main/QUAY%20VE%20DK.png?raw=true",
            tongquan: "https://github.com/happyk1900/-m-thanh-app/blob/main/QUAY%20VE%20TQ.png?raw=true",
            luatchoi: "https://github.com/happyk1900/-m-thanh-app/blob/main/QUAU%20VE%20LC.png?raw=true",
            santhuong: "https://github.com/happyk1900/-m-thanh-app/blob/main/QUAY%20VE%20ST.png?raw=true"
        };

        const langData = {
            vi: {
                globalTitle: "CHỌN MẠNG LƯỚI NGÔN NGỮ",
                gpsTitle: "🛰️ XÁC THỰC TỌA ĐỘ GPS",
                gpsDesc: "Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu. Dữ liệu được mã hóa bảo mật tuyệt đối.",
                gpsAllow: "ĐỒNG Ý", gpsDeny: "TỪ CHỐI",
                preBtn: "TRUY CẬP LÕI LƯỢNG TỬ",
                ticker: "K-DRIVE: KHÔNG CHỈ LÀ GAME - LÀ GIAO THỨC SỐ HÓA SINH MỆNH TIÊN PHONG ⬢ CHUYỂN HOÁ TRỰC TIẾP THỂ CHẤT VÀ TRÍ LỰC VÀO KHÔNG GIAN LƯỢNG TỬ",
                box1: "ĐĂNG KÝ", box2: "TỔNG QUAN", box3: "LUẬT CHƠI", box4: "SĂN THƯỞNG",
                holdMsgs: ["GIỮ 3 GIÂY ĐỂ VÀO", "KHỞI TẠO KHÔNG GIAN LƯỢNG TỬ", "XÁC NHẬN MÃ ẤN KÝ SINH MỆNH"],
                closeBtn: "ĐÓNG LẠI", loginTitle: "XÁC THỰC DANH TÍNH", accPlaceholder: "Danh Tính Đạo Chúng",
                passPlaceholder: "Ấn Ký Bí Mật", remember: "GHI NHỚ ẤN", forgot: "QUÊN MẬT ẤN?",
                submit: "TIẾN NHẬP", register: "QUAY LẠI TRANG CHỦ", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "ĐỒNG BỘ SINH MỆNH", slides: ["Xác thực danh tính <span style='color:#00e5ff;'>Đạo chúng</span> và kết nối sinh trắc học cá nhân.", "Bảo mật lượng tử đám mây lõi (Google & Microsoft).", "Từng giọt mồ hôi chuyển hóa thành quyền năng vô song."] },
                    tongquan: { title: "THẾ GIỚI LƯỢNG TỬ", slides: ["Đấu trường đối kháng sinh trắc học tiên phong.", "Hệ sinh thái PRO: Kết nối Đồng hồ & Cân thông minh.", "Hệ sinh thái Phổ thông: Chinh phục Trí lực."] },
                    luatchoi: { title: "GIAO THỨC RÈN LUYỆN", slides: ["Khối lập phương 4 nguyên tố: Địa, Thủy, Hỏa, Phong.", "Thực chiến Lượng tử: Tích lũy SCI lên cấp đại hội tháng 9.", "AI Dynamic Scaling: Vượt qua giới hạn bản thân."] },
                    santhuong: { title: "ĐẠI HỘI VÕ LÂM", slides: ["Sự kiện tháng 9 trích 30% doanh thu toàn hệ thống.", "Đại chiến phe phái tranh đoạt phần thưởng lớn.", "Đặc quyền vinh danh Bang chủ."] }
                }
            },
            en: {
                globalTitle: "SELECT GLOBAL LANGUAGE",
                gpsTitle: "🛰️ GPS COORDINATE VERIFICATION",
                gpsDesc: "K-Drive requires real-time location access to synchronize global Quantum Arena mapping. Data is encrypted.",
                gpsAllow: "ACCEPT", gpsDeny: "DENY",
                preBtn: "ACCESS QUANTUM CORE",
                ticker: "K-DRIVE: MORE THAN A GAME - PIONEERING BIO-DIGITAL PROTOCOL ⬢ SYNCHRONIZE PHYSICAL & MENTAL POWER INTO THE QUANTUM REALM",
                box1: "REGISTER", box2: "OVERVIEW", box3: "RULES", box4: "REWARDS",
                holdMsgs: ["HOLD 3s TO ENTER", "INITIALIZE QUANTUM REALM", "CONFIRM BIO-SEAL"],
                closeBtn: "CLOSE", loginTitle: "IDENTITY VERIFICATION", accPlaceholder: "DAOCHUNG ID",
                passPlaceholder: "SECRET SEAL", remember: "REMEMBER", forgot: "FORGOT SEAL?",
                submit: "ENTER", register: "RETURN TO HOME", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "BIO-SYNCHRONIZATION", slides: ["Verify Daochung ID and connect personal biometric data.", "Quantum Security via Google & Microsoft cloud.", "Every drop of sweat transforms into power."] },
                    tongquan: { title: "QUANTUM REALM", slides: ["Welcome to the pioneering biometric combat arena.", "PRO Ecosystem: Connect smartwatch and smart scale.", "Free Ecosystem: Conquer via Water, Fire, Wind wheels."] },
                    luatchoi: { title: "TRAINING PROTOCOL", slides: ["4-Element Cube: Earth, Water, Fire, Wind.", "Quantum Combat: Use SCI points to rank up for September.", "AI Dynamic Scaling: Push your limits."] },
                    santhuong: { title: "MARTIAL ARTS TOURNAMENT", slides: ["Grand September event funded by 30% revenue.", "Faction War for massive rewards.", "PRO unlocks guild master rank."] }
                }
            },
            jp: {
                globalTitle: "言語ネットワークを選択",
                gpsTitle: "🛰️ GPS座標の検証",
                gpsDesc: "グローバル量子アリーナマッピングを同期するため、位置情報へのアクセスが必要です。",
                gpsAllow: "許可", gpsDeny: "拒否",
                preBtn: "量子コアアクセス",
                ticker: "K-DRIVE: ゲームを超えた先駆的生体デジタルプロトコル ⬢ 精神と肉体を量子空間へ同期",
                box1: "登録", box2: "概要", box3: "ルール", box4: "報酬",
                holdMsgs: ["3秒長押しして入場", "量子空間を初期化", "生体印を認証"],
                closeBtn: "閉じる", loginTitle: "身元確認", accPlaceholder: "道衆ID",
                passPlaceholder: "秘密の印", remember: "記憶する", forgot: "パスワードを忘れた?",
                submit: "侵入", register: "ホームに戻る", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "生体同期", slides: ["道衆IDを確認し生体データを接続します。", "Google & Microsoftクラウドによる量子セキュリティ。", "現実の努力が量子空間の力に変換されます。"] },
                    tongquan: { title: "量子世界", slides: ["先駆的な生体戦闘アリーナへようこそ。", "PROエコシステム：スマートウォッチ連携。", "一般エコシステム：スキルを習得。"] },
                    luatchoi: { title: "訓練プロトコル", slides: ["4大要素キューブ：地、水、火、風。", "量子戦闘：9月の大会に向けてランクアップ。", "AIダイナミック・スケーリング。"] },
                    santhuong: { title: "武林大会", slides: ["総収益の30％が賞金の9月イベント。", "陣営戦で報酬獲得。", "PROはギルドマスター。"] }
                }
            },
            kr: {
                globalTitle: "언어 네트워크 선택",
                gpsTitle: "🛰️ GPS 좌표 인증",
                gpsDesc: "글로벌 양자 아레나 매핑 동기화를 위해 실시간 위치 접근 권한이 필요합니다.",
                gpsAllow: "허용", gpsDeny: "거부",
                preBtn: "양자 코어 접속",
                ticker: "K-DRIVE: 선구적인 생체 디지털 프로토콜 ⬢ 육체와 정신을 양자 영역으로 동기화",
                box1: "등록", box2: "개요", box3: "규칙", box4: "보상",
                holdMsgs: ["3초간 눌러 입장", "양자 영역 초기화", "생체 인장 인증"],
                closeBtn: "닫기", loginTitle: "신원 확인", accPlaceholder: "도중 ID",
                passPlaceholder: "비밀 인장", remember: "기억하기", forgot: "인장 분실?",
                submit: "입장", register: "홈으로 돌아가기", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "생체 동기화", slides: ["도중 ID를 확인하고 생체 데이터를 연결합니다.", "Google & Microsoft 클라우드 보안.", "현실의 노력이 양자 영역의 힘으로 전환됩니다."] },
                    tongquan: { title: "양자 세계", slides: ["선구적인 생체 전투 아레나에 오신 것을 환영합니다.", "PRO 생태계: 스마트워치 연동.", "일반 생태계: 기술 정복."] },
                    luatchoi: { title: "훈련 프로토콜", slides: ["4대 원소 큐브: 지, 수, 화, 풍.", "실전 양자: 9월 대회를 위한 등급 상승.", "AI 동적 스케줄링."] },
                    santhuong: { title: "무림 대회", slides: ["총 수익 30% 상금의 9월 이벤트.", "진영 전 보상 획득.", "PRO 문주 등급."] }
                }
            },
            cn: {
                globalTitle: "选择全局语言网络",
                gpsTitle: "🛰️ GPS 坐标验证",
                gpsDesc: "K-Drive 需要实时位置访问权限来同步全球量子竞技场映射。数据已加密。",
                gpsAllow: "同意", gpsDeny: "拒绝",
                preBtn: "访问量子核心",
                ticker: "K-DRIVE: 远超游戏的先锋生物数字协议 ⬢ 将现实体能与智力数字化至量子空间",
                box1: "注册", box2: "概览", box3: "规则", box4: "奖励",
                holdMsgs: ["按住3秒进入", "初始化量子空间", "确认生物印记"],
                closeBtn: "关闭", loginTitle: "身份验证", accPlaceholder: "道众编号",
                passPlaceholder: "秘密印记", remember: "记住印记", forgot: "忘记印记?",
                submit: "进入", register: "返回主页", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "生命同步", slides: ["验证道众身份并连接生物识别数据。", "Google & Microsoft 云端加密保障。", "现实努力将转化为无上威能。"] },
                    tongquan: { title: "量子世界", slides: ["欢迎来到先锋生物对抗竞技场。", "PRO生态：连接智能手表。", "普通生态：征服竞技场。"] },
                    luatchoi: { title: "训练协议", slides: ["四象立方体：地、水、火、风。", "量子实战：为9月大会提升段位。", "AI智能缩放。"] },
                    santhuong: { title: "武林大会", slides: ["提取总营收30%作为奖金池。", "帮派大战赢取丰厚奖励。", "PRO解锁帮主之位。"] }
                }
            },
            fr: {
                globalTitle: "SÉLECTIONNER LA LANGUE",
                gpsTitle: "🛰️ VÉRIFICATION GPS",
                gpsDesc: "K-Drive nécessite l'accès à la position pour synchroniser la carte mondiale de l'Arène Quantique.",
                gpsAllow: "AUTORISER", gpsDeny: "REFUSER",
                preBtn: "ACCÉDER AU CŒUR",
                ticker: "K-DRIVE: PROTOCOLE BIO-NUMÉRIQUE PIONNIER ⬢ SYNCHRONISEZ VOTRE PUISSANCE DANS LE MONDE QUANTIQUE",
                box1: "INSCRIPTION", box2: "APERÇU", box3: "RÈGLES", box4: "RÉCOMPENSES",
                holdMsgs: ["MAINTENIR 3s", "INITIALISER LE QUANTIQUE", "CONFIRMER LE SCEAU"],
                closeBtn: "FERMER", loginTitle: "VÉRIFICATION", accPlaceholder: "ID DAO",
                passPlaceholder: "SCEAU SECRET", remember: "MÉMORISER", forgot: "OUBLIÉ?",
                submit: "ENTRER", register: "RETOUR", chat: "GLOBAL CHAT 9+",
                info: {
                    nhapmon: { title: "SYNCHRONISATION", slides: ["Vérifiez l'ID et connectez les données biométriques.", "Sécurité Cloud Google & Microsoft.", "Chaque effort se transforme en puissance."] },
                    tongquan: { title: "MONDE QUANTIQUE", slides: ["Bienvenue dans l'arène de combat biométrique.", "Écosystème PRO : Montre connectée.", "Écosystème Standard : Maîtrisez les compétences."] },
                    luatchoi: { title: "PROTOCOLE", slides: ["Cube à 4 éléments : Terre, Eau, Feu, Vent.", "Combat Quantique : Grimpez les rangs pour Septembre.", "Mise à l'échelle dynamique par IA."] },
                    santhuong: { title: "TOURNOI", slides: ["Événement de Septembre financé à 30%.", "Guerre des factions.", "Privilèges PRO."] }
                }
            }
        };

        let currentLang = 'vi';
        let holoMessages = ["GIỮ 3 GIÂY ĐỂ VÀO", "KHỞI TẠO KHÔNG GIAN LƯỢNG TỬ", "XÁC NHẬN MÃ ẤN KÝ SINH MỆNH"];
        let currentMsgIndex = 0;

        // BƯỚC 1: CHỌN NGÔN NGỮ TỪ BẢN ĐỒ TOÀN CẦU
        function selectLanguage(lang) {
            currentLang = lang;
            playHologramClick();
            
            // Ẩn màn hình chọn ngôn ngữ toàn cầu
            const langScreen = document.getElementById('globalLangScreen');
            langScreen.style.transform = "scale(1.2)";
            langScreen.style.opacity = "0";
            setTimeout(() => {
                langScreen.style.display = 'none';
                applyLanguageUI();
                // BƯỚC 2: BẬT HỘP THOẠI XIN QUYỀN GPS TRÊN HUD
                document.getElementById('gpsModalOverlay').classList.add('active');
            }, 800);
        }

        function applyLanguageUI() {
            const data = langData[currentLang];
            document.getElementById('globalTitleText').textContent = data.globalTitle;
            document.getElementById('gpsModalTitle').textContent = data.gpsTitle;
            document.getElementById('gpsModalDesc').textContent = data.gpsDesc;
            document.getElementById('gpsAllowBtn').textContent = data.gpsAllow;
            document.getElementById('gpsDenyBtn').textContent = data.gpsDeny;
            document.getElementById('preBtnText').textContent = data.preBtn;
            document.getElementById('tickerText').textContent = data.ticker;
            document.getElementById('box1Text').textContent = data.box1;
            document.getElementById('box2Text').textContent = data.box2;
            document.getElementById('box3Text').textContent = data.box3;
            document.getElementById('box4Text').textContent = data.box4;
            
            const textWrap = document.getElementById('holoTextRotator');
            textWrap.textContent = data.holdMsgs[0];
            holoMessages = data.holdMsgs;

            document.getElementById('closeBtnText').textContent = data.closeBtn;
            document.getElementById('loginTitleText').textContent = data.loginTitle;
            document.getElementById('accInput').placeholder = data.accPlaceholder;
            document.getElementById('passcodeInput').placeholder = data.passPlaceholder;
            document.getElementById('rememberText').textContent = data.remember;
            document.getElementById('forgotText').textContent = data.forgot;
            document.getElementById('submitBtnText').textContent = data.submit;
            document.getElementById('registerLinkText').textContent = data.register;
            document.getElementById('hudChatText').textContent = data.chat;
            document.getElementById('glitchTitle').textContent = data.info.luatchoi.title ? "⚠️ " + data.glitchTitle : "⚠️ DISCLAIMER ⚠️";
        }

        // BƯỚC 3: XỬ LÝ QUYỀN GPS VÀ CHUYỂN SANG SCENE 0 (VIDEO KHỞI ĐẦU)
        function handleGpsPermission(isAllowed) {
            playHologramClick();
            const gpsText = document.getElementById('hudGpsText');
            
            if(isAllowed && navigator.geolocation) {
                gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let lat = position.coords.latitude.toFixed(2);
                        let lon = position.coords.longitude.toFixed(2);
                        gpsText.textContent = `GPS: ${lat}N, ${lon}E`;
                        gpsText.style.color = "#00e5ff";
                        closeGpsModalAndStart();
                    },
                    (error) => {
                        gpsText.textContent = "GPS: OFFLINE / UNAUTHORIZED";
                        gpsText.style.color = "#ff3333";
                        closeGpsModalAndStart();
                    },
                    { timeout: 5000 }
                );
            } else {
                gpsText.textContent = "GPS: OFFLINE / UNAUTHORIZED";
                gpsText.style.color = "#ff3333";
                closeGpsModalAndStart();
            }
        }

        function closeGpsModalAndStart() {
            document.getElementById('gpsModalOverlay').classList.remove('active');
            // Mở Scene 0 (Màn hình Video khởi đầu)
            document.getElementById('preSplashScreen').classList.add('active');
        }

        function playHologramClick() { 
            try { 
                const snd = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); 
                snd.volume = 0.5; 
                snd.play().catch(e => {}); 
            } catch(err) {} 
        }

        function enterPreSplash() {
            document.getElementById('preSplashScreen').style.pointerEvents = 'none'; 
            playHologramClick();
            const bgm = document.getElementById('bgMusic');
            if(bgm) { bgm.play().catch(e => console.log(e)); }
            
            const preSplash = document.getElementById('preSplashScreen');
            preSplash.style.transform = "scale(1.5)"; 
            preSplash.style.opacity = "0";
            setTimeout(() => { 
                preSplash.style.display = "none"; 
                document.getElementById('splashScreen').classList.add('active');
            }, 800);
        }

        function openInfoModal(key) {
            playHologramClick();
            const imgElement = document.getElementById('modalIllustration');
            if(modalImages[key]) { imgElement.src = modalImages[key]; imgElement.style.display = 'block'; }
            const data = langData[currentLang].info[key]; 
            document.getElementById('infoTitle').innerHTML = data.title;
            const track = document.getElementById('carouselTrack'); const dots = document.getElementById('carouselDots');
            track.innerHTML = ''; dots.innerHTML = '';
            data.slides.forEach((slideHtml, index) => {
                track.innerHTML += `<div class="slide-item"><p>${slideHtml}</p></div>`;
                dots.innerHTML += `<span class="dot ${index === 0 ? 'active' : ''}"></span>`;
            });
            track.scrollLeft = 0; document.getElementById('infoModalOverlay').classList.add('active');
        }

        function closeInfoModal() { playHologramClick(); document.getElementById('infoModalOverlay').classList.remove('active'); }
        
        function updateDots() {
            const track = document.getElementById('carouselTrack'); const dots = document.getElementById('carouselDots').children;
            const activeIndex = Math.round(track.scrollLeft / track.clientWidth);
            for (let i = 0; i < dots.length; i++) { dots[i].className = i === activeIndex ? 'dot active' : 'dot'; }
        }
        
        function toggleRemember(el) { el.classList.toggle('active'); }
        function togglePass(inputId, iconEl) { playHologramClick(); let inp = document.getElementById(inputId); if(inp.type === 'password') { inp.type = 'text'; iconEl.innerHTML = '🙈'; } else { inp.type = 'password'; iconEl.innerHTML = '👁'; } }

        // Vòng lặp đổi chữ nút 3 giây với hiệu ứng điện xẹt
        setInterval(() => {
            const textEl = document.getElementById('holoTextRotator'); 
            if(!textEl) return;
            currentMsgIndex = (currentMsgIndex + 1) % holoMessages.length;
            textEl.textContent = holoMessages[currentMsgIndex];
            textEl.classList.add('glitch-flash');
            setTimeout(() => { textEl.classList.remove('glitch-flash'); }, 350);
        }, 3000);

        let holoHoldInterval = null; let holoHoldStart = 0; const holoHoldDuration = 3000;
        const chargeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3');

        function startHoloHold(e) {
            if(e.type === 'touchstart') e.preventDefault();
            document.getElementById('holoHoldBtn').classList.add('electric-active');
            
            holoHoldStart = Date.now();
            chargeSound.currentTime = 0; chargeSound.play().catch(e=>{});
            if(navigator.vibrate) navigator.vibrate([50, 30, 50, 30]);

            holoHoldInterval = setInterval(() => {
                let progress = Math.min(100, ((Date.now() - holoHoldStart) / holoHoldDuration) * 100); 
                document.getElementById('holoProgressBar').style.width = progress + '%';
                if(Date.now() - holoHoldStart >= holoHoldDuration) { clearInterval(holoHoldInterval); triggerTransitionToTorii(); }
            }, 30);
        }

        function cancelHoloHold(e) {
            if(holoHoldInterval) clearInterval(holoHoldInterval);
            document.getElementById('holoProgressBar').style.width = '0%'; 
            document.getElementById('holoHoldBtn').classList.remove('electric-active');
            chargeSound.pause();
        }

        function triggerTransitionToTorii() {
            try {
                if(navigator.vibrate) navigator.vibrate([200, 100, 300, 100, 400]);
                chargeSound.pause(); document.getElementById('bgMusic').pause();
                document.getElementById('toriiAudio').play().catch(e=>{});
                new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play().catch(e=>{});
                
                const splash = document.getElementById('splashScreen');
                splash.style.transition = "opacity 0.8s ease"; splash.style.opacity = "0"; setTimeout(() => { splash.style.display = 'none'; }, 800);
                document.getElementById('bg-login').classList.add('active');
                setTimeout(() => { document.getElementById('loginPanelContainer').classList.add('active'); }, 3000); 
            } catch(err) {}
        }

        const scriptURL = 'https://script.google.com/macros/s/AKfycbwPVjsQ6bd9RFcOB7BUBl2bSsYa6gccHoirg66hbNCruFYJ3HP9w-xJD6JpCupjUKSr/exec';
        function submitLogin() {
            var acc = document.getElementById('accInput').value.trim(); var code = document.getElementById('passcodeInput').value.trim(); 
            var statusEl = document.getElementById('loginStatus');

            if(acc === "" || code === "") { statusEl.innerHTML = "❌ ĐIỀN ĐỦ THÔNG TIN!"; statusEl.style.color = "#ff3333"; return; }
            statusEl.innerHTML = "🛰️ ĐANG KIỂM CHỨNG..."; statusEl.style.color = "#00e5ff";
            
            const dataForm = new FormData(); dataForm.append('action', 'checkLogin'); dataForm.append('username', acc); dataForm.append('password', code);

            fetch(scriptURL, { method: 'POST', body: dataForm })
            .then(response => response.json())
            .then(data => {
                if(data.success === true || data.result === "success" || data.status === "success" || data.ket_qua === "thanh_cong") {
                    try {
                        const sndVortex = new Audio('https://assets.mixkit.co/active_storage/sfx/2771/2771-preview.mp3');
                        sndVortex.volume = 1.0; sndVortex.play().catch(e=>{});
                        if (navigator.vibrate) navigator.vibrate([300, 100, 400, 100, 500, 150, 600, 200, 1000]);
                    } catch(e) {}
                    
                    statusEl.innerHTML = "✅ THÀNH CÔNG!"; statusEl.style.color = "#00e5ff";
                    sessionStorage.setItem('kdrive_session', 'active'); sessionStorage.setItem('kdrive_username', acc); 
                    
                    const toriiAudio = document.getElementById('toriiAudio'); if(toriiAudio) toriiAudio.pause();
                    
                    setTimeout(() => { 
                        document.getElementById('loginPanelContainer').classList.remove('active'); 
                        setTimeout(() => {
                            const successVid = document.getElementById('successVideo');
                            if(successVid) {
                                successVid.style.display = 'block'; 
                                successVid.play().then(() => { 
                                    successVid.onended = () => { window.location.href = 'INTRO.html'; }; 
                                }).catch(err => { window.location.href = 'INTRO.html'; });
                            } else { window.location.href = 'INTRO.html'; }
                        }, 500);
                    }, 1000); 
                } else { statusEl.innerHTML = "❌ SAI THÔNG TIN!"; statusEl.style.color = "#ff3333"; }
            })
            .catch(error => { statusEl.innerHTML = "❌ MẤT KẾT NỐI!"; statusEl.style.color = "#ff3333"; });
        }
    </script>
    <script src="boo-player.js"></script>
</body>
</html>
