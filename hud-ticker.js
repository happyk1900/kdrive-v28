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
            /* THANH HUD 3 KHỐI TRONG SUỐT */
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 50px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 2147483647 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 9.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
                pointer-events: auto !important; box-shadow: none !important;
            }
            .hud-left { display: flex; flex-direction: column; gap: 1px; width: 38%; text-align: left; }
            .hud-center { display: flex; justify-content: center; align-items: center; width: 24%; position: relative; }
            .hud-right { display: flex; flex-direction: column; gap: 1px; width: 38%; text-align: right; color: rgba(255,255,255,0.85); }
            
            .hud-sys-row { display: flex; align-items: center; gap: 5px; }
            .hud-sys-online { color: #00ff66; font-weight: 900; text-shadow: 0 0 8px rgba(0,255,102,0.8); }
            
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 6px rgba(255,0,127,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 9px; }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 8px rgba(255,215,0,0.8); cursor: pointer; }

            /* NÚT TRÁI ĐẤT TO VÀ NHẤP NHÁY THU HÚT */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.25); border: 2px solid #00e5ff;
                border-radius: 50%; width: 38px; height: 38px; color: #fff;
                font-size: 18px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 15px rgba(0,229,255,0.6);
                animation: pulseGlobe 1.5s infinite alternate ease-in-out;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.5); transform: scale(1.1); box-shadow: 0 0 25px #00e5ff; }

            @keyframes pulseGlobe {
                0% { transform: scale(1); box-shadow: 0 0 10px rgba(0,229,255,0.4); border-color: rgba(0,229,255,0.6); }
                100% { transform: scale(1.12); box-shadow: 0 0 22px rgba(0,229,255,0.9); border-color: #fff; }
            }

            /* BẢNG CHỌN NGÔN NGỮ TOÀN CẦU */
            .global-lang-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(1, 3, 8, 0.92); backdrop-filter: blur(15px);
                z-index: 2147483649; display: flex; justify-content: center; align-items: center;
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

            .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 9px; }
            .signal-bar { width: 2px; background-color: #00ff66; box-shadow: 0 0 5px rgba(0,255,102,0.8); animation: signalPulse 1.2s infinite ease-in-out alternate; }
            .signal-bar:nth-child(1) { height: 3px; }
            .signal-bar:nth-child(2) { height: 6px; }
            .signal-bar:nth-child(3) { height: 9px; }
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
                color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 18px;
                text-shadow: 0 0 12px rgba(255, 51, 102, 1); z-index: 2; text-align: center;
            }
            
            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.75); border: 1.5px solid rgba(0, 229, 255, 0.4);
                border-radius: 12px; padding: 18px 16px; width: 100%; z-index: 2; box-sizing: border-box;
                margin-bottom: 22px; backdrop-filter: blur(8px); box-shadow: inset 0 0 20px #000;
            }
            .gps-modal-desc p { 
                color: #e0f7fa; font-size: 13px; line-height: 1.6; 
                font-family: 'Space Grotesk', sans-serif; margin-bottom: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.8); text-align: center;
            }
            
            .gps-btn-row { display: flex; gap: 15px; justify-content: center; width: 100%; z-index: 2; }
            
            .gps-action-btn {
                flex: 1; padding: 12px 5px; border-radius: 10px; font-family: 'Montserrat', sans-serif;
                font-size: 12px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s;
                text-align: center; white-space: nowrap; letter-spacing: 1px;
                background: rgba(0,0,0,0.6);
            }
            .gps-btn-allow { border: 2px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 12px rgba(0, 229, 255, 0.5); }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 22px #00e5ff; }
            
            .gps-btn-deny { border: 2px solid #ff3366; color: #ff3366; box-shadow: 0 0 12px rgba(255, 51, 102, 0.5); }
            .gps-btn-deny:hover { background: rgba(255, 51, 102, 0.3); color: #fff; box-shadow: 0 0 22px #ff3366; }
        `;
        document.head.appendChild(style);
    }

    // BẢNG ÁNH XẠ KÝ TỰ LƯỢNG TỬ (QUANTRUM CIPHER MAPPING 1-1 CHO TIẾNG VIỆT)
    const quantumMap = {
        'a': '⟡', 'á': '⟡⁺', 'à': '⟡₋', 'ả': '⟡∼', 'ã': '⟡≈', 'ạ': '⟡•',
        'â': '⌖', 'ấ': '⌖⁺', 'ầ': '⌖₋', 'ẩ': '⌖∼', 'ẫ': '⌖≈', 'ậ': '⌖•',
        'ă': '⍜', 'ắ': '⍜⁺', 'ằ': '⍜₋', 'ẳ': '⍜∼', 'ẵ': '⍜≈', 'ặ': '⍜•',
        'b': '⎈', 'c': '⌈', 'd': '⍚', 'đ': '⟬',
        'e': '⟍', 'é': '⟍⁺', 'è': '⟍₋', 'ẻ': '⟍∼', 'ẽ': '⟍≈', 'ẹ': '⟍•',
        'ê': '⍎', 'ế': '⍎⁺', 'ề': '⍎₋', 'ể': '⍎∼', 'ễ': '⍎≈', 'ệ': '⍎•',
        'g': '⍟', 'h': 'ℋ', 'i': '│', 'í': '│⁺', 'ì': '│₋', 'ỉ': '│∼', 'ĩ': '│≈', 'ị': '│•',
        'k': '𝒦', 'l': '⌊', 'm': 'ℳ', 'n': '𝒩',
        'o': '⨀', 'ó': '⨀⁺', 'ò': '⨀₋', 'ỏ': '⨀∼', 'õ': '⨀≈', 'ọ': '⨀•',
        'ô': '⍜', 'ố': '⍜⁺', 'ồ': '⍜₋', 'ổ': '⍜∼', 'ỗ': '⍜≈', 'ộ': '⍜•',
        'ơ': '⍥', 'ớ': '⍥⁺', 'ờ': '⍥₋', 'ở': '⍥∼', 'ỡ': '⍥≈', 'ợ': '⍥•',
        'p': '∏', 'q': 'ℚ', 'r': 'ℜ', 's': 'ξ', 't': 'τ',
        'u': '⋃', 'ú': '⋃⁺', 'ù': '⋃₋', 'ủ': '⋃∼', 'ũ': '⋃≈', 'ụ': '⋃•',
        'ư': '⋲', 'ứ': '⋲⁺', 'ừ': '⋲₋', 'ử': '⋲∼', 'ữ': '⋲≈', 'ự': '⋲•',
        'v': '∇', 'x': 'χ', 'y': '⋫', 'ý': '⋫⁺', 'ỳ': '⋫₋', 'ỷ': '⋫∼', 'ỹ': '⋫≈', 'ỵ': '⋫•',
        ' ': ' ', '.': '•', ',': '·', ':': '⁞', '-': '─', '9': '⟡', '+': '⊕'
    };

    function encodeQuantum(text) {
        if (!text) return '';
        return text.split('').map(char => {
            const lower = char.toLowerCase();
            return quantumMap[lower] !== undefined ? quantumMap[lower] : char;
        }).join('');
    }

    // NGÔN NGỮ GỐC TIẾNG VIỆT
    const vietnameseData = {
        select_lang_title: "CHỌN NGÔN NGỮ QUỐC TẾ", close_btn: "ĐÓNG LẠI",
        sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: NGOẠI TUYẾN", chat: "GLOBAL CHAT 9+",
        gps_title: "XÁC THỰC GPS",
        gps_desc: "Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.",
        deny: "TỪ CHỐI", allow: "ĐỒNG Ý"
    };

    const globalTranslations = {
        vi: vietnameseData,
        en: {
            select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE",
            sys: "SYS.ONLINE", user: "USER: GUEST", gps: "GPS: OFFLINE", chat: "GLOBAL CHAT 9+",
            gps_title: "GPS VERIFICATION",
            gps_desc: "System requires location access to synchronize global Quantum Arena mapping.",
            deny: "DENY", allow: "ACCEPT"
        },
        zh: { select_lang_title: "选择全球语言", close_btn: "关闭", sys: "系统.在线", user: "用户: 访客", gps: "GPS: 离线", chat: "全球聊天 9+", gps_title: "GPS 验证", gps_desc: "系统需要位置权限来同步全球量子竞技场映射。", deny: "拒绝", allow: "接受" },
        ja: { select_lang_title: "グローバル言語を選択", close_btn: "閉じる", sys: "SYS.オンライン", user: "ユーザー: ゲスト", gps: "GPS: オフライン", chat: "グローバルチャット 9+", gps_title: "GPS 認証", gps_desc: "グローバル量子アリーナマッピングを同期するには位置情報が必要です。", deny: "拒否", allow: "同意" },
        ko: { select_lang_title: "글로벌 언어 선택", close_btn: "닫기", sys: "SYS.온라인", user: "유저: 게스트", gps: "GPS: 오프라인", chat: "글로벌 채팅 9+", gps_title: "GPS 인증", gps_desc: "글로벌 양자 아레나 매핑을 동기화하려면 위치 권한이 필요합니다.", deny: "거부", allow: "수락" },
        fr: { select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER", sys: "SYS.EN LIGNE", user: "UTILISATEUR: INVITÉ", gps: "GPS: HORS LIGNE", chat: "CHAT GLOBAL 9+", gps_title: "VÉRIFICATION GPS", gps_desc: "Le système requiert l'accès à la position pour synchroniser l'arène.", deny: "REFUSER", allow: "ACCEPTER" },
        de: { select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN", sys: "SYS.ONLINE", user: "BENUTZER: GAST", gps: "GPS: OFFLINE", chat: "GLOBALES CHAT 9+", gps_title: "GPS-VERIFIZIERUNG", gps_desc: "Das System benötigt Standortzugriff zur Synchronisierung.", deny: "ABLEHNEN", allow: "AKZEPTIEREN" },
        es: { select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR", sys: "SYS.EN LÍNEA", user: "USUARIO: INVITADO", gps: "GPS: DESCONECTADO", chat: "GLOBAL CHAT 9+", gps_title: "VERIFICACIÓN GPS", gps_desc: "El sistema requiere acceso a la ubicación.", deny: "DENEGAR", allow: "ACEPTAR" },
        ru: { select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ", sys: "СИСТЕМА.ОНЛАЙН", user: "ПОЛЬЗОВАТЕЛЬ: ГОСТЬ", gps: "GPS: ОФФЛАЙН", chat: "ГЛОБАЛЬНЫЙ ЧАТ 9+", gps_title: "ПРОВЕРКА GPS", gps_desc: "Системе требуется доступ к геолокации.", deny: "ОТКАЗАТЬ", allow: "ПРИНЯТЬ" },
        th: { select_lang_title: "เลือกภาษา", close_btn: "ปิด", sys: "ระบบ.ออนไลน์", user: "ผู้ใช้: แขก", gps: "GPS: ออฟไลน์", chat: "แชท Global 9+", gps_title: "การยืนยัน GPS", gps_desc: "ระบบต้องการสิทธิ์ตำแหน่งที่ตั้งเพื่อซิงค์ข้อมูล", deny: "ปฏิเสธ", allow: "ยอมรับ" },
        id: { select_lang_title: "PILIH BAHASA", close_btn: "TUTUP", sys: "SYS.ONLINE", user: "PENGGUNA: TAMU", gps: "GPS: OFFLINE", chat: "CHAT GLOBAL 9+", gps_title: "VERIFIKASI GPS", gps_desc: "Sistem memerlukan akses lokasi.", deny: "TOLAK", allow: "TERIMA" },
        ar: { select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق", sys: "النظام متصل", user: "المستخدم: ضيف", gps: "GPS: غير متصل", chat: "الدردشة العالمية 9+", gps_title: "التحقق من الموقع", gps_desc: "يتطلب النظام إذن الموقع للمزامنة.", deny: "رفض", allow: "قبول" }
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
                    <div style="position: absolute; top: -20px; font-size: 11px; color: #00ff66; animation: bounceGuide 1s infinite ease-in-out;">▼</div>
                    <button class="hud-lang-btn" id="hudLangOpenBtn" title="Chọn ngôn ngữ">🌐</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <!-- BẢNG CHỌN NGÔN NGỮ TOÀN CẦU -->
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
                    <div style="position: absolute; top: 14px; right: 14px; z-index: 10;">
                        <button class="hud-lang-btn" style="width: 34px; height: 34px; font-size: 15px;" id="gpsModalLangBtn" title="Chọn ngôn ngữ">🌐</button>
                    </div>

                    <div class="gps-modal-title" id="gpsModalTitleText">XÁC THỰC GPS</div>
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
            // Lấy dữ liệu nguồn từ tiếng Việt, nếu chọn 'encoded' thì tự động chạy hàm mã hóa lượng tử 1-1
            const baseData = vietnameseData;
            const isEncoded = (lang === 'encoded');

            const processText = (text) => isEncoded ? encodeQuantum(text) : text;

            const sysText = document.getElementById('hudSysText');
            const userText = document.getElementById('hudUserText');
            const gpsTextVal = document.getElementById('hudGpsText');
            const chatBadge = document.getElementById('hudChatText');

            const gpsTitle = document.getElementById('gpsModalTitleText');
            const gpsDesc = document.getElementById('gpsDescText');
            const denyBtn = document.getElementById('gpsDenyBtn');
            const allowBtn = document.getElementById('gpsAllowBtn');

            if (sysText) sysText.innerText = processText(baseData.sys);
            if (userText) userText.innerText = processText(baseData.user);
            if (gpsTextVal) gpsTextVal.innerText = processText(baseData.gps);
            if (chatBadge) chatBadge.innerText = processText(baseData.chat);

            if (gpsTitle) gpsTitle.innerText = processText(baseData.gps_title);
            if (gpsDesc) gpsDesc.innerText = processText(baseData.gps_desc);
            if (denyBtn) denyBtn.innerText = processText(baseData.deny);
            if (allowBtn) allowBtn.innerText = processText(baseData.allow);

            const t = globalTranslations[lang] || baseData;
            if (document.getElementById('langModalTitleText')) document.getElementById('langModalTitleText').innerText = t.select_lang_title;
            if (document.getElementById('langModalCloseBtn')) document.getElementById('langModalCloseBtn').innerText = t.close_btn;
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);
        document.getElementById('gpsModalLangBtn').addEventListener('click', window.openGlobalLang);

        const savedLang = localStorage.getItem('kdrive_lang') || 'encoded';
        updateHudLangUI(savedLang);

        const username = sessionStorage.getItem('kdrive_username');
        if (username) {
            const userEl = document.getElementById('hudUserText');
            if (userEl) {
                const rawUser = `USER: ${username.toUpperCase()}`;
                const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
                userEl.innerText = (currentLang === 'encoded') ? encodeQuantum(rawUser) : rawUser;
            }
        }

        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', playClickSound);
        });

        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        const modalOverlay = document.getElementById('gpsModalOverlay');

        if (gpsVerified === 'true') {
            const cachedLat = sessionStorage.getItem('kdrive_gps_lat');
            const cachedLon = sessionStorage.getItem('kdrive_gps_lon');
            const gpsTextVal = document.getElementById('hudGpsText');
            if (cachedLat && cachedLon && gpsTextVal) {
                const val = `GPS: ${Number(cachedLat).toFixed(2)}N, ${Number(cachedLon).toFixed(2)}E`;
                const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
                gpsTextVal.innerText = (currentLang === 'encoded') ? encodeQuantum(val) : val;
            }
        } else if (gpsVerified !== 'false' && modalOverlay) {
            modalOverlay.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => handleGpsResponse(true));
        document.getElementById('gpsDenyBtn').addEventListener('click', () => handleGpsResponse(false));

        function handleGpsResponse(isAllowed) {
            if (modalOverlay) modalOverlay.classList.remove('active');
            const gpsTextVal = document.getElementById('hudGpsText');

            if (isAllowed && navigator.geolocation) {
                if (gpsTextVal) gpsTextVal.innerText = encodeQuantum("GPS: Đang định vị...");
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        sessionStorage.setItem('kdrive_gps_verified', 'true');
                        sessionStorage.setItem('kdrive_gps_lat', lat);
                        sessionStorage.setItem('kdrive_gps_lon', lon);
                        if (gpsTextVal) {
                            const val = `GPS: ${lat.toFixed(2)}N, ${lon.toFixed(2)}E`;
                            const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
                            gpsTextVal.innerText = (currentLang === 'encoded') ? encodeQuantum(val) : val;
                        }
                    },
                    () => {
                        sessionStorage.setItem('kdrive_gps_verified', 'false');
                        if (gpsTextVal) {
                            const val = "GPS: NGOẠI TUYẾN";
                            const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
                            gpsTextVal.innerText = (currentLang === 'encoded') ? encodeQuantum(val) : val;
                        }
                    },
                    { timeout: 5000 }
                );
            } else {
                sessionStorage.setItem('kdrive_gps_verified', 'false');
                if (gpsTextVal) {
                    const val = "GPS: NGOẠI TUYẾN";
                    const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
                    gpsTextVal.innerText = (currentLang === 'encoded') ? encodeQuantum(val) : val;
                }
            }
        }
    });
})();
