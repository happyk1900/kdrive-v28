(function() {
    // 1. CHÈN CSS HỆ THỐNG VÀO TRANG
    const style = document.createElement('style');
    style.innerHTML = `
        * { box-sizing: border-box; user-select: none; -webkit-user-select: none; }
        img, video { -webkit-user-drag: none; pointer-events: none; }

        /* THANH HUD HỆ THỐNG CỐ ĐỊNH TỐI CAO */
        .hud-top-bar {
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 50px !important;
            display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 15px !important;
            background: linear-gradient(to bottom, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.4) 70%, rgba(3,5,8,0) 100%) !important;
            z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
            pointer-events: auto !important;
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
            color: #ffd700; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; text-align: center;
            text-shadow: 0 0 10px rgba(255,215,0,0.8);
        }
        .lang-grid-nodes {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 92%; max-width: 360px;
            max-height: 240px; overflow-y: auto; padding-right: 4px; z-index: 2;
        }
        .lang-grid-nodes::-webkit-scrollbar { width: 4px; }
        .lang-grid-nodes::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.4); border-radius: 4px; }

        .lang-node-btn {
            background: rgba(10, 20, 35, 0.9); backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 229, 255, 0.5); border-radius: 8px; padding: 10px 4px;
            text-align: center; cursor: pointer; color: #ffffff; font-family: 'Space Grotesk', sans-serif;
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
            color: #ff007f; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;
            text-shadow: 0 0 10px rgba(255, 0, 127, 0.8);
        }
        .gps-modal-desc { color: #d0f0ff; font-size: 12px; line-height: 1.6; margin-bottom: 25px; }
        .gps-btn-row { display: flex; gap: 10px; justify-content: center; }
        .gps-action-btn {
            flex: 1; padding: 12px 10px; border-radius: 10px; font-family: 'Space Grotesk', sans-serif;
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
            z-index: 3; pointer-events: auto; cursor: pointer; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; white-space: nowrap; padding: 8px 18px; border-radius: 4px; background: rgba(255, 0, 127, 0.15); border: 1px solid rgba(255, 0, 127, 0.8); box-shadow: 0 0 10px rgba(255, 0, 127, 0.4); text-shadow: 0 0 5px #ff007f;
        }
    `;
    document.head.appendChild(style);

    // 2. TẠO VÀ BƠM HTML GIAO DIỆN HUD VÀO TRANG
    const container = document.createElement('div');
    container.innerHTML = `
        <!-- THANH HUD TRẠNG THÁI HỆ THỐNG -->
        <div class="hud-top-bar">
            <div class="hud-left">
                <span class="hud-sys-online" id="hudSysText">SYS.ONLINE // 2026</span>
                <span style="color: #fff;" id="hudUserText">USER: GUEST</span>
                <span class="hud-gps" id="hudGpsText">GPS: OFFLINE / UNAUTHORIZED</span>
            </div>
            <div class="hud-right">
                <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
            </div>
        </div>

        <!-- MÀN HÌNH CHỌN NGÔN NGỮ TOÀN CẦU -->
        <div id="globalLangScreen">
            <div class="global-globe-container">
                <canvas id="globeCanvas" width="140" height="140"></canvas>
            </div>
            <div class="global-title" id="globalTitleText">CHỌN MẠNG LƯỚI NGÔN NGỮ TOÀN CẦU</div>
            <div class="lang-grid-nodes">
                <div class="lang-node-btn" data-lang="vi">TIẾNG VIỆT</div>
                <div class="lang-node-btn" data-lang="en">ENGLISH</div>
                <div class="lang-node-btn" data-lang="jp">日本語</div>
                <div class="lang-node-btn" data-lang="kr">한국어</div>
                <div class="lang-node-btn" data-lang="cn">中文 (繁)</div>
                <div class="lang-node-btn" data-lang="zh">中文 (简)</div>
                <div class="lang-node-btn" data-lang="fr">FRANÇAIS</div>
                <div class="lang-node-btn" data-lang="es">ESPAÑOL</div>
                <div class="lang-node-btn" data-lang="de">DEUTSCH</div>
                <div class="lang-node-btn" data-lang="ru">РУССКИЙ</div>
                <div class="lang-node-btn" data-lang="ar">العربية</div>
                <div class="lang-node-btn" data-lang="hi">हिन्दी</div>
                <div class="lang-node-btn" data-lang="pt">PORTUGUÊS</div>
                <div class="lang-node-btn" data-lang="it">ITALIANO</div>
                <div class="lang-node-btn" data-lang="th">ไทย</div>
                <div class="lang-node-btn" data-lang="id">INDONESIA</div>
                <div class="lang-node-btn" data-lang="tr">TÜRKÇE</div>
                <div class="lang-node-btn" data-lang="nl">NEDERLANDS</div>
                <div class="lang-node-btn" data-lang="pl">POLSKI</div>
                <div class="lang-node-btn" data-lang="sv">SVENSKA</div>
                <div class="lang-node-btn" data-lang="el">ΕΛΛΗΝΙΚΑ</div>
            </div>
        </div>

        <!-- HỘP THOẠI XIN QUYỀN GPS -->
        <div class="gps-modal-overlay" id="gpsModalOverlay">
            <div class="gps-modal-box">
                <div class="gps-modal-title" id="gpsModalTitle">🛰️ XÁC THỰC TỌA ĐỘ GPS</div>
                <div class="gps-modal-desc" id="gpsModalDesc">Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu.</div>
                <div class="gps-btn-row">
                    <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn">TỪ CHỐI</button>
                    <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn">ĐỒNG Ý</button>
                </div>
            </div>
        </div>

        <!-- SCENE 0: MÀN HÌNH KHỞI ĐỘNG (VIDEO) -->
        <div id="preSplashScreen">
            <video id="preSplashVideo" autoplay loop muted playsinline>
                <source src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/video%20khoi%20dau.mp4" type="video/mp4">
            </video>
            <div class="core-access-btn" id="preBtnText">TRUY CẬP LÕI LƯỢNG TỬ</div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. LOGIC XỬ LÝ SỰ KIỆN VÀ HIỆU ỨNG
    const langData = {
        vi: { title: "CHỌN MẠNG LƯỚI NGÔN NGỮ TOÀN CẦU", gpsTitle: "🛰️ XÁC THỰC TỌA ĐỘ GPS", gpsDesc: "Hệ thống yêu cầu cấp quyền truy xuất định vị thực tế để đồng bộ bản đồ Đấu trường Lượng tử toàn cầu.", allow: "ĐỒNG Ý", deny: "TỪ CHỐI", preBtn: "TRUY CẬP LÕI LƯỢNG TỬ" },
        en: { title: "SELECT GLOBAL LANGUAGE NETWORK", gpsTitle: "🛰️ GPS COORDINATE VERIFICATION", gpsDesc: "System requires real-time location access to synchronize global Quantum Arena mapping.", allow: "ACCEPT", deny: "DENY", preBtn: "ACCESS QUANTUM CORE" },
        jp: { title: "グローバル言語ネットワークを選択", gpsTitle: "🛰️ GPS座標の検証", gpsDesc: "量子アリーナマッピングを同期するため、位置情報へのアクセスが必要です。", allow: "許可", deny: "拒否", preBtn: "量子コアアクセス" },
        kr: { title: "글로벌 언어 네트워크 선택", gpsTitle: "🛰️ GPS 좌표 인증", gpsDesc: "양자 아레나 매핑 동기화를 위해 실시간 위치 접근 권한이 필요합니다.", allow: "허용", deny: "거부", preBtn: "양자 코어 접속" },
        cn: { title: "选择全球语言网络", gpsTitle: "🛰️ GPS 坐标验证", gpsDesc: "系统需要实时位置访问权限来同步全球量子竞技场映射。", allow: "同意", deny: "拒绝", preBtn: "访问量子核心" },
        zh: { title: "选择全球语言网络", gpsTitle: "🛰️ GPS 坐标验证", gpsDesc: "系统需要实时位置访问权限来同步全球量子竞技场映射。", allow: "同意", deny: "拒绝", preBtn: "访问量子核心" },
        fr: { title: "SÉLECTIONNER LA LANGUE", gpsTitle: "🛰️ VÉRIFICATION GPS", gpsDesc: "Le système nécessite l'accès à la position pour synchroniser l'Arène Quantique.", allow: "AUTORISER", deny: "REFUSER", preBtn: "ACCÉDER AU CŒUR" },
        es: { title: "SELECCIONAR IDIOMA", gpsTitle: "🛰️ VERIFICACIÓN GPS", gpsDesc: "El sistema requiere acceso a la ubicación en tiempo real.", allow: "ACEPTAR", deny: "RECHAZAR", preBtn: "ACCEDER AL NÚCLEO" }
    };

    // Quả cầu 3D Canvas
    const canvas = document.getElementById('globeCanvas');
    const ctx = canvas.getContext('2d');
    let angle = 0;

    function drawGlobe() {
        if (!ctx) return;
        ctx.clearRect(0, 0, 140, 140);
        const cx = 70, cy = 70, r = 60;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)'; ctx.lineWidth = 1.5; ctx.stroke();

        for (let i = -Math.PI / 2; i <= Math.PI / 2; i += 0.5) {
            ctx.beginPath();
            let latRadius = r * Math.cos(i);
            let latY = cy + r * Math.sin(i) * 0.4;
            ctx.ellipse(cx, latY, latRadius, latRadius * 0.2, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)'; ctx.stroke();
        }
        for (let i = 0; i < Math.PI; i += 0.6) {
            ctx.beginPath();
            let currentAngle = i + angle;
            ctx.ellipse(cx + Math.cos(currentAngle) * 15, cy, r * Math.abs(Math.sin(currentAngle)), r, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)'; ctx.stroke();
        }
        angle += 0.02;
        requestAnimationFrame(drawGlobe);
    }
    drawGlobe();

    function playClick() {
        try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
    }

    // Xử lý chọn ngôn ngữ
    document.querySelectorAll('.lang-node-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClick();
            const lang = btn.getAttribute('data-lang');
            const d = langData[lang] || langData['en'];
            document.getElementById('globalTitleText').textContent = d.title;
            document.getElementById('gpsModalTitle').textContent = d.gpsTitle;
            document.getElementById('gpsModalDesc').textContent = d.gpsDesc;
            document.getElementById('gpsAllowBtn').textContent = d.allow;
            document.getElementById('gpsDenyBtn').textContent = d.deny;
            document.getElementById('preBtnText').textContent = d.preBtn;

            const langScreen = document.getElementById('globalLangScreen');
            langScreen.style.transform = "scale(1.2)";
            langScreen.style.opacity = "0";
            setTimeout(() => {
                langScreen.style.display = 'none';
                document.getElementById('gpsModalOverlay').classList.add('active');
            }, 800);
        });
    });

    // Xử lý GPS
    document.getElementById('gpsAllowBtn').addEventListener('click', () => handleGps(true));
    document.getElementById('gpsDenyBtn').addEventListener('click', () => handleGps(false));

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
                    proceedToPreSplash();
                },
                () => {
                    gpsText.textContent = "GPS: OFFLINE";
                    gpsText.style.color = "#ff3333";
                    proceedToPreSplash();
                },
                { timeout: 5000 }
            );
        } else {
            gpsText.textContent = "GPS: OFFLINE";
            gpsText.style.color = "#ff3333";
            proceedToPreSplash();
        }
    }

    function proceedToPreSplash() {
        document.getElementById('preSplashScreen').classList.add('active');
    }

    document.getElementById('preSplashScreen').addEventListener('click', () => {
        playClick();
        const preSplash = document.getElementById('preSplashScreen');
        preSplash.style.transform = "scale(1.5)";
        preSplash.style.opacity = "0";
        setTimeout(() => {
            preSplash.style.display = 'none';
        }, 800);
    });
})();
