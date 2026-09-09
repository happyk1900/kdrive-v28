(function() {
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 50px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 9.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
                pointer-events: auto !important; box-shadow: none !important;
                opacity: 0; visibility: hidden; transition: opacity 0.5s ease;
            }
            .hud-top-bar.active { opacity: 1; visibility: visible; }

            .hud-left { display: flex; flex-direction: column; gap: 1px; width: 38%; text-align: left; }
            .hud-center { display: flex; justify-content: center; align-items: center; width: 24%; position: relative; }
            .hud-right { display: flex; flex-direction: column; gap: 1px; width: 38%; text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 5px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 8px rgba(0,255,102,0.8); }
            
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 6px rgba(255,0,127,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 9px; }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.8); cursor: pointer; pointer-events: auto; }

            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.25); border: 2px solid #00e5ff;
                border-radius: 50%; width: 38px; height: 38px; color: #fff;
                font-size: 18px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 15px rgba(0,229,255,0.6);
                animation: pulseGlobe 1.5s infinite alternate ease-in-out;
                pointer-events: auto !important; z-index: 2147483648 !important;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.5); transform: scale(1.1); box-shadow: 0 0 25px #00e5ff; }

            @keyframes pulseGlobe {
                0% { transform: scale(1); box-shadow: 0 0 10px rgba(0,229,255,0.4); border-color: rgba(0,229,255,0.6); }
                100% { transform: scale(1.12); box-shadow: 0 0 22px rgba(0,229,255,0.9); border-color: #fff; }
            }

            .global-lang-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(1, 3, 8, 0.95); backdrop-filter: blur(15px);
                z-index: 2147483650 !important; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: 0.3s ease; pointer-events: none;
            }
            .global-lang-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .global-lang-content {
                width: 90%; max-width: 360px; max-height: 85vh; overflow-y: auto;
                background: rgba(5, 12, 22, 0.98); border: 1.5px solid #00e5ff; border-radius: 14px;
                padding: 20px; box-shadow: 0 0 40px rgba(0, 229, 255, 0.4);
                display: flex; flex-direction: column; align-items: center;
            }
            .global-lang-title {
                color: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900;
                text-transform: uppercase; margin-bottom: 12px; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,215,0,0.7);
            }
            
            .global-alien-top-btn {
                width: 100%; padding: 12px; margin-bottom: 10px; background: rgba(0, 229, 255, 0.15);
                border: 1px solid rgba(0, 229, 255, 0.6); border-radius: 8px; cursor: pointer;
                display: flex; justify-content: center; align-items: center;
                font-size: 24px; animation: alienBlink 1.5s infinite ease-in-out;
                box-shadow: 0 0 15px rgba(0, 229, 255, 0.3); transition: 0.2s;
            }
            .global-alien-top-btn:hover { background: rgba(0, 229, 255, 0.3); box-shadow: 0 0 25px #00e5ff; }

            @keyframes alienBlink {
                0%, 100% { opacity: 1; text-shadow: 0 0 12px #00e5ff, 0 0 25px #00e5ff; border-color: rgba(0, 229, 255, 0.9); }
                50% { opacity: 0.3; text-shadow: 0 0 3px #00e5ff; border-color: rgba(0, 229, 255, 0.3); }
            }

            .global-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 15px; }
            .global-lang-item {
                background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.25);
                color: #ffffff; padding: 10px; border-radius: 6px; font-size: 11px; font-weight: 700;
                text-align: center; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
            }
            .global-lang-item:hover { background: rgba(0, 229, 255, 0.3); border-color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); color: #ffd700; }
            .global-lang-close {
                width: 100%; padding: 10px; background: rgba(255, 0, 60, 0.2); border: 1px solid #ff003c;
                color: #ff3333; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase;
            }

            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 9px; }
            .signal-bar { width: 2px; background-color: #00ff66; box-shadow: 0 0 5px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 3px; }
            .signal-bar:nth-child(2) { height: 6px; }
            .signal-bar:nth-child(3) { height: 9px; }
            @keyframes signalPulse { 0% { opacity: 0.3; transform: scaleY(0.6); } 100% { opacity: 1; transform: scaleY(1); } }

            /* CẢNH 1: ẢNH NỀN CASSETTE FULL MÀN HÌNH - HIỆN THANH HUD SẴN SÀNG */
            .gps-modal-overlay {
                position: fixed; inset: 0; width: 100vw; height: 100vh; height: 100dvh;
                z-index: 2147483645 !important; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
                background-image: url('https://raw.githubusercontent.com/happyk1900/-m-thanh-app/main/ANH%20CASSETTE%20(1).png');
                background-size: cover; background-position: center; background-repeat: no-repeat;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            
            .gps-modal-box {
                position: absolute; width: 84%; max-width: 320px;
                top: 48%; left: 50%; transform: translate(-50%, -50%);
                display: flex; flex-direction: column; align-items: center;
                padding: 35px 14px 18px 14px; background: transparent; border: none; box-shadow: none;
                z-index: 2147483646 !important;
            }
            
            .cassette-lang-btn {
                position: absolute; top: 4px; right: 8px;
                background: rgba(0, 229, 255, 0.2); border: 1.5px solid #00e5ff;
                border-radius: 50%; width: 32px; height: 32px; color: #fff;
                font-size: 15px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 12px rgba(0,229,255,0.5);
                animation: pulseGlobe 1.5s infinite alternate ease-in-out;
                z-index: 2147483648 !important; pointer-events: auto !important;
            }
            .cassette-lang-btn:hover { background: rgba(0, 229, 255, 0.4); transform: scale(1.1); box-shadow: 0 0 20px #00e5ff; }

            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(0, 229, 255, 0.3);
                border-radius: 8px; padding: 12px 10px; width: 100%; box-sizing: border-box;
                margin-bottom: 15px; backdrop-filter: blur(4px);
            }
            .gps-modal-desc p { 
                color: #e0f7fa; font-size: 11.5px; line-height: 1.5; 
                font-family: 'Space Grotesk', sans-serif; margin-bottom: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.9); text-align: center;
            }
            
            .gps-btn-row { display: flex; gap: 10px; justify-content: center; width: 100%; }
            
            .gps-action-btn {
                flex: 1; padding: 10px 4px; border-radius: 8px; font-family: 'Montserrat', sans-serif;
                font-size: 11px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
                text-align: center; white-space: nowrap; letter-spacing: 1px;
                background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
            }
            .gps-btn-allow { border: 1.5px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 10px rgba(0, 229, 255, 0.4); }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 18px #00e5ff; }
            
            .gps-btn-deny { border: 1.5px solid #ff003c; color: #ff003c; box-shadow: 0 0 10px rgba(255, 0, 60, 0.4); }
            .gps-btn-deny:hover { background: rgba(255, 0, 60, 0.3); color: #fff; box-shadow: 0 0 18px #ff003c; }
        `;
        document.head.appendChild(style);
    }

    const quantumMap = {
        'a': '⟡', 'á': '⟡⁺', 'à': '⟡₋', 'ả': '⟡∼', 'ã': '⟡≈', 'ạ': '⟡•',
        'â': '⌖', 'ấ': '⌖⁺', 'ầ': '⌖₋', 'ẩ': '⌖∼', 'ẫ': '⌖≈', 'ậ': '⌖•',
        'ă': '⍜', 'ắ': '⍜⁺', 'ằ': '⍜₋', 'ẳ': '⍜∼', 'ẵ': '⍜≈', 'ặ': '⍜•',
        'b': '❖', 'c': '⟨', 'd': '⎔', 'đ': '⟠',
        'e': '⟍', 'é': '⟍⁺', 'è': '⟍₋', 'ẻ': '⟍∼', 'ẽ': '⟍≈', 'ẹ': '⟍•',
        'ê': '⍎', 'ế': '⍎⁺', 'ề': '⍎₋', 'ể': '⍎∼', 'ễ': '⍎≈', 'ệ': '⍎•',
        'g': '◎', 'h': '☩', 'i': '║', 'í': '║⁺', 'ì': '║₋', 'ỉ': '║∼', 'ĩ': '║≈', 'ị': '║•',
        'k': '⎈', 'l': '⫷', 'm': '☲', 'n': '☱',
        'o': '⨀', 'ó': '⨀⁺', 'ò': '⨀₋', 'ỏ': '⨀∼', 'õ': '⨀≈', 'ọ': '⨀•',
        'ô': '⍜', 'ố': '⍜⁺', 'ồ': '⍜₋', 'ổ': '⍜∼', 'ỗ': '⍜≈', 'ộ': '⍜•',
        'ơ': '⍥', 'ớ': '⍥⁺', 'ờ': '⍥₋', 'ở': '⍥∼', 'ỡ': '⍥≈', 'ợ': '⍥•',
        'p': '⨁', 'q': '⍟', 'r': 'Ⱬ', 's': '⟡', 't': '⍂',
        'u': '⋃', 'ú': '⋃⁺', 'ù': '⋃₋', 'ủ': '⋃∼', 'ũ': '⋃≈', 'ụ': '⋃•',
        'ư': '⋲', 'ứ': '⋲⁺', 'ừ': '⋲₋', 'ử': '⋲∼', 'ữ': '⋲≈', 'ự': '⋲•',
        'v': '⟁', 'x': '⨂', 'y': '⋫', 'ý': '⋫⁺', 'ỳ': '⋫₋', 'ỷ': '⋫∼', 'ỹ': '⋫≈', 'ỵ': '⋫•',
        '2': '⟡', '6': '⌖', '.': '•', '/': '╱', '-': '─', ' ': ' '
    };

    function encodeQuantum(text) {
        if (!text) return '';
        return text.split('').map(char => {
            const lower = char.toLowerCase();
            return quantumMap[lower] !== undefined ? quantumMap[lower] : char;
        }).join('');
    }

    const vietnameseData = {
        select_lang_title: "CHỌN NGÔN NGỮ QUỐC TẾ", close_btn: "ĐÓNG LẠI",
        sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: NGOẠI TUYẾN", chat: "GLOBAL CHAT 9+",
        kdrive: "K-DRIVE v2.6", date: "2026.09.06",
        gps_title: "XÁC THỰC GPS",
        gps_desc: "Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.",
        deny: "TỪ CHỐI", allow: "ĐỒNG Ý"
    };

    const globalTranslations = {
        vi: vietnameseData,
        en: {
            select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE",
            sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: OFFLINE", chat: "GLOBAL CHAT 9+",
            kdrive: "K-DRIVE v2.6", date: "2026.09.06",
            gps_title: "GPS VERIFICATION",
            gps_desc: "System requires location access to synchronize global Quantum Arena mapping.",
            deny: "DENY", allow: "ACCEPT"
        },
        zh: { select_lang_title: "选择全球语言", close_btn: "关闭", sys: "系统.在线", user: "用户: 访客", gps: "GPS: 离线", chat: "全球聊天 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "GPS 验证", gps_desc: "系统需要位置权限来同步全球量子竞技场映射。", deny: "拒绝", allow: "接受" },
        ja: { select_lang_title: "グローバル言語を選択", close_btn: "閉じる", sys: "SYS.オンライン", user: "ユーザー: ゲスト", gps: "GPS: オフライン", chat: "グローバルチャット 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "GPS 認証", gps_desc: "グローバル量子アリーナマッピングを同期するには位置情報が必要です。", deny: "拒否", allow: "同意" },
        ko: { select_lang_title: "글로벌 언어 선택", close_btn: "닫기", sys: "SYS.온라인", user: "유저: 게스트", gps: "GPS: 오프라인", chat: "글로벌 채팅 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "GPS 인증", gps_desc: "글로벌 양자 아레나 매핑을 동기화하려면 위치 권한이 필요합니다.", deny: "거부", allow: "수락" },
        fr: { select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER", sys: "SYS.EN LIGNE", user: "UTILISATEUR: INVITÉ", gps: "GPS: HORS LIGNE", chat: "CHAT GLOBAL 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "VÉRIFICATION GPS", gps_desc: "Le système requiert l'accès à la position pour synchroniser l'arène.", deny: "REFUSER", allow: "ACCEPTER" },
        de: { select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN", sys: "SYS.ONLINE", user: "BENUTZER: GAST", gps: "GPS: OFFLINE", chat: "GLOBALES CHAT 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "GPS-VERIFIZIERUNG", gps_desc: "Das System benötigt Standortzugriff zur Synchronisierung.", deny: "ABLEHNEN", allow: "AKZEPTIEREN" },
        es: { select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR", sys: "SYS.EN LÍNEA", user: "USUARIO: INVITADO", gps: "GPS: DESCONECTADO", chat: "CHAT GLOBAL 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "VERIFICACIÓN GPS", gps_desc: "El sistema requiere acceso a la ubicación.", deny: "DENEGAR", allow: "ACEPTAR" },
        ru: { select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ", sys: "СИСТЕМА.ОНЛАЙН", user: "ПОЛЬЗОВАТЕЛЬ: ГОСТЬ", gps: "GPS: ОФФЛАЙН", chat: "ГЛОБАЛЬНЫЙ ЧАТ 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "ПРОВЕРКА GPS", gps_desc: "Системе требуется доступ к геолокации.", deny: "ОТКАЗАТЬ", allow: "ПРИНЯТЬ" },
        th: { select_lang_title: "เลือกภาษา", close_btn: "ปิด", sys: "ระบบ.ออนไลน์", user: "ผู้ใช้: แขก", gps: "GPS: ออฟไลน์", chat: "แชท Global 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "การยืนยัน GPS", gps_desc: "ระบบต้องการสิทธิ์ตำแหน่งที่ตั้งเพื่อซิงค์ข้อมูล", deny: "ปฏิเสธ", allow: "ยอมรับ" },
        id: { select_lang_title: "PILIH BAHASA", close_btn: "TUTUP", sys: "SYS.ONLINE", user: "PENGGUNA: TAMU", gps: "GPS: OFFLINE", chat: "GLOBAL CHAT 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "VERIFIKASI GPS", gps_desc: "Sistem memerlukan akses lokasi.", deny: "TOLAK", allow: "TERIMA" },
        ar: { select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق", sys: "النظام متصل", user: "المستخدم: ضيف", gps: "GPS: غير متصل", chat: "الدردشة العالمية 9+", kdrive: "K-DRIVE v2.6", date: "2026.09.06", gps_title: "التحقق من الموقع", gps_desc: "يتطلب النظام إذن الموقع للمزامنة.", deny: "رفض", allow: "قبول" }
    };

    function playClickSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch(e){}
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('kdriveGlobalHud')) return;

        const container = document.createElement('div');
        container.id = 'kdriveGlobalHud';
        container.innerHTML = `
            <div class="hud-top-bar" id="hudTopBar">
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
                    <button class="hud-lang-btn hudLangTrigger" title="Chọn ngôn ngữ">🌐</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;" id="hudKdriveText">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <div class="global-lang-overlay" id="globalLangModal">
                <div class="global-lang-content">
                    <div class="global-lang-title" id="langModalTitleText">CHỌN NGÔN NGỮ QUỐC TẾ</div>
                    
                    <div class="global-alien-top-btn" onclick="window.setGlobalLang('encoded')" title="Ký Hiệu Lượng Tử">👽</div>

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

            <div class="gps-modal-overlay active" id="gpsModalOverlay">
                <div class="gps-modal-box">
                    <button class="cassette-lang-btn hudLangTrigger" title="Chọn ngôn ngữ">🌐</button>

                    <div class="gps-modal-desc">
                        <p id="gpsDescText">Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.</p>
                    </div>
                    <div class="gps-btn-row">
                        <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn">TỪ CHỐI</button>
                        <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn">ĐỒNG Ý</button>
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
        };

        function updateHudLangUI(lang) {
            const isEncoded = (lang === 'encoded' || !globalTranslations[lang]);
            const baseData = vietnameseData;
            const processText = (text) => isEncoded ? encodeQuantum(text) : text;

            const sysText = document.getElementById('hudSysText');
            const userText = document.getElementById('hudUserText');
            const gpsTextVal = document.getElementById('hudGpsText');
            const chatBadge = document.getElementById('hudChatText');
            const kdriveText = document.getElementById('hudKdriveText');
            const dateText = document.getElementById('hudDateText');

            const gpsDesc = document.getElementById('gpsDescText');
            const denyBtn = document.getElementById('gpsDenyBtn');
            const allowBtn = document.getElementById('gpsAllowBtn');

            if (sysText) sysText.innerText = processText(baseData.sys);
            if (userText) userText.innerText = processText(baseData.user);
            if (gpsTextVal) gpsTextVal.innerText = processText(baseData.gps);
            if (chatBadge) chatBadge.innerText = processText(baseData.chat);
            if (kdriveText) kdriveText.innerText = processText(baseData.kdrive);
            if (dateText) dateText.innerText = processText(baseData.date);

            if (gpsDesc) gpsDesc.innerText = processText(baseData.gps_desc);
            if (denyBtn) denyBtn.innerText = processText(baseData.deny);
            if (allowBtn) allowBtn.innerText = processText(baseData.allow);

            const t = globalTranslations[lang] || baseData;
            if (document.getElementById('langModalTitleText')) document.getElementById('langModalTitleText').innerText = processText(t.select_lang_title);
            if (document.getElementById('langModalCloseBtn')) document.getElementById('langModalCloseBtn').innerText = processText(t.close_btn);
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.hudLangTrigger')) {
                e.preventDefault();
                e.stopPropagation();
                window.openGlobalLang();
            }
        });

        const savedLang = localStorage.getItem('kdrive_lang') || 'encoded';
        updateHudLangUI(savedLang);

        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', playClickSound);
        });

        const modalOverlay = document.getElementById('gpsModalOverlay');
        const hudTopBar = document.getElementById('hudTopBar');

        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        if (gpsVerified === 'true' || gpsVerified === 'false') {
            if (modalOverlay) modalOverlay.classList.remove('active');
            if (hudTopBar) hudTopBar.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('active');
            if (hudTopBar) hudTopBar.classList.add('active');
            sessionStorage.setItem('kdrive_gps_verified', 'true');
        });
        document.getElementById('gpsDenyBtn').addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('active');
            if (hudTopBar) hudTopBar.classList.add('active');
            sessionStorage.setItem('kdrive_gps_verified', 'false');
        });
    });
})();
