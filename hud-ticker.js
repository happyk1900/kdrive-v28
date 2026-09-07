(function() {
    // 1. Nạp font và CSS HUD
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* THANH HUD 3 KHỐI TRONG SUỐT */
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 55px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 10px !important; color: #00e5ff !important; letter-spacing: 1.2px !important;
                pointer-events: auto !important; box-shadow: none !important;
            }
            .hud-left { display: flex; flex-direction: column; gap: 2px; width: 35%; text-align: left; }
            .hud-center { display: flex; justify-content: center; align-items: center; width: 30%; }
            .hud-right { display: flex; flex-direction: column; gap: 2px; width: 35%; text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 6px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 10px rgba(0,255,102,0.8); }
            
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.8); }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.8); cursor: pointer; transition: 0.2s; }
            .hud-chat-badge:hover { color: #fff; text-shadow: 0 0 15px #ffd700; }

            /* NÚT CHỌN NGÔN NGỮ */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.15); border: 1px solid rgba(0, 229, 255, 0.6);
                border-radius: 4px; color: #00e5ff; font-family: 'Space Grotesk', sans-serif;
                font-size: 9.5px; font-weight: 700; padding: 4px 10px; cursor: pointer;
                text-transform: uppercase; transition: 0.2s; box-shadow: 0 0 10px rgba(0,229,255,0.3);
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.35); box-shadow: 0 0 15px rgba(0,229,255,0.8); color: #fff; }

            /* BẢNG CHỌN NGÔN NGỮ TOÀN CẦU (MODAL) */
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
            .global-lang-title { color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,215,0,0.7); }
            .global-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 15px; }
            .global-lang-item { background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25); color: #ffffff; padding: 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; cursor: pointer; transition: 0.2s; }
            .global-lang-item:hover { background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); color: #ffd700; }
            .global-lang-close { width: 100%; padding: 10px; background: rgba(255, 0, 60, 0.2); border: 1px solid #ff003c; color: #ff3333; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase; }

            /* BỘ CỘT SÓNG NHẤP NHÁY */
            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 10px; }
            .signal-bar { width: 2.5px; background-color: #00ff66; box-shadow: 0 0 6px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
            .signal-bar:nth-child(2) { height: 7px; animation-delay: 0.3s; }
            .signal-bar:nth-child(3) { height: 10px; animation-delay: 0.6s; }
            @keyframes signalPulse { 0% { opacity: 0.3; transform: scaleY(0.6); } 100% { opacity: 1; transform: scaleY(1); } }

            /* ========================================================= */
            /* HỘP THOẠI XIN QUYỀN GPS */
            /* ========================================================= */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
                background-color: #050a15; 
                /* ------------------------------------------------------------- */
                /* ANH DÁN LINK ẢNH NỀN FULL MÀN HÌNH VÀO DÒNG DƯỚI NÀY NHÉ:     */
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/GPS%20NEN.jpg?raw=true'); 
                /* ------------------------------------------------------------- */
                background-size: cover; background-position: center; background-repeat: no-repeat;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .gps-modal-dimmer { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
            
            .gps-modal-box {
                width: 90%; max-width: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center;
                z-index: 2; position: relative; padding: 25px 20px; background: rgba(5, 12, 22, 0.85);
                border: 2px solid #ff007f; border-radius: 16px; box-shadow: 0 0 25px rgba(255, 0, 127, 0.5), inset 0 0 15px rgba(255, 0, 127, 0.2);
            }
            .gps-modal-title { color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 51, 102, 0.8); z-index: 1; text-align: center; line-height: 1.4; }
            .gps-modal-desc { background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; padding: 20px 18px; width: 100%; z-index: 1; box-sizing: border-box; margin-bottom: 25px; backdrop-filter: blur(4px); }
            .gps-modal-desc p { color: #e0f7fa; font-size: 13.5px; line-height: 1.6; font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
            .gps-modal-desc p:last-child { margin-bottom: 0; color: #a0c0d0; font-style: italic; }
            .gps-btn-row { display: flex; gap: 15px; justify-content: center; width: 100%; z-index: 1; }
            .gps-action-btn { flex: 1; padding: 14px 5px; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s; text-align: center; white-space: nowrap; letter-spacing: 1px; backdrop-filter: blur(2px); }
            .gps-btn-allow { background: rgba(0, 229, 255, 0.15); border: 2px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 15px rgba(0, 229, 255, 0.4), inset 0 0 8px rgba(0,229,255,0.2); }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 25px #00e5ff; transform: translateY(-2px); }
            .gps-btn-deny { background: rgba(255, 51, 102, 0.15); border: 2px solid #ff3366; color: #ff3366; box-shadow: 0 0 15px rgba(255, 51, 102, 0.4), inset 0 0 8px rgba(255,51,102,0.2); }
            .gps-btn-deny:hover { background: rgba(255, 51, 102, 0.4); color: #fff; box-shadow: 0 0 25px #ff3366; transform: translateY(-2px); }

            /* ========================================================= */
            /* GLOBAL CHAT MODAL (KÊNH CHAT LƯỢNG TỬ) */
            /* ========================================================= */
            .chat-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(1, 3, 8, 0.85); backdrop-filter: blur(8px);
                z-index: 2147483649; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: 0.3s ease; pointer-events: none;
            }
            .chat-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            
            .chat-modal-box {
                width: 92%; max-width: 420px; height: 75vh;
                background: rgba(5, 12, 22, 0.95); border: 2px solid #00e5ff; border-radius: 16px;
                display: flex; flex-direction: column; padding: 20px;
                box-shadow: 0 0 40px rgba(0, 229, 255, 0.25), inset 0 0 15px rgba(0, 229, 255, 0.1);
                position: relative;
            }
            .chat-modal-box::before {
                content: ""; position: absolute; inset: 0; pointer-events: none;
                background: linear-gradient(rgba(0, 229, 255, 0.02) 50%, rgba(0, 0, 0, 0.05) 50%);
                background-size: 100% 4px; z-index: 0; border-radius: 16px;
            }

            .chat-header {
                color: #00e5ff; font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 900;
                text-align: center; border-bottom: 1px solid rgba(0, 229, 255, 0.4); padding-bottom: 15px; margin-bottom: 15px;
                letter-spacing: 2px; text-shadow: 0 0 10px rgba(0, 229, 255, 0.8); z-index: 1;
                display: flex; justify-content: space-between; align-items: center;
            }
            .chat-close-btn { color: #ff3366; cursor: pointer; font-size: 22px; line-height: 1; text-shadow: 0 0 8px rgba(255,51,102,0.8); transition: 0.2s; }
            .chat-close-btn:hover { transform: scale(1.1); color: #fff; }

            .chat-messages-area {
                flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
                padding-right: 5px; z-index: 1; margin-bottom: 15px;
            }
            .chat-messages-area::-webkit-scrollbar { width: 4px; }
            .chat-messages-area::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.5); border-radius: 2px; }

            .chat-msg-row {
                background: rgba(255,255,255,0.03); padding: 10px 12px; border-radius: 8px;
                border-left: 3px solid #00e5ff; font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: #e0f7fa;
                word-wrap: break-word; line-height: 1.4;
            }
            .chat-msg-row.sys-msg { border-left-color: #ff3366; background: rgba(255,51,102,0.05); }
            .chat-user-name { font-family: 'Share Tech Mono', monospace; font-weight: bold; margin-right: 6px; font-size: 13.5px; }

            .chat-input-wrapper { display: flex; gap: 10px; z-index: 1; }
            .chat-input-field {
                flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(0, 229, 255, 0.5);
                color: #fff; padding: 12px 15px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif;
                font-size: 13px; outline: none; transition: 0.3s;
            }
            .chat-input-field:focus { border-color: #00e5ff; box-shadow: inset 0 0 10px rgba(0,229,255,0.3); }
            /* TRẠNG THÁI CHƯA ĐĂNG NHẬP */
            .chat-input-field:disabled {
                border-color: rgba(255, 51, 102, 0.6); color: #ff3366; background: rgba(255, 51, 102, 0.05);
                font-weight: bold; text-align: center; cursor: not-allowed;
            }
            
            .chat-send-btn {
                background: rgba(0, 229, 255, 0.15); border: 1px solid #00e5ff; color: #00e5ff;
                padding: 0 18px; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-weight: 800;
                cursor: pointer; transition: 0.2s; letter-spacing: 1px;
            }
            .chat-send-btn:hover:not(:disabled) { background: rgba(0, 229, 255, 0.4); color: #fff; box-shadow: 0 0 15px #00e5ff; }
            .chat-send-btn:disabled { background: rgba(255,51,102,0.1); border-color: #ff3366; color: #ff3366; cursor: not-allowed; opacity: 0.5;}
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
    function playErrorSound() {
        try { 
            const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
            const osc = ctx.createOscillator(); const gain = ctx.createGain(); 
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square'; osc.frequency.setValueAtTime(150, ctx.currentTime); 
            gain.gain.setValueAtTime(0.4, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } catch(e){}
    }

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
                    <span class="hud-gps" id="hudGpsText">GPS: OFFLINE</span>
                </div>

                <div class="hud-center">
                    <button class="hud-lang-btn" id="hudLangOpenBtn">🌐 [ <span id="hudLangLabel">VI</span> ]</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <!-- Modal bảng chọn ngôn ngữ toàn cầu -->
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

            <!-- BẢNG GPS STYLE HOLOGRAM MỚI -->
            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-dimmer"></div>
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

            <!-- KÊNH CHAT LƯỢNG TỬ (GLOBAL CHAT) -->
            <div class="chat-modal-overlay" id="globalChatModalOverlay">
                <div class="chat-modal-box">
                    <div class="chat-header">
                        <span>🛰️ KÊNH CHAT LƯỢNG TỬ</span>
                        <span class="chat-close-btn" id="chatCloseBtn">&times;</span>
                    </div>
                    <div class="chat-messages-area" id="chatMessagesArea">
                        <!-- Messages will be injected here -->
                    </div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chatInputField" class="chat-input-field" placeholder="Nhập tin nhắn..." autocomplete="off">
                        <button id="chatSendBtn" class="chat-send-btn">GỬI</button>
                    </div>
                </div>
            </div>
        `;
        document.body.prepend(container);

        // --- NGÔN NGỮ & USER INFO ---
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
        const savedLang = localStorage.getItem('kdrive_lang') || 'vi';
        updateHudLangUI(savedLang);

        const username = sessionStorage.getItem('kdrive_username');
        const isLoggedIn = !!username;
        if (isLoggedIn) {
            const userEl = document.getElementById('hudUserText');
            if (userEl) userEl.textContent = `USER: ${username.toUpperCase()}`;
        }

        // --- ĐỊNH VỊ GPS ---
        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        const gpsText = document.getElementById('hudGpsText');
        const gpsModalOverlay = document.getElementById('gpsModalOverlay');

        if (gpsVerified === 'true') {
            const cachedLat = sessionStorage.getItem('kdrive_gps_lat');
            const cachedLon = sessionStorage.getItem('kdrive_gps_lon');
            if (cachedLat && cachedLon) gpsText.textContent = `GPS: ${Number(cachedLat).toFixed(2)}N, ${Number(cachedLon).toFixed(2)}E`;
            else gpsText.textContent = "GPS: SYNCHRONIZED";
        } else if (gpsVerified === 'false') {
            gpsText.textContent = "GPS: OFFLINE";
        } else {
            if (gpsModalOverlay) gpsModalOverlay.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => handleGpsResponse(true));
        document.getElementById('gpsDenyBtn').addEventListener('click', () => handleGpsResponse(false));

        function handleGpsResponse(isAllowed) {
            playClickSound();
            if (gpsModalOverlay) gpsModalOverlay.classList.remove('active');

            if (isAllowed && navigator.geolocation) {
                gpsText.textContent = "GPS: LOCATING...";
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude; const lon = pos.coords.longitude;
                        sessionStorage.setItem('kdrive_gps_verified', 'true');
                        sessionStorage.setItem('kdrive_gps_lat', lat); sessionStorage.setItem('kdrive_gps_lon', lon);
                        gpsText.textContent = `GPS: ${lat.toFixed(2)}N, ${lon.toFixed(2)}E`;
                    },
                    () => {
                        sessionStorage.setItem('kdrive_gps_verified', 'false'); gpsText.textContent = "GPS: OFFLINE";
                    }, { timeout: 5000 }
                );
            } else {
                sessionStorage.setItem('kdrive_gps_verified', 'false'); gpsText.textContent = "GPS: OFFLINE";
            }
        }

        // --- KÊNH CHAT LƯỢNG TỬ ---
        const chatBadge = document.getElementById('hudChatText');
        const chatModal = document.getElementById('globalChatModalOverlay');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatMessages = document.getElementById('chatMessagesArea');
        const chatInput = document.getElementById('chatInputField');
        const chatSendBtn = document.getElementById('chatSendBtn');

        // Khóa input nếu chưa đăng nhập
        if (!isLoggedIn) {
            chatInput.disabled = true;
            chatSendBtn.disabled = true;
            chatInput.placeholder = "⚠ CHƯA ĐĂNG NHẬP / CẦN LOGIN ĐỂ CHAT";
        }

        // Dữ liệu Chat ảo (Lưu cục bộ LocalStorage)
        let chatData = JSON.parse(localStorage.getItem('kdrive_global_chat')) || [
            { user: 'HỆ THỐNG', text: 'Kênh Chat Lượng Tử trực tuyến. Vui lòng tuân thủ kỷ luật: Không Link, Không Ảnh, Không Toxic.', isSys: true }
        ];

        function renderChat() {
            chatMessages.innerHTML = '';
            chatData.forEach(msg => {
                const row = document.createElement('div');
                row.className = 'chat-msg-row' + (msg.isSys ? ' sys-msg' : '');
                
                const userColor = msg.isSys ? '#ff3366' : '#ffd700';
                row.innerHTML = `<span class="chat-user-name" style="color: ${userColor}">[${msg.user}]</span> ${msg.text}`;
                chatMessages.appendChild(row);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatBadge.addEventListener('click', () => {
            playClickSound();
            chatModal.classList.add('active');
            renderChat();
        });

        chatCloseBtn.addEventListener('click', () => {
            playClickSound();
            chatModal.classList.remove('active');
        });

        function sendChatMessage() {
            if (!isLoggedIn) return;
            const text = chatInput.value.trim();
            if (!text) return;

            // Bộ Lọc Kỷ Luật
            const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
            const imgExtRegex = /\.(jpeg|jpg|gif|png|webp|bmp)/gi;
            const swearRegex = /(địt|lồn|cặc|cac|lon|fuck|shit|bitch|ass|đm|vkl|vl|đéo)/gi;

            if (linkRegex.test(text) || imgExtRegex.test(text)) {
                playErrorSound();
                alert("⚠ LỖI KỶ LUẬT: Hệ thống nghiêm cấm chia sẻ đường dẫn (Link) hoặc Hình ảnh!");
                return;
            }
            if (swearRegex.test(text)) {
                playErrorSound();
                alert("⚠ LỖI KỶ LUẬT: Phát hiện từ ngữ vi phạm tiêu chuẩn Đạo Trường!");
                return;
            }

            playClickSound();
            chatData.push({ user: username.toUpperCase(), text: text });
            if (chatData.length > 50) chatData.shift(); // Giữ tối đa 50 tin nhắn mới nhất
            localStorage.setItem('kdrive_global_chat', JSON.stringify(chatData));
            
            chatInput.value = '';
            renderChat();
        }

        chatSendBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    });
})();
