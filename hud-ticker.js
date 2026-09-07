(function() {
    // 1. NẠP FONT VÀ CSS CHO THANH HUD & FORM GPS
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ================= THANH HUD TOP CƠ BẢN ================= */
            .hud-top-bar {
                position: fixed !important; top: 12px !important; left: 12px !important; width: calc(100vw - 24px) !important;
                display: flex !important; justify-content: space-between !important; align-items: flex-start !important;
                z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10px !important;
                pointer-events: none !important; /* Cho phép bấm xuyên qua khoảng trống */
            }

            /* CHIA ĐÚNG 3 DÒNG NGANG CHO 2 BÊN */
            .hud-left { 
                display: flex; flex-direction: column; gap: 4px; width: 35%; text-align: left; 
                pointer-events: auto; letter-spacing: 1px;
            }
            .hud-right { 
                display: flex; flex-direction: column; gap: 4px; width: 35%; text-align: right; 
                pointer-events: auto; letter-spacing: 1px;
            }
            
            /* NÚT NGÔN NGỮ GHIM CHÍNH GIỮA TUYỆT ĐỐI */
            .hud-center { 
                position: absolute; left: 50%; transform: translateX(-50%); top: 0; 
                pointer-events: auto; 
            }

            /* MÀU SẮC & HIỆU ỨNG TỪNG DÒNG */
            .hud-sys-row { display: flex; align-items: center; gap: 6px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 8px rgba(0,255,102,0.8); }
            .hud-user-text { color: #ffffff; font-weight: 600; text-shadow: 0 0 4px rgba(0,0,0,0.8); }
            
            /* GPS KẾT NỐI MÀU HỒNG CYBER */
            .hud-gps { color: #ff007f !important; font-weight: 800; text-shadow: 0 0 8px rgba(255,0,127,0.8); }
            
            .hud-version { color: #00e5ff; font-weight: 800; text-shadow: 0 0 6px rgba(0,229,255,0.6); }
            .hud-date { color: rgba(255,255,255,0.7); font-weight: 500; text-shadow: 0 0 4px rgba(0,0,0,0.8); }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.8); cursor: pointer; }

            /* NÚT CHỌN NGÔN NGỮ NẰM Ở GIỮA */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.12); border: 1px solid rgba(0, 229, 255, 0.5);
                border-radius: 4px; color: #00e5ff; font-family: 'Space Grotesk', sans-serif;
                font-size: 9.5px; font-weight: 700; padding: 4px 12px; cursor: pointer;
                text-transform: uppercase; transition: 0.2s; box-shadow: 0 0 8px rgba(0,229,255,0.2);
                backdrop-filter: blur(4px);
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.35); box-shadow: 0 0 15px rgba(0,229,255,0.8); color: #fff; }

            /* ================= BỘ CỘT SÓNG NHẤP NHÁY ================= */
            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 10px; }
            .signal-bar { width: 2.5px; background-color: #00ff66; box-shadow: 0 0 6px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
            .signal-bar:nth-child(2) { height: 7px; animation-delay: 0.3s; }
            .signal-bar:nth-child(3) { height: 10px; animation-delay: 0.6s; }
            @keyframes signalPulse { 0% { opacity: 0.3; transform: scaleY(0.6); } 100% { opacity: 1; transform: scaleY(1); } }

            /* ================= MODAL CHỌN NGÔN NGỮ ================= */
            .global-lang-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(1, 3, 8, 0.92); backdrop-filter: blur(15px);
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: 0.3s ease; pointer-events: none;
            }
            .global-lang-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .global-lang-content {
                width: 90%; max-width: 360px; max-height: 80vh; overflow-y: auto;
                background: rgba(5, 12, 22, 0.98); border: 1.5px solid #00e5ff; border-radius: 14px;
                padding: 20px; box-shadow: 0 0 40px rgba(0, 229, 255, 0.4);
                display: flex; flex-direction: column; align-items: center;
            }
            .global-lang-title {
                color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900;
                text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,215,0,0.7);
            }
            .global-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 15px; }
            .global-lang-item {
                background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25);
                color: #ffffff; padding: 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
                text-align: center; cursor: pointer; transition: 0.2s;
            }
            .global-lang-item:hover { background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); color: #ffd700; }
            .global-lang-close {
                width: 100%; padding: 10px; background: rgba(255, 0, 60, 0.2); border: 1px solid #ff003c;
                color: #ff3333; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase;
            }

            /* ================= MODAL GPS ĐÃ ĐƯỢC ÉP ẢNH NỀN ================= */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            
            .gps-modal-box {
                width: 90%; max-width: 360px; min-height: 280px;
                /* ẢNH NỀN ANH GỬI ĐƯỢC ỐP FULL VIỀN TẠI ĐÂY */
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20HUD%20(1).png?raw=true'); 
                background-size: 100% 100%; 
                background-position: center; 
                background-repeat: no-repeat;
                background-color: transparent;
                border: none; /* Tắt border vì ảnh đã có viền */
                padding: 40px 25px 35px 25px; /* Căn chỉnh nội dung lọt thỏm vào giữa khung ảnh */
                display: flex; flex-direction: column; justify-content: flex-start; align-items: center;
                position: relative;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
            }
            
            .gps-modal-title {
                color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px;
                text-shadow: 0 0 8px rgba(255, 51, 102, 0.8); z-index: 2; text-align: center; line-height: 1.4;
            }
            
            /* Box làm nền đen cho chữ nổi lên */
            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(0, 229, 255, 0.2);
                border-radius: 8px; padding: 15px; width: 100%; z-index: 2;
                box-shadow: inset 0 0 15px rgba(0,0,0,0.9); margin-bottom: 25px;
            }
            .gps-modal-desc p { 
                color: #e0f7fa; font-size: 12.5px; line-height: 1.6; 
                font-family: 'Space Grotesk', sans-serif; margin-bottom: 10px; text-shadow: 0 1px 3px #000;
            }
            .gps-modal-desc p:last-child { margin-bottom: 0; color: #a0c0d0; font-style: italic; }
            
            .gps-btn-row { display: flex; gap: 12px; justify-content: center; width: 100%; z-index: 2; margin-top: auto;}
            
            .gps-action-btn {
                flex: 1; padding: 12px 5px; border-radius: 8px; font-family: 'Montserrat', sans-serif;
                font-size: 11px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
                text-align: center; white-space: nowrap; letter-spacing: 1px;
            }
            .gps-btn-allow { 
                background: rgba(0, 229, 255, 0.1); border: 1.5px solid #00e5ff; color: #00e5ff; 
                box-shadow: inset 0 0 8px rgba(0,229,255,0.2); 
            }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 15px #00e5ff; transform: translateY(-2px); }
            
            .gps-btn-deny { 
                background: rgba(255, 51, 102, 0.1); border: 1.5px solid #ff3366; color: #ff3366; 
                box-shadow: inset 0 0 8px rgba(255,51,102,0.2);
            }
            .gps-btn-deny:hover { background: rgba(255, 51, 102, 0.3); color: #fff; box-shadow: 0 0 15px #ff3366; transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
    }

    const globalTranslations = {
        vi: { select_lang_title: "CHỌN NGÔN NGỮ QUỐC TẾ", close_btn: "ĐÓNG LẠI" },
        en: { select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE" },
        zh: { select_lang_title: "选择全球语言", close_btn: "关闭" },
        ja: { select_lang_title: "グローバル言語を選択", close_btn: "閉じる" },
        ko: { select_lang_title: "글로벌 언어 선택", close_btn: "닫기" },
        fr: { select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER" },
        de: { select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN" },
        es: { select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR" },
        ru: { select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ" },
        th: { select_lang_title: "เลือกภาษา", close_btn: "ปิด" },
        id: { select_lang_title: "PILIH BAHASA", close_btn: "TUTUP" },
        ar: { select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق" }
    };

    function playClickSound() {
        try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('kdriveGlobalHud')) return;

        const container = document.createElement('div');
        container.id = 'kdriveGlobalHud';
        container.innerHTML = `
            <div class="hud-top-bar">
                <!-- KHỐI BÊN TRÁI ĐÚNG 3 DÒNG NGANG -->
                <div class="hud-left">
                    <div class="hud-sys-row">
                        <div class="signal-bars">
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                        </div>
                        <span class="hud-sys-online" id="hudSysText">SYS.ONLINE</span>
                    </div>
                    <span class="hud-user-text" id="hudUserText">USER: GUEST</span>
                    <span class="hud-gps" id="hudGpsText">GPS: OFFLINE</span>
                </div>

                <!-- NÚT NGÔN NGỮ NẰM CHÍNH GIỮA -->
                <div class="hud-center">
                    <button class="hud-lang-btn" id="hudLangOpenBtn">🌐 [ <span id="hudLangLabel">VI</span> ]</button>
                </div>

                <!-- KHỐI BÊN PHẢI ĐÚNG 3 DÒNG NGANG -->
                <div class="hud-right">
                    <span class="hud-version">K-DRIVE v2.6</span>
                    <span class="hud-date" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <!-- MODAL BẢNG CHỌN NGÔN NGỮ TOÀN CẦU -->
            <div class="global-lang-overlay" id="globalLangModal">
                <div class="global-lang-content">
                    <div class="global-lang-title" id="langModalTitleText">CHỌN NGÔN NGỮ QUỐC TẾ</div>
                    <div class="global-lang-grid">
                        <div class="global-lang-item" onclick="window.setGlobalLang('vi')">🇻🇳 Tiếng Việt</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('en')">🇬🇧 English</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('zh')">🇨🇳 中文</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('ja')">🇯🇵 日本語</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('ko')">🇰🇷 한국어</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('fr')">🇫🇷 Français</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('de')">🇩🇪 Deutsch</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('es')">🇪🇸 Español</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('ru')">🇷🇺 Русский</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('th')">🇹🇭 ไทย</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('id')">🇮🇩 Indonesia</div>
                        <div class="global-lang-item" onclick="window.setGlobalLang('ar')">🇸🇦 العربية</div>
                    </div>
                    <button class="global-lang-close" id="langModalCloseBtn" onclick="window.closeGlobalLang()">ĐÓNG LẠI</button>
                </div>
            </div>

            <!-- MODAL GPS THEO ẢNH HOLOGRM CỦA USER -->
            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-box">
                    <div class="gps-modal-title">🛰️ XÁC THỰC GPS /<br>GPS VERIFICATION</div>
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

        window.openGlobalLang = function() {
            playClickSound();
            document.getElementById('globalLangModal').classList.add('active');
        };
        window.closeGlobalLang = function() {
            playClickSound();
            document.getElementById('globalLangModal').classList.remove('active');
        };
        window.setGlobalLang = function(lang) {
            playClickSound();
            localStorage.setItem('kdrive_lang', lang);
            updateHudLangUI(lang);
            window.closeGlobalLang();
            // Bắn tín hiệu để core/các trang nhận diện ngôn ngữ
            window.dispatchEvent(new CustomEvent('kdriveLangChanged', { detail: { lang } }));
        };

        function updateHudLangUI(lang) {
            const lbl = document.getElementById('hudLangLabel');
            if (lbl) lbl.innerText = lang.toUpperCase();
            const t = globalTranslations[lang] || globalTranslations['vi'];
            const titleEl = document.getElementById('langModalTitleText');
            if (titleEl) titleEl.innerText = t.select_lang_title;
            const closeEl = document.getElementById('langModalCloseBtn');
            if (closeEl) closeEl.innerText = t.close_btn;
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);

        // Khởi chạy ngôn ngữ đã chọn
        const savedLang = localStorage.getItem('kdrive_lang') || 'vi';
        updateHudLangUI(savedLang);

        // Lấy tên User
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

        // XỬ LÝ GPS LOGIC
        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        const gpsText = document.getElementById('hudGpsText');
        const modalOverlay = document.getElementById('gpsModalOverlay');

        if (gpsVerified === 'true') {
            const cachedLat = sessionStorage.getItem('kdrive_gps_lat');
            const cachedLon = sessionStorage.getItem('kdrive_gps_lon');
            if (cachedLat && cachedLon) {
                gpsText.textContent = `GPS: ${Number(cachedLat).toFixed(2)}N, ${Number(cachedLon).toFixed(2)}E`;
            } else {
                gpsText.textContent = "GPS: SYNCHRONIZED";
            }
        } else if (gpsVerified === 'false') {
            gpsText.textContent = "GPS: OFFLINE";
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
                    },
                    () => {
                        sessionStorage.setItem('kdrive_gps_verified', 'false');
                        gpsText.textContent = "GPS: OFFLINE";
                    },
                    { timeout: 5000 }
                );
            } else {
                sessionStorage.setItem('kdrive_gps_verified', 'false');
                gpsText.textContent = "GPS: OFFLINE";
            }
        }
    });
})();
