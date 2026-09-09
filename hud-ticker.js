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
            /* THANH HUD TỐI GIẢN CHỈ CÓ QUẢ CẦU NGÔN NGỮ Ở PHÍA TRÊN */
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 50px !important;
                display: flex !important; justify-content: center !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 2147483647 !important; pointer-events: auto !important; box-shadow: none !important;
            }
            .hud-center { display: flex; justify-content: center; align-items: center; width: 100%; position: relative; }
            
            /* NÚT TRÁI ĐẤT TO VÀ NHẤP NHÁY THU HÚT */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.25); border: 2px solid #00e5ff;
                border-radius: 50%; width: 42px; height: 42px; color: #fff;
                font-size: 20px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 15px rgba(0,229,255,0.6);
                animation: pulseGlobe 1.5s infinite alternate ease-in-out;
                pointer-events: auto !important; z-index: 2147483648 !important;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.5); transform: scale(1.1); box-shadow: 0 0 25px #00e5ff; }

            @keyframes pulseGlobe {
                0% { transform: scale(1); box-shadow: 0 0 10px rgba(0,229,255,0.4); border-color: rgba(0,229,255,0.6); }
                100% { transform: scale(1.12); box-shadow: 0 0 22px rgba(0,229,255,0.9); border-color: #fff; }
            }

            /* BẢNG CHỌN NGÔN NGỮ TOÀN CẦU (Z-INDEX CAO NHẤT) */
            .global-lang-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(1, 3, 8, 0.95); backdrop-filter: blur(15px);
                z-index: 2147483650 !important; display: flex; justify-content: center; align-items: center;
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

            /* BẢNG GPS XÁC THỰC (NỀN ĐEN TUYỆT ĐỐI, KHÔNG ẢNH NỀN, KHÔNG LƯỚI TỔ ONG) */
            .gps-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483646 !important; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: all 0.4s ease; pointer-events: none;
                background-color: #020611 !important;
            }
            .gps-modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .gps-modal-dimmer { position: absolute; inset: 0; background: transparent; z-index: 1; }
            
            .gps-modal-box {
                width: 90%; max-width: 400px;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                z-index: 2; position: relative; padding: 25px 20px;
                background: rgba(3, 9, 23, 0.95); 
                border: 2px solid #ff007f; border-radius: 16px;
                box-shadow: 0 0 30px rgba(255, 0, 127, 0.4), inset 0 0 20px rgba(255, 0, 127, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .gps-modal-title {
                color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 900;
                text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 18px;
                text-shadow: 0 0 12px rgba(255, 51, 102, 1); z-index: 2; text-align: center;
            }
            
            .gps-modal-desc { 
                background: rgba(0, 0, 0, 0.85); border: 1.5px solid rgba(0, 229, 255, 0.4);
                border-radius: 12px; padding: 18px 16px; width: 100%; z-index: 2; box-sizing: border-box;
                margin-bottom: 22px; box-shadow: inset 0 0 20px #000;
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
                background: rgba(0,0,0,0.8);
            }
            .gps-btn-allow { border: 2px solid #00e5ff; color: #00e5ff; box-shadow: 0 0 12px rgba(0, 229, 255, 0.5); }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3); color: #fff; box-shadow: 0 0 22px #00e5ff; }
            
            .gps-btn-deny { border: 2px solid #ff003c; color: #ff003c; box-shadow: 0 0 12px rgba(255, 0, 60, 0.5); }
            .gps-btn-deny:hover { background: rgba(255, 0, 60, 0.3); color: #fff; box-shadow: 0 0 22px #ff003c; }
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
        gps_title: "XÁC THỰC GPS",
        gps_desc: "Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.",
        deny: "TỪ CHỐI", allow: "ĐỒNG Ý"
    };

    const globalTranslations = {
        vi: vietnameseData,
        en: {
            select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE",
            gps_title: "GPS VERIFICATION",
            gps_desc: "System requires location access to synchronize global Quantum Arena mapping.",
            deny: "DENY", allow: "ACCEPT"
        },
        zh: { select_lang_title: "选择全球语言", close_btn: "关闭", gps_title: "GPS 验证", gps_desc: "系统需要位置权限来同步全球量子竞技场映射。", deny: "拒绝", allow: "接受" },
        ja: { select_lang_title: "グローバル言語を選択", close_btn: "閉じる", gps_title: "GPS 認証", gps_desc: "グローバル量子アリーナマッピングを同期するには位置情報が必要です。", deny: "拒否", allow: "同意" },
        ko: { select_lang_title: "글로벌 언어 선택", close_btn: "닫기", gps_title: "GPS 인증", gps_desc: "글로벌 양자 아레나 매핑을 동기화하려면 위치 권한이 필요합니다.", deny: "거부", allow: "수락" },
        fr: { select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER", gps_title: "VÉRIFICATION GPS", gps_desc: "Le système requiert l'accès à la position pour synchroniser l'arène.", deny: "REFUSER", allow: "ACCEPTER" },
        de: { select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN", gps_title: "GPS-VERIFIZIERUNG", gps_desc: "Das System benötigt Standortzugriff zur Synchronisierung.", deny: "ABLEHNEN", allow: "AKZEPTIEREN" },
        es: { select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR", gps_title: "VERIFICACIÓN GPS", gps_desc: "El sistema requiere acceso a la ubicación.", deny: "DENEGAR", allow: "ACEPTAR" },
        ru: { select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ", gps_title: "ПРОВЕРКА GPS", gps_desc: "Системе требуется доступ к геолокации.", deny: "ОТКАЗАТЬ", allow: "ПРИНЯТЬ" },
        th: { select_lang_title: "เลือกภาษา", close_btn: "ปิด", gps_title: "การยืนยัน GPS", gps_desc: "ระบบต้องการสิทธิ์ตำแหน่งที่ตั้งเพื่อซิงค์ข้อมูล", deny: "ปฏิเสธ", allow: "ยอมรับ" },
        id: { select_lang_title: "PILIH BAHASA", close_btn: "TUTUP", gps_title: "VERIFIKASI GPS", gps_desc: "Sistem memerlukan akses lokasi.", deny: "TOLAK", allow: "TERIMA" },
        ar: { select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق", gps_title: "التحقق من الموقع", gps_desc: "يتطلب النظام إذن الموقع للمزامنة.", deny: "رفض", allow: "قبول" }
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
            <!-- THANH HUD TỐI GIẢN CHỈ CÓ QUẢ CẦU NGÔN NGỮ Ở TRÊN -->
            <div class="hud-top-bar">
                <div class="hud-center">
                    <button class="hud-lang-btn hudLangTrigger" title="Chọn ngôn ngữ">🌐</button>
                </div>
            </div>

            <!-- BẢNG CHỌN NGÔN NGỮ TOÀN CẦU -->
            <div class="global-lang-overlay" id="globalLangModal">
                <div class="global-lang-content">
                    <div class="global-lang-title" id="langModalTitleText">CHỌN NGÔN NGỮ QUỐC TẾ</div>
                    <div class="global-lang-grid">
                        <div class="global-lang-item" onclick="window.setGlobalLang('encoded')">⚛ Ký Hiệu Lượng Tử</div>
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

            <!-- BẢNG GPS XÁC THỰC (CHỈ CÓ BẢNG HOLOGRAM VÀ QUẢ CẦU) -->
            <div class="gps-modal-overlay active" id="gpsModalOverlay">
                <div class="gps-modal-dimmer"></div>
                <div class="gps-modal-box">
                    <div style="position: absolute; top: 14px; right: 14px; z-index: 10;">
                        <button class="hud-lang-btn hudLangTrigger" style="width: 34px; height: 34px; font-size: 15px;" title="Chọn ngôn ngữ">🌐</button>
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

            const gpsTitle = document.getElementById('gpsModalTitleText');
            const gpsDesc = document.getElementById('gpsDescText');
            const denyBtn = document.getElementById('gpsDenyBtn');
            const allowBtn = document.getElementById('gpsAllowBtn');

            if (gpsTitle) gpsTitle.innerText = processText(baseData.gps_title);
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

        document.getElementById('gpsAllowBtn').addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('active');
            sessionStorage.setItem('kdrive_gps_verified', 'true');
        });
        document.getElementById('gpsDenyBtn').addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('active');
            sessionStorage.setItem('kdrive_gps_verified', 'false');
        });
    });
})();
