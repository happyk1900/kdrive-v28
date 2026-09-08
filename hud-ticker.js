(function() {
    // 1. Nạp font Sci-Fi độc quyền (Quantum Glyph Font) kết hợp font chuẩn
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&family=Orbitron:wght@700;900&display=swap';
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
            .hud-center { display: flex; justify-content: center; align-items: center; width: 30%; position: relative; }
            .hud-right { display: flex; flex-direction: column; gap: 2px; width: 35%; text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 6px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 10px rgba(0,255,102,0.8); }
            
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.8); }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.8); cursor: pointer; }

            /* NÚT TRÁI ĐẤT TO VÀ NHẤP NHÁY THU HÚT */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.25); border: 2px solid #00e5ff;
                border-radius: 50%; width: 42px; height: 42px; color: #fff;
                font-size: 20px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 20px rgba(0,229,255,0.6);
                animation: pulseGlobe 1.5s infinite alternate ease-in-out;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.5); transform: scale(1.1); box-shadow: 0 0 30px #00e5ff; }

            @keyframes pulseGlobe {
                0% { transform: scale(1); box-shadow: 0 0 10px rgba(0,229,255,0.4); border-color: rgba(0,229,255,0.6); }
                100% { transform: scale(1.12); box-shadow: 0 0 25px rgba(0,229,255,0.9); border-color: #fff; }
            }

            .guide-pointer-anim {
                position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
                color: #00ff66; font-size: 14px; font-weight: bold; text-shadow: 0 0 8px #00ff66;
                animation: bounceGuide 1s infinite ease-in-out; pointer-events: none;
            }
            @keyframes bounceGuide {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-5px); }
            }

            /* HỆ THỐNG MÃ HÓA FONT (KHI CHƯA GIẢI MÃ SẼ DÙNG FONT ORBITRON / KÝ HIỆU) */
            .quantum-encoded {
                font-family: 'Orbitron', sans-serif !important;
                letter-spacing: 2px !important;
                filter: contrast(150%);
            }
            .quantum-encoded::after {
                content: " 𝚫";
                font-size: 9px;
                color: #ff007f;
            }

            /* BẢNG CHỌN NGÔN NGỮ TOÀN CẦU */
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

            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 10px; }
            .signal-bar { width: 2.5px; background-color: #00ff66; box-shadow: 0 0 6px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
            .signal-bar:nth-child(2) { height: 7px; animation-delay: 0.3s; }
            .signal-bar:nth-child(3) { height: 10px; animation-delay: 0.6s; }
            @keyframes signalPulse { 0% { opacity: 0.3; transform: scaleY(0.6); } 100% { opacity: 1; transform: scaleY(1); } }

            /* BẢNG GPS XÁC THỰC */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
                background-color: #050a15; 
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20HUD%20(1).png?raw=true'); 
                background-size: cover; background-position: center; background-repeat: no-repeat;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            
            .gps-modal-dimmer { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
            
            .gps-modal-box {
                width: 90%; max-width: 400px;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                z-index: 2; position: relative; padding: 25px 20px;
                background: transparent; 
                border: 2px solid #ff007f; border-radius: 16px;
                box-shadow: 0 0 25px rgba(255, 0, 127, 0.5), inset 0 0 15px rgba(255, 0, 127, 0.2);
            }
            
            .gps-modal-title {
                color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;
                text-shadow: 0 0 15px rgba(255, 51, 102, 1), 0 0 5px rgba(0,0,0,0.8); z-index: 1; text-align: center; line-height: 1.4;
            }
            
            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.75); border: 1.5px solid rgba(0, 229, 255, 0.4);
                border-radius: 12px; padding: 20px 18px; width: 100%; z-index: 1; box-sizing: border-box;
                margin-bottom: 25px; backdrop-filter: blur(8px); box-shadow: inset 0 0 20px #000;
            }
            .gps-modal-desc p { 
                color: #e0f7fa; font-size: 13.5px; line-height: 1.6; 
                font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            }
            .gps-modal-desc p:last-child { margin-bottom: 0; color: #a0c0d0; font-style: italic; }
            
            .gps-btn-row { display: flex; gap: 15px; justify-content: center; width: 100%; z-index: 1; }
            
            .gps-action-btn {
                flex: 1; padding: 14px 5px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
                font-size: 12.5px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
                text-align: center; white-space: nowrap; letter-spacing: 1px;
                backdrop-filter: blur(2px); background: rgba(0,0,0,0.6);
            }
            .gps-btn-allow { 
                border: 2px solid #00e5ff; color: #00e5ff; 
                box-shadow: 0 0 15px rgba(0, 229, 255, 0.5), inset 0 0 10px rgba(0,229,255,0.3); 
            }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 25px #00e5ff; transform: translateY(-2px); }
            
            .gps-btn-deny { 
                border: 2px solid #ff3366; color: #ff3366; 
                box-shadow: 0 0 15px rgba(255, 51, 102, 0.5), inset 0 0 10px rgba(255,51,102,0.3);
            }
            .gps-btn-deny:hover { background: rgba(255, 51, 102, 0.3); color: #fff; box-shadow: 0 0 25px #ff3366; transform: translateY(-2px); }

            /* BẢNG KÊNH CHAT LƯỢNG TỬ */
            .chat-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483648; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.3s ease; pointer-events: none;
                background-color: #050a15; 
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/GPS%20NEN.jpg?raw=true');
                background-size: cover; background-position: center; background-repeat: no-repeat;
            }
            .chat-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .chat-modal-dimmer { position: absolute; inset: 0; background: rgba(0,0,0,0.6); z-index: 1; backdrop-filter: blur(5px); }
            
            .chat-modal-box {
                width: 92%; max-width: 420px; height: 75vh; max-height: 600px;
                background: transparent; border: 2px solid #00e5ff; border-radius: 12px; padding: 15px;
                display: flex; flex-direction: column; z-index: 2;
                box-shadow: 0 0 30px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.2);
                position: relative;
            }
            .chat-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 229, 255, 0.3); padding-bottom: 10px; margin-bottom: 15px; }
            .chat-title { color: #00e5ff; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900; text-transform: uppercase; text-shadow: 0 0 10px rgba(0, 229, 255, 0.8); }
            .chat-close-btn { color: #ff3366; background: transparent; border: none; font-size: 20px; font-weight: bold; cursor: pointer; text-shadow: 0 0 8px rgba(255,51,102,0.8); padding: 0 5px; }
            .chat-messages { flex: 1; background: rgba(5, 12, 22, 0.85); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 8px; padding: 15px; overflow-y: auto; margin-bottom: 15px; box-shadow: inset 0 0 20px rgba(0,0,0,0.9); }
            .sys-chat-msg { background: rgba(255, 51, 102, 0.15); border-left: 3px solid #ff3366; padding: 10px; border-radius: 4px; color: #e0f7fa; font-family: 'Space Grotesk', sans-serif; font-size: 13px; line-height: 1.5; margin-bottom: 10px; }
            .sys-tag { color: #ff3366; font-weight: bold; font-family: 'Share Tech Mono', monospace; }
            .chat-input-area { display: flex; gap: 10px; }
            .chat-input { flex: 1; background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 51, 102, 0.5); border-radius: 8px; padding: 12px; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 13px; outline: none; }
            .chat-send-btn { background: rgba(255, 51, 102, 0.15); border: 1px solid #ff3366; color: #ff3366; border-radius: 8px; padding: 0 20px; font-family: 'Montserrat', sans-serif; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        `;
        document.head.appendChild(style);
    }

    const globalTranslations = {
        encoded: { select_lang_title: "𝚫-𝚲𝚯𝚸-𝚭", close_btn: "𝚫𝚬𝚴𝚼", chat_title: "𝚾-𝚲𝚰𝚴𝚮 𝚾", chat_placeholder: "⚠ 𝚫𝚲𝚬𝚺𝚻", chat_send: "𝚺𝚬𝚴𝚫", chat_sys_msg: "◼◼◼ 𝚱-𝚫𝚹𝚨 𝚲𝚰𝚴𝚮 𝚻Ự ◼◼◼", sys: "𝚫-𝚲𝚯𝚸.𝟶𝟾", user: "𝚬-𝚾𝚼: 𝚪𝚼𝚬", gps: "𝚪𝚷𝚼: 𝚯𝚺𝚲", chat: "𝚾-𝚲𝚰𝚴𝚮 𝟡+" },
        vi: { select_lang_title: "CHỌN NGÔN NGỮ QUỐC TẾ", close_btn: "ĐÓNG LẠI", chat_title: "KÊNH CHAT LƯỢNG TỬ", chat_placeholder: "⚠ Yêu cầu đăng nhập", chat_send: "GỬI", chat_sys_msg: "Kênh Chat Lượng Tử đã mở. Hãy tôn trọng Kỷ Luật.", sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: OFFLINE", chat: "GLOBAL CHAT 9+" },
        en: { select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE", chat_title: "QUANTUM CHAT", chat_placeholder: "⚠ Login required", chat_send: "SEND", chat_sys_msg: "Quantum Chat active. Respect Discipline rules.", sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: OFFLINE", chat: "GLOBAL CHAT 9+" },
        zh: { select_lang_title: "选择全球语言", close_btn: "关闭", chat_title: "量子聊天", chat_placeholder: "⚠ 需要登录", chat_send: "发送", chat_sys_msg: "量子聊天已激活。请遵守纪律。", sys: "系统.在线", user: "用户: 访客", gps: "GPS: 离线", chat: "全球聊天 9+" },
        ja: { select_lang_title: "グローバル言語を選択", close_btn: "閉じる", chat_title: "量子チャット", chat_placeholder: "⚠ ログインが必要", chat_send: "送信", chat_sys_msg: "量子チャットがアクティブです。規律を守ってください。", sys: "SYS.オンライン", user: "ユーザー: ゲスト", gps: "GPS: オフライン", chat: "グローバルチャット 9+" },
        ko: { select_lang_title: "글로벌 언어 선택", close_btn: "닫기", chat_title: "양자 채팅", chat_placeholder: "⚠ 로그인 필요", chat_send: "전송", chat_sys_msg: "양자 채팅 활성화됨. 규율을 존중하십시오.", sys: "SYS.온라인", user: "유저: 게스트", gps: "GPS: 오프라인", chat: "글로벌 채팅 9+" },
        fr: { select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER", chat_title: "CHAT QUANTIQUE", chat_placeholder: "⚠ Connexion requise", chat_send: "ENVOYER", chat_sys_msg: "Chat quantique actif. Respectez les règles.", sys: "SYS.EN LIGNE", user: "UTILISATEUR: INVITÉ", gps: "GPS: HORS LIGNE", chat: "CHAT GLOBAL 9+" },
        de: { select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN", chat_title: "QUANTEN-CHAT", chat_placeholder: "⚠ Anmeldung erforderlich", chat_send: "SENDEN", chat_sys_msg: "Quanten-Chat aktiv. Respektiere die Regeln.", sys: "SYS.ONLINE", user: "BENUTZER: GAST", gps: "GPS: OFFLINE", chat: "GLOBALES CHAT 9+" },
        es: { select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR", chat_title: "CHAT CUÁNTICO", chat_placeholder: "⚠ Inicio de sesión req.", chat_send: "ENVIAR", chat_sys_msg: "Chat cuántico activo. Respete las reglas.", sys: "SYS.EN LÍNEA", user: "USUARIO: INVITADO", gps: "GPS: DESCONECTADO", chat: "CHAT GLOBAL 9+" },
        ru: { select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ", chat_title: "КВАНТОВЫЙ ЧАТ", chat_placeholder: "⚠ Требуется вход", chat_send: "ОТПРАВИТЬ", chat_sys_msg: "Квантовый чат активен. Соблюдайте правила.", sys: "СИСТЕМА.ОНЛАЙН", user: "ПОЛЬЗОВАТЕЛЬ: ГОСТЬ", gps: "GPS: ОФФЛАЙН", chat: "ГЛОБАЛЬНЫЙ ЧАТ 9+" },
        th: { select_lang_title: "เลือกภาษา", close_btn: "ปิด", chat_title: "แชทควอนตัม", chat_placeholder: "⚠ ต้องการเข้าสู่ระบบ", chat_send: "ส่ง", chat_sys_msg: "เปิดใช้งานแชทควอนตัมแล้ว โปรดเคารพกฎ", sys: "ระบบ.ออนไลน์", user: "ผู้ใช้: แขก", gps: "GPS: ออฟไลน์", chat: "แชท Global 9+" },
        id: { select_lang_title: "PILIH BAHASA", close_btn: "TUTUP", chat_title: "OBROLAN KUANTUM", chat_placeholder: "⚠ Wajib login", chat_send: "KIRIM", chat_sys_msg: "Obrolan Kuantum aktif. Hormati aturan Disiplin.", sys: "SYS.ONLINE", user: "PENGGUNA: TAMU", gps: "GPS: OFFLINE", chat: "CHAT GLOBAL 9+" },
        ar: { select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق", chat_title: "الدردشة الكمومية", chat_placeholder: "⚠ تسجيل الدخول مطلوب", chat_send: "إرسال", chat_sys_msg: "الدردشة الكمومية نشطة. احترم قواعد الانضباط.", sys: "النظام متصل", user: "المستخدم: ضيف", gps: "GPS: غير متصل", chat: "الدردشة العالمية 9+" }
    };

    function playClickSound() {
        try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){}
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('kdriveGlobalHud')) return;

        const container = document.createElement('div');
        container.id = 'kdriveGlobalHud';
        container.innerHTML = `
            <!-- THANH HUD CHÍNH -->
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
                    <div class="guide-pointer-anim">▼</div>
                    <button class="hud-lang-btn" id="hudLangOpenBtn" title="Chọn ngôn ngữ / Select Language">🌐</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <!-- BẢNG CHỌN NGÔN NGỮ ĐỦ 12 NƯỚC -->
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

            <!-- BẢNG GPS XÁC THỰC -->
            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-dimmer"></div>
                <div class="gps-modal-box">
                    <div class="gps-modal-title" id="gpsModalTitleText">🛰️ XÁC THỰC GPS / GPS VERIFICATION</div>
                    <div class="gps-modal-desc">
                        <p id="gpsDesc1">🇻🇳 Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.</p>
                        <p id="gpsDesc2">🇬🇧 System requires location access to synchronize global Quantum Arena mapping.</p>
                    </div>
                    <div class="gps-btn-row">
                        <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn">TỪ CHỐI / DENY</button>
                        <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn">ĐỒNG Ý / ACCEPT</button>
                    </div>
                </div>
            </div>

            <!-- BẢNG KÊNH CHAT LƯỢNG TỬ -->
            <div class="chat-modal-overlay" id="chatModalOverlay">
                <div class="chat-modal-dimmer"></div>
                <div class="chat-modal-box">
                    <div class="chat-header">
                        <div class="chat-title" id="chatTitleText">📡 KÊNH CHAT LƯỢNG TỬ</div>
                        <button class="chat-close-btn" id="chatCloseBtn">✖</button>
                    </div>
                    <div class="chat-messages">
                        <div class="sys-chat-msg">
                            <span class="sys-tag">[SYS.AI]</span> <span id="chatSysMsgText">Kênh Chat Lượng Tử đã mở. Hãy tôn trọng Kỷ Luật.</span>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chatInputBox" placeholder="⚠ Yêu cầu đăng nhập" disabled>
                        <button class="chat-send-btn" id="chatSendBtn">GỬI</button>
                    </div>
                </div>
            </div>
        `;
        document.body.prepend(container);

        window.openGlobalLang = function() { playClickSound(); document.getElementById('globalLangModal').classList.add('active'); };
        window.closeGlobalLang = function() { playClickSound(); document.getElementById('globalLangModal').classList.remove('active'); };
        
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
            
            const t = globalTranslations[lang] || globalTranslations['encoded'];
            const isEncoded = (lang === 'encoded');

            // Cập nhật các đoạn text trên HUD
            const sysText = document.getElementById('hudSysText');
            const userText = document.getElementById('hudUserText');
            const gpsTextVal = document.getElementById('hudGpsText');
            const chatBadge = document.getElementById('hudChatText');

            if (sysText) sysText.innerText = t.sys;
            if (userText) userText.innerText = t.user;
            if (gpsTextVal) gpsTextVal.innerText = t.gps;
            if (chatBadge) chatBadge.innerText = t.chat;

            // Xử lý bật/tắt font mã hóa lượng tử (Orbitron style)
            [sysText, userText, gpsTextVal, chatBadge].forEach(el => {
                if (el) {
                    if (isEncoded) el.classList.add('quantum-encoded');
                    else el.classList.remove('quantum-encoded');
                }
            });

            // Cập nhật các modal khác
            if (document.getElementById('langModalTitleText')) document.getElementById('langModalTitleText').innerText = t.select_lang_title;
            if (document.getElementById('langModalCloseBtn')) document.getElementById('langModalCloseBtn').innerText = t.close_btn;

            if (document.getElementById('chatTitleText')) document.getElementById('chatTitleText').innerHTML = "📡 " + t.chat_title;
            if (document.getElementById('chatInputBox')) document.getElementById('chatInputBox').placeholder = t.chat_placeholder;
            if (document.getElementById('chatSendBtn')) document.getElementById('chatSendBtn').innerText = t.chat_send;
            if (document.getElementById('chatSysMsgText')) document.getElementById('chatSysMsgText').innerText = t.chat_sys_msg;
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);

        // Mặc định nếu chưa chọn gì sẽ để chế độ mã hóa lượng tử ('encoded')
        const savedLang = localStorage.getItem('kdrive_lang') || 'encoded';
        updateHudLangUI(savedLang);

        // Logic tên User từ session
        const username = sessionStorage.getItem('kdrive_username');
        if (username) {
            const userEl = document.getElementById('hudUserText');
            if (userEl) userEl.textContent = `USER: ${username.toUpperCase()}`;
        }

        // Logic mở bảng Chat
        const chatBadge = document.getElementById('hudChatText');
        const chatOverlay = document.getElementById('chatModalOverlay');
        const chatCloseBtn = document.getElementById('chatCloseBtn');

        if (chatBadge) {
            chatBadge.addEventListener('click', () => {
                playClickSound();
                if(chatOverlay) chatOverlay.classList.add('active');
            });
        }
        if (chatCloseBtn) {
            chatCloseBtn.addEventListener('click', () => {
                playClickSound();
                if(chatOverlay) chatOverlay.classList.remove('active');
            });
        }
        document.getElementById('chatSendBtn').addEventListener('click', playClickSound);

        // Logic GPS
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
