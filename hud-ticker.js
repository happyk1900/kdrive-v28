(function() {
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&family=Share+Tech+Mono&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 55px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 2147483647 !important; font-family: 'Share Tech Mono', monospace !important; font-size: 11px !important; color: #00e5ff !important; letter-spacing: 1.5px !important;
                pointer-events: auto !important; box-shadow: none !important;
            }
            .hud-left { display: flex; flex-direction: column; gap: 2px; width: 35%; text-align: left; }
            .hud-center { display: flex; justify-content: center; align-items: center; width: 30%; position: relative; }
            .hud-right { display: flex; flex-direction: column; gap: 2px; width: 35%; text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 6px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 10px rgba(0,255,102,0.8); }
            
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.8); }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.8); cursor: pointer; }

            /* QUẢ CẦU / TRÁI ĐẤT TO VÀ NHẤP NHÁY LIÊN TỤC */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.3); border: 2.5px solid #00e5ff;
                border-radius: 50%; width: 46px; height: 46px; color: #fff;
                font-size: 22px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 25px rgba(0,229,255,0.8);
                animation: pulseGlobe 1.2s infinite alternate ease-in-out;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.6); transform: scale(1.15); box-shadow: 0 0 35px #00e5ff; }

            @keyframes pulseGlobe {
                0% { transform: scale(1); box-shadow: 0 0 12px rgba(0,229,255,0.5); border-color: rgba(0,229,255,0.7); }
                100% { transform: scale(1.18); box-shadow: 0 0 30px #00ff66; border-color: #00ff66; }
            }

            .guide-pointer-anim {
                position: absolute; top: -24px; left: 50%; transform: translateX(-50%);
                color: #00ff66; font-size: 15px; font-weight: bold; text-shadow: 0 0 10px #00ff66;
                animation: bounceGuide 0.9s infinite ease-in-out; pointer-events: none;
            }
            @keyframes bounceGuide {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-6px); }
            }

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
            .global-lang-title {
                color: #ffd700; font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: 900;
                text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,215,0,0.7);
            }
            .global-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 15px; }
            .global-lang-item {
                background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25);
                color: #ffffff; padding: 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
                text-align: center; cursor: pointer; transition: 0.2s; font-family: 'Share Tech Mono', monospace;
            }
            .global-lang-item:hover { background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); color: #ffd700; }
            .global-lang-close {
                width: 100%; padding: 10px; background: rgba(255, 0, 60, 0.2); border: 1px solid #ff003c;
                color: #ff3333; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase;
                font-family: 'Share Tech Mono', monospace;
            }

            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 10px; }
            .signal-bar { width: 2.5px; background-color: #00ff66; box-shadow: 0 0 6px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
            .signal-bar:nth-child(2) { height: 7px; animation-delay: 0.3s; }
            .signal-bar:nth-child(3) { height: 10px; animation-delay: 0.6s; }
            @keyframes signalPulse { 0% { opacity: 0.3; transform: scaleY(0.6); } 100% { opacity: 1; transform: scaleY(1); } }

            /* BẢNG GPS CÓ ẢNH NỀN VIỄN TƯỞNG VÀ MÃ HÓA 100% MẶC ĐỊNH */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
                background-color: #050a15;
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/GPS%20NEN.jpg?raw=true');
                background-size: cover; background-position: center; background-repeat: no-repeat;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .gps-modal-dimmer { position: absolute; inset: 0; background: rgba(0,0,0,0.65); z-index: 1; }
            
            .gps-modal-box {
                width: 90%; max-width: 400px;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                z-index: 2; position: relative; padding: 25px 20px;
                background: rgba(5, 12, 22, 0.9);
                border: 2px solid #ff007f; border-radius: 16px;
                box-shadow: 0 0 25px rgba(255, 0, 127, 0.5), inset 0 0 15px rgba(255, 0, 127, 0.2);
            }
            
            .gps-modal-title {
                color: #ff3366; font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;
                text-shadow: 0 0 10px rgba(255, 51, 102, 0.8); z-index: 1; text-align: center; line-height: 1.5;
            }
            
            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.75); border: 1px solid rgba(0, 229, 255, 0.3);
                border-radius: 12px; padding: 20px 18px; width: 100%; z-index: 1; box-sizing: border-box;
                margin-bottom: 25px; backdrop-filter: blur(4px);
            }
            .gps-modal-desc p { 
                color: #e0f7fa; font-size: 13px; line-height: 1.6; 
                font-family: 'Share Tech Mono', monospace; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                letter-spacing: 1px;
            }
            .gps-modal-desc p:last-child { margin-bottom: 0; color: #a0c0d0; }
            
            .gps-btn-row { display: flex; gap: 15px; justify-content: center; width: 100%; z-index: 1; }
            
            .gps-action-btn {
                flex: 1; padding: 14px 5px; border-radius: 10px; font-family: 'Share Tech Mono', monospace;
                font-size: 12px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
                text-align: center; white-space: nowrap; letter-spacing: 1.5px;
            }
            .gps-btn-allow { 
                background: rgba(0, 229, 255, 0.15); border: 2px solid #00e5ff; color: #00e5ff; 
                box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); 
            }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 25px #00e5ff; }
            
            .gps-btn-deny { 
                background: rgba(255, 51, 102, 0.15); border: 2px solid #ff3366; color: #ff3366; 
                box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
            }
            .gps-btn-deny:hover { background: rgba(255, 51, 102, 0.4); color: #fff; box-shadow: 0 0 25px #ff3366; }
        `;
        document.head.appendChild(style);
    }

    const hudDictionary = {
        encoded: {
            sys: "𝚫-𝚲𝚯𝚸.𝟶𝟾",
            user: "𝚬-𝚾𝚼: 𝚪𝚼𝚬𝚺𝚻",
            gps: "𝚪𝚷𝚼: 𝚯𝚺𝚲",
            version: "𝚱-𝚫𝚹𝚨 v2.6",
            date: "𝟚𝟘𝟚𝟞.𝟘𝟡.𝟘𝟞",
            chat: "𝚾-𝚲𝚰𝚴𝚮 𝟡+",
            modal_title: "CHỌN NGÔN NGỮ QUỐC TẾ",
            close_btn: "ĐÓNG LẠI",
            gps_title: "🛰️ 𝚫-𝚲𝚯𝚸-𝚭 /<br>𝚪𝚷𝚼 𝚫𝚲𝚬𝚺𝚻",
            gps_p1: "◼◼◼ 𝚱-𝚫𝚹𝚨 𝚲𝚰𝚴𝚮 𝚻Ự 𝚫𝚲𝚬𝚺𝚻 𝚪𝚷𝚼 ◼◼◼",
            gps_p2: ">>> 𝚨𝚱𝚻𝚰𝚳 𝚺𝚼𝚴𝚾 𝚪𝚰𝚫 <<<",
            deny: "𝚫𝚬𝚴𝚼 / 𝚾",
            allow: "𝚨𝚱𝚻𝚬𝚷𝚻 / ✔"
        },
        vi: {
            sys: "SYS.ONLINE",
            user: "USER: GUEST",
            gps: "GPS: NGOẠI TUYẾN",
            version: "K-DRIVE v2.6",
            date: "2026.09.06",
            chat: "GLOBAL CHAT 9+",
            modal_title: "CHỌN NGÔN NGỮ QUỐC TẾ",
            close_btn: "ĐÓNG LẠI",
            gps_title: "🛰️ XÁC THỰC GPS /<br>GPS VERIFICATION",
            gps_p1: "🇻🇳 Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.",
            gps_p2: "🇬🇧 System requires location access to synchronize global Quantum Arena mapping.",
            deny: "TỪ CHỐI / DENY",
            allow: "ĐỒNG Ý / ACCEPT"
        },
        en: {
            sys: "SYS.ONLINE",
            user: "USER: GUEST",
            gps: "GPS: OFFLINE",
            version: "K-DRIVE v2.6",
            date: "2026.09.06",
            chat: "GLOBAL CHAT 9+",
            modal_title: "SELECT GLOBAL LANGUAGE",
            close_btn: "CLOSE",
            gps_title: "🛰️ GPS VERIFICATION /<br>XÁC THỰC GPS",
            gps_p1: "🇬🇧 System requires location access to synchronize global Quantum Arena mapping.",
            gps_p2: "🇻🇳 Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.",
            deny: "DENY",
            allow: "ACCEPT"
        },
        zh: {
            sys: "系统.在线", user: "用户: 访客", gps: "GPS: 离线", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "全球聊天 9+", modal_title: "选择全球语言", close_btn: "关闭",
            gps_title: "🛰️ GPS 验证", gps_p1: "🇨🇳 系统需要位置权限来同步全球量子竞技场映射。", gps_p2: "🌐 System requires location access.", deny: "拒绝", allow: "接受"
        },
        ja: {
            sys: "SYS.オンライン", user: "ユーザー: ゲスト", gps: "GPS: オフライン", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "グローバルチャット 9+", modal_title: "グローバル言語を選択", close_btn: "閉じる",
            gps_title: "🛰️ GPS 認証", gps_p1: "🇯🇵 グローバル量子アリーナマッピングを同期するには位置情報が必要です。", gps_p2: "🌐 System requires location access.", deny: "拒否", allow: "同意"
        },
        ko: {
            sys: "SYS.온라인", user: "유저: 게스트", gps: "GPS: 오프라인", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "글로벌 채팅 9+", modal_title: "글로벌 언어 선택", close_btn: "닫기",
            gps_title: "🛰️ GPS 인증", gps_p1: "🇰🇷 글로벌 양자 아레나 매핑을 동기화하려면 위치 권한이 필요합니다.", gps_p2: "🌐 System requires location access.", deny: "거부", allow: "수락"
        },
        fr: {
            sys: "SYS.EN LIGNE", user: "UTILISATEUR: INVITÉ", gps: "GPS: HORS LIGNE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER",
            gps_title: "🛰️ VÉRIFICATION GPS", gps_p1: "🇫🇷 Le système requiert l'accès à la position pour synchroniser l'arène.", gps_p2: "🌐 System requires location access.", deny: "REFUSER", allow: "ACCEPTER"
        },
        de: {
            sys: "SYS.ONLINE", user: "BENUTZER: GAST", gps: "GPS: OFFLINE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "GLOBALES CHAT 9+", modal_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN",
            gps_title: "🛰️ GPS-VERIFIZIERUNG", gps_p1: "🇩🇪 Das System benötigt Standortzugriff zur Synchronisierung.", gps_p2: "🌐 System requires location access.", deny: "ABLEHNEN", allow: "AKZEPTIEREN"
        },
        es: {
            sys: "SYS.EN LÍNEA", user: "USUARIO: INVITADO", gps: "GPS: DESCONECTADO", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR",
            gps_title: "🛰️ VERIFICACIÓN GPS", gps_p1: "🇪🇸 El sistema requiere acceso a la ubicación.", gps_p2: "🌐 System requires location access.", deny: "DENEGAR", allow: "ACEPTAR"
        },
        ru: {
            sys: "СИСТЕМА.ОНЛАЙН", user: "ПОЛЬЗОВАТЕЛЬ: ГОСТЬ", gps: "GPS: ОФФЛАЙН", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "ГЛОБАЛЬНЫЙ ЧАТ 9+", modal_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ",
            gps_title: "🛰️ ПРОВЕРКА GPS", gps_p1: "🇷🇺 Системе требуется доступ к геолокации.", gps_p2: "🌐 System requires location access.", deny: "ОТКАЗАТЬ", allow: "ПРИНЯТЬ"
        },
        th: {
            sys: "ระบบ.ออนไลน์", user: "ผู้ใช้: แขก", gps: "GPS: ออฟไลน์", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "แชท Global 9+", modal_title: "เลือกภาษา", close_btn: "ปิด",
            gps_title: "🛰️ การยืนยัน GPS", gps_p1: "🇹🇭 ระบบต้องการสิทธิ์ตำแหน่งที่ตั้งเพื่อซิงค์ข้อมูล", gps_p2: "🌐 System requires location access.", deny: "ปฏิเสธ", allow: "ยอมรับ"
        },
        id: {
            sys: "SYS.ONLINE", user: "PENGGUNA: TAMU", gps: "GPS: OFFLINE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "PILIH BAHASA", close_btn: "TUTUP",
            gps_title: "🛰️ VERIFIKASI GPS", gps_p1: "🇮🇩 Sistem memerlukan akses lokasi.", gps_p2: "🌐 System requires location access.", deny: "TOLAK", allow: "TERIMA"
        },
        ar: {
            sys: "النظام متصل", user: "المستخدم: ضيف", gps: "GPS: غير متصل", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "الدردشة العالمية 9+", modal_title: "اختر اللغة العالمية", close_btn: "إغلاق",
            gps_title: "🛰️ التحقق من الموقع", gps_p1: "🇸🇦 يتطلب النظام إذن الموقع للمزامنة.", gps_p2: "🌐 System requires location access.", deny: "رفض", allow: "قبول"
        }
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
                <div class="hud-left">
                    <div class="hud-sys-row">
                        <div class="signal-bars">
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                            <div class="signal-bar"></div>
                        </div>
                        <span class="hud-sys-online" id="hudSysText"></span>
                    </div>
                    <span style="color: #fff;" id="hudUserText"></span>
                    <span class="hud-gps" id="hudGpsText"></span>
                </div>

                <div class="hud-center">
                    <div class="guide-pointer-anim">▼</div>
                    <button class="hud-lang-btn" id="hudLangOpenBtn" title="Chọn ngôn ngữ / Select Language">🌐</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;" id="hudVerText"></span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText"></span>
                    <span class="hud-chat-badge" id="hudChatText"></span>
                </div>
            </div>

            <!-- Modal bảng chọn ngôn ngữ -->
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

            <!-- BẢNG GPS CÓ ẢNH NỀN VÀ MÃ HÓA HOÀN TOÀN MẶC ĐỊNH -->
            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-dimmer"></div>
                <div class="gps-modal-box">
                    <div class="gps-modal-title" id="gpsTitleNode"></div>
                    <div class="gps-modal-desc">
                        <p id="gpsP1Node"></p>
                        <p id="gpsP2Node"></p>
                    </div>
                    <div class="gps-btn-row">
                        <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn"></button>
                        <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn"></button>
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
            applyLanguageToHud(lang);
            window.closeGlobalLang();
            window.dispatchEvent(new CustomEvent('kdriveLangChanged', { detail: { lang } }));
        };

        function applyLanguageToHud(langKey) {
            const data = hudDictionary[langKey] || hudDictionary['encoded'];
            
            document.getElementById('hudSysText').innerText = data.sys;
            document.getElementById('hudUserText').innerText = data.user;
            document.getElementById('hudGpsText').innerText = data.gps;
            document.getElementById('hudVerText').innerText = data.version;
            document.getElementById('hudDateText').innerText = data.date;
            document.getElementById('hudChatText').innerText = data.chat;
            
            document.getElementById('langModalTitleText').innerText = data.modal_title;
            document.getElementById('langModalCloseBtn').innerText = data.close_btn;

            document.getElementById('gpsTitleNode').innerHTML = data.gps_title;
            document.getElementById('gpsP1Node').innerText = data.gps_p1;
            document.getElementById('gpsP2Node').innerText = data.gps_p2;
            document.getElementById('gpsDenyBtn').innerText = data.deny;
            document.getElementById('gpsAllowBtn').innerText = data.allow;
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);

        const savedLang = localStorage.getItem('kdrive_lang');
        if (savedLang && hudDictionary[savedLang]) {
            applyLanguageToHud(savedLang);
        } else {
            applyLanguageToHud('encoded');
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

        // BẮT BUỘC HIỆN BẢNG GPS NẾU CHƯA XÁC THỰC HOẶC LUÔN HIỆN Ở LẦN ĐẦU
        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        const gpsText = document.getElementById('hudGpsText');
        const modalOverlay = document.getElementById('gpsModalOverlay');

        if (gpsVerified === 'true') {
            const cachedLat = sessionStorage.getItem('kdrive_gps_lat');
            const cachedLon = sessionStorage.getItem('kdrive_gps_lon');
            const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
            const dict = hudDictionary[currentLang] || hudDictionary['encoded'];
            gpsText.textContent = cachedLat ? `GPS: ${Number(cachedLat).toFixed(2)}N` : dict.gps_sync;
        } else if (gpsVerified === 'false') {
            const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
            const dict = hudDictionary[currentLang] || hudDictionary['encoded'];
            gpsText.textContent = dict.gps_off;
        } else {
            if (modalOverlay) modalOverlay.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => handleGpsResponse(true));
        document.getElementById('gpsDenyBtn').addEventListener('click', () => handleGpsResponse(false));

        function handleGpsResponse(isAllowed) {
            playClickSound();
            if (modalOverlay) modalOverlay.classList.remove('active');

            const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
            const dict = hudDictionary[currentLang] || hudDictionary['encoded'];

            if (isAllowed && navigator.geolocation) {
                gpsText.textContent = dict.gps_loc;
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
                        gpsText.textContent = dict.gps_off;
                    },
                    { timeout: 5000 }
                );
            } else {
                sessionStorage.setItem('kdrive_gps_verified', 'false');
                gpsText.textContent = dict.gps_off;
            }
        }
    });
})();
