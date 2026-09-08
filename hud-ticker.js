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

            /* NÚT TRÁI ĐẤT SIÊU TO VÀ NHẤP NHÁY THU HÚT */
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
        `;
        document.head.appendChild(style);
    }

    // Từ điển song song: Mã hóa lượng tử độc quyền vs Ngôn ngữ thực tế
    const hudDictionary = {
        encoded: {
            sys: "𝚫-𝚲𝚯𝚸.𝟶𝟾",
            user: "𝚬-𝚾𝚼: 𝚪𝚼𝚬𝚺𝚻",
            gps: "𝚪𝚷𝚼: 𝚯𝚺𝚲",
            version: "𝚱-𝚫𝚹𝚨 v2.6",
            date: "𝟚𝟘𝟚𝟞.𝟘𝟡.𝟘𝟞",
            chat: "𝚾-𝚲𝚰𝚴𝚮 𝟡+",
            modal_title: "CHỌN NGÔN NGỮ QUỐC TẾ",
            close_btn: "ĐÓNG LẠI"
        },
        vi: {
            sys: "SYS.ONLINE",
            user: "USER: GUEST",
            gps: "GPS: NGOẠI TUYẾN",
            version: "K-DRIVE v2.6",
            date: "2026.09.06",
            chat: "GLOBAL CHAT 9+",
            modal_title: "CHỌN NGÔN NGỮ QUỐC TẾ",
            close_btn: "ĐÓNG LẠI"
        },
        en: {
            sys: "SYS.ONLINE",
            user: "USER: GUEST",
            gps: "GPS: OFFLINE",
            version: "K-DRIVE v2.6",
            date: "2026.09.06",
            chat: "GLOBAL CHAT 9+",
            modal_title: "SELECT GLOBAL LANGUAGE",
            close_btn: "CLOSE"
        },
        zh: {
            sys: "系统.在线", user: "用户: 访客", gps: "GPS: 离线", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "全球聊天 9+", modal_title: "选择全球语言", close_btn: "关闭"
        },
        ja: {
            sys: "SYS.オンライン", user: "ユーザー: ゲスト", gps: "GPS: オフライン", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "グローバルチャット 9+", modal_title: "グローバル言語を選択", close_btn: "閉じる"
        },
        ko: {
            sys: "SYS.온라인", user: "유저: 게스트", gps: "GPS: 오프라인", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "글로벌 채팅 9+", modal_title: "글로벌 언어 선택", close_btn: "닫기"
        },
        fr: {
            sys: "SYS.EN LIGNE", user: "UTILISATEUR: INVITÉ", gps: "GPS: HORS LIGNE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER"
        },
        de: {
            sys: "SYS.ONLINE", user: "BENUTZER: GAST", gps: "GPS: OFFLINE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "GLOBALES CHAT 9+", modal_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN"
        },
        es: {
            sys: "SYS.EN LÍNEA", user: "USUARIO: INVITADO", gps: "GPS: DESCONECTADO", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR"
        },
        ru: {
            sys: "СИСТЕМА.ОНЛАЙН", user: "ПОЛЬЗОВАТЕЛЬ: ГОСТЬ", gps: "GPS: ОФФЛАЙН", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "ГЛОБАЛЬНЫЙ ЧАТ 9+", modal_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ"
        },
        th: {
            sys: "ระบบ.ออนไลน์", user: "ผู้ใช้: แขก", gps: "GPS: ออฟไลน์", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "แชท Global 9+", modal_title: "เลือกภาษา", close_btn: "ปิด"
        },
        id: {
            sys: "SYS.ONLINE", user: "PENGGUNA: TAMU", gps: "GPS: OFFLINE", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "CHAT GLOBAL 9+", modal_title: "PILIH BAHASA", close_btn: "TUTUP"
        },
        ar: {
            sys: "النظام متصل", user: "المستخدم: ضيف", gps: "GPS: غير متصل", version: "K-DRIVE v2.6", date: "2026.09.06", chat: "الدردشة العالمية 9+", modal_title: "اختر اللغة العالمية", close_btn: "إغلاق"
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
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);

        // Mặc định ban đầu sẽ hiển thị hoàn toàn bằng mã hóa (encoded), trừ khi người dùng đã tự bấm chọn ngôn ngữ từ trước
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
    });
})();
