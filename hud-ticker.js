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
            /* THANH HUD BÊN TRONG GAME */
            .hud-top-bar {
                position: fixed !important; top: 10px !important; left: 10px !important; width: calc(100% - 20px) !important; height: 50px !important;
                display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 0 5px !important;
                background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                border: none !important; border-radius: 0 !important;
                z-index: 999950 !important; font-family: 'Space Grotesk', sans-serif !important; font-size: 9.5px !important; color: #00e5ff !important; letter-spacing: 1px !important;
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

            /* QUẢ CẦU HUD TĨNH, PHÁT SÁNG NHẸ (KHÔNG CÒN RUNG LẮC MẠNH) */
            .hud-lang-btn {
                background: rgba(0, 229, 255, 0.2); border: 2px solid #00e5ff;
                border-radius: 50%; width: 38px; height: 38px; color: #fff;
                font-size: 18px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 0 12px rgba(0,229,255,0.5);
                pointer-events: auto !important;
            }
            .hud-lang-btn:hover { background: rgba(0, 229, 255, 0.4); transform: scale(1.1); box-shadow: 0 0 20px #00e5ff; }

            /* BẢNG CHỌN NGÔN NGỮ PHỦ NỀN LƯỢNG TỬ ĐỘNG + HẠT BAY */
            .global-lang-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-image: url('https://raw.githubusercontent.com/happyk1900/-m-thanh-app/main/CHON%20NGON%20NGU.png') !important;
                background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important;
                z-index: 999999 !important; display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: 0.3s ease; pointer-events: none;
                animation: bgPanMove 20s infinite alternate linear;
            }
            .global-lang-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }

            @keyframes bgPanMove {
                0% { background-position: 0% 0%; }
                100% { background-position: 100% 100%; }
            }

            .quantum-particles-canvas {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 1;
            }
            
            .global-lang-content {
                position: relative; z-index: 2;
                width: 90%; max-width: 360px; max-height: 85vh; overflow-y: auto;
                background: rgba(3, 9, 22, 0.82); border: 2px solid #00e5ff; border-radius: 14px;
                padding: 20px; box-shadow: 0 0 40px rgba(0, 229, 255, 0.5), inset 0 0 20px rgba(0, 229, 255, 0.2);
                backdrop-filter: blur(10px);
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

            /* LỚP NỀN CASSETTE BỌC NGOÀI */
            .gps-modal-overlay {
                position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; height: 100dvh !important;
                z-index: 999900 !important; display: flex !important; justify-content: center !important; align-items: center !important;
                opacity: 0; visibility: hidden; transition: opacity 0.5s ease; pointer-events: none;
                background-color: #010204 !important; 
                background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important;
            }
            .gps-modal-overlay.active { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
            
            .gps-modal-box {
                position: absolute !important; width: 85% !important; max-width: 320px !important;
                top: 50% !important; left: 50% !important; 
                transform: translate(-50%, -40%) scale(0.95) !important;
                display: flex !important; flex-direction: column !important; align-items: center !important;
                padding: 16px 12px !important; background: transparent !important; border: none !important; box-shadow: none !important;
                z-index: 999910 !important;
                opacity: 0; visibility: hidden; 
                transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); 
            }
            .gps-modal-box.show-ui {
                opacity: 1; visibility: visible;
                transform: translate(-50%, -50%) scale(1) !important; 
            }

            .gps-modal-desc { 
                background: #000000 !important; border: 2px solid #00e5ff !important; 
                border-radius: 8px !important; padding: 14px 12px !important; width: 100% !important; box-sizing: border-box !important;
                margin-bottom: 15px !important; box-shadow: 0 0 15px rgba(0,229,255,0.3) !important;
            }
            .gps-modal-desc p { 
                color: #e0f7fa !important; font-size: 11.5px !important; line-height: 1.6 !important; 
                font-family: 'Space Grotesk', sans-serif !important; margin-bottom: 0 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.9) !important; text-align: center !important;
            }
            
            .gps-btn-row { display: flex !important; gap: 10px !important; justify-content: center !important; width: 100% !important; }
            
            /* ĐƯA HIỆU ỨNG NHỊP THỞ VÀ NHẤP NHÁY SANG HAI NÚT ACCEPT & DENY */
            .gps-action-btn {
                flex: 1 !important; padding: 10px 4px !important; border-radius: 8px !important; font-family: 'Montserrat', sans-serif !important;
                font-size: 11px !important; font-weight: 900 !important; text-transform: uppercase !important; cursor: pointer !important; transition: 0.3s !important;
                text-align: center !important; white-space: nowrap !important; letter-spacing: 1px !important;
                background: rgba(0,0,0,0.85) !important; backdrop-filter: blur(5px) !important;
                animation: buttonBreatheGPS 2s infinite ease-in-out !important;
            }
            .gps-btn-allow { border: 1.5px solid #00e5ff !important; color: #00e5ff !important; box-shadow: 0 0 12px rgba(0, 229, 255, 0.6) !important; }
            .gps-btn-allow:hover { background: rgba(0, 229, 255, 0.3) !important; color: #fff !important; box-shadow: 0 0 22px #00e5ff !important; }
            
            .gps-btn-deny { border: 1.5px solid #ff003c !important; color: #ff003c !important; box-shadow: 0 0 12px rgba(255, 0, 60, 0.6) !important; }
            .gps-btn-deny:hover { background: rgba(255, 0, 60, 0.3) !important; color: #fff !important; box-shadow: 0 0 22px #ff003c !important; }

            @keyframes buttonBreatheGPS {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.05); filter: brightness(1.25); }
            }
            
            .globe-pointer-wrapper {
                position: relative !important; display: flex !important; justify-content: center !important; align-items: center !important;
                margin-top: 25px !important; width: 100% !important;
            }

            /* QUẢ CẦU TĨNH Ở BẢNG CASSETTE */
            .cassette-lang-btn {
                position: relative !important; 
                background: rgba(0, 229, 255, 0.25) !important; border: 2px solid #00e5ff !important;
                border-radius: 50% !important; width: 42px !important; height: 42px !important; color: #fff !important;
                font-size: 20px !important; display: flex !important; align-items: center !important; justify-content: center !important;
                cursor: pointer !important; transition: 0.2s !important; 
                box-shadow: 0 0 15px rgba(0,229,255,0.5) !important;
                z-index: 999920 !important; pointer-events: auto !important;
            }
            .cassette-lang-btn:hover { background: rgba(0, 229, 255, 0.5) !important; transform: scale(1.1) !important; box-shadow: 0 0 25px #00e5ff !important; }

            /* NGÓN TAY CHỈ DI CHUYỂN QUA LẠI GIỮA HAI NÚT BẤM GPS */
            .finger-pointer {
                position: absolute !important;
                left: calc(50% - 30px) !important; 
                top: -55px !important; 
                width: 65px !important; 
                height: auto !important;
                z-index: 999930 !important; pointer-events: none !important;
                animation: fingerPointGPS 1.2s infinite alternate ease-in-out !important;
                filter: drop-shadow(0 0 10px #00e5ff) !important;
            }
            @keyframes fingerPointGPS {
                0% { transform: translateY(0px) scale(0.95); opacity: 0.8; }
                100% { transform: translateY(8px) scale(1.05); opacity: 1; }
            }
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

    let kdriveBgMusic = null;
    let particleAnimationId = null;

    // HÀM KÍCH HOẠT NHẠC NỀN CHUNG CHO MỌI ĐIỂM CHẠM TRONG LOGIN
    function triggerLoginMusic() {
        if (!kdriveBgMusic) {
            kdriveBgMusic = new Audio("https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/K_Drive_Initialized.mp3");
            kdriveBgMusic.loop = true; 
            kdriveBgMusic.volume = 0.9;
        }
        kdriveBgMusic.play().catch(e => console.log("Trình duyệt chặn phát nhạc tự động:", e));
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
                    <button class="hud-lang-btn hudLangTrigger" onclick="window.openGlobalLang()" title="Chọn ngôn ngữ">🌐</button>
                </div>

                <div class="hud-right">
                    <span style="color: #00e5ff;" id="hudKdriveText">K-DRIVE v2.6</span>
                    <span style="color: rgba(255,255,255,0.6);" id="hudDateText">2026.09.06</span>
                    <span class="hud-chat-badge" id="hudChatText">GLOBAL CHAT 9+</span>
                </div>
            </div>

            <div class="global-lang-overlay" id="globalLangModal">
                <canvas class="quantum-particles-canvas" id="quantumParticlesCanvas"></canvas>
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

            <div class="gps-modal-overlay" id="gpsModalOverlay">
                <div class="gps-modal-box" id="gpsModalBox">
                    <div class="gps-modal-desc">
                        <p id="gpsDescText">Hệ thống yêu cầu quyền định vị để đồng bộ Đấu trường Lượng tử toàn cầu.</p>
                    </div>
                    <div class="gps-btn-row">
                        <button class="gps-action-btn gps-btn-deny" id="gpsDenyBtn">TỪ CHỐI</button>
                        <button class="gps-action-btn gps-btn-allow" id="gpsAllowBtn">ĐỒNG Ý</button>
                    </div>
                    
                    <div class="globe-pointer-wrapper">
                        <button class="cassette-lang-btn" onclick="window.openGlobalLang()" title="Chọn ngôn ngữ">🌐</button>
                        <!-- NGÓN TAY CHỈ ĐỘNG GIỮA HAI NÚT GPS -->
                        <img src="https://github.com/happyk1900/-m-thanh-app/blob/main/Ngon%20tay.png?raw=true" class="finger-pointer" id="hudFingerPointer" alt="Pointer">
                    </div>
                </div>
            </div>
        `;
        document.body.prepend(container);

        if (!document.getElementById('booPlayerScript')) {
            const booScript = document.createElement('script');
            booScript.id = 'booPlayerScript';
            booScript.src = 'boo-player.js';
            document.body.appendChild(booScript);
        }

        function initQuantumParticles() {
            const canvas = document.getElementById('quantumParticlesCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let particlesArray = [];
            const numberOfParticles = 40;

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + Math.random() * 100;
                    this.size = Math.random() * 2.5 + 0.8;
                    this.speedY = Math.random() * 1.5 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 0.6;
                    this.color = Math.random() > 0.3 ? '#00e5ff' : '#ffd700';
                    this.alpha = Math.random() * 0.7 + 0.3;
                }
                update() {
                    this.y -= this.speedY;
                    this.x += this.speedX;
                    if (this.y < 0) {
                        this.y = canvas.height + 10;
                        this.x = Math.random() * canvas.width;
                    }
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.fillStyle = this.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                    particlesArray[i].draw();
                }
                particleAnimationId = requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }

        window.openGlobalLang = function() { 
            playClickSound(); 
            triggerLoginMusic(); // PHÁT NHẠC KHI MỞ BẢNG NGÔN NGỮ
            document.getElementById('globalLangModal').classList.add('active'); 
            setTimeout(initQuantumParticles, 100);
        };
        
        window.closeGlobalLang = function() { 
            playClickSound(); 
            document.getElementById('globalLangModal').classList.remove('active');
            if (particleAnimationId) cancelAnimationFrame(particleAnimationId);
        };
        
        window.setGlobalLang = function(lang) {
            playClickSound();
            triggerLoginMusic(); // PHÁT NHẠC KHI CHỌN NGÔN NGỮ
            localStorage.setItem('kdrive_lang', lang);
            updateHudLangUI(lang);
            window.closeGlobalLang();
        };

        function updateHudLangUI(lang) {
            const isEncoded = (lang === 'encoded');
            const t = globalTranslations[lang] || vietnameseData;
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

            if (sysText) sysText.innerText = processText(t.sys);
            if (userText) userText.innerText = processText(t.user);
            if (gpsTextVal) gpsTextVal.innerText = processText(t.gps);
            if (chatBadge) chatBadge.innerText = processText(t.chat);
            if (kdriveText) kdriveText.innerText = processText(t.kdrive);
            if (dateText) dateText.innerText = processText(t.date);

            if (gpsDesc) gpsDesc.innerText = processText(t.gps_desc);
            if (denyBtn) denyBtn.innerText = processText(t.deny);
            if (allowBtn) allowBtn.innerText = processText(t.allow);

            if (document.getElementById('langModalTitleText')) document.getElementById('langModalTitleText').innerText = processText(t.select_lang_title);
            if (document.getElementById('langModalCloseBtn')) document.getElementById('langModalCloseBtn').innerText = processText(t.close_btn);
        }

        const savedLang = localStorage.getItem('kdrive_lang') || 'encoded';
        updateHudLangUI(savedLang);

        // KÍCH HOẠT PHÁT NHẠC KHI BẤM BẤT CỨ NÚT NÀO TRONG MÀN HÌNH LOGIN
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                playClickSound();
                triggerLoginMusic();
            });
        });

        const modalOverlay = document.getElementById('gpsModalOverlay');
        const modalBox = document.getElementById('gpsModalBox');
        const hudTopBar = document.getElementById('hudTopBar');

        const gpsVerified = sessionStorage.getItem('kdrive_gps_verified');
        
        if (gpsVerified === 'true' || gpsVerified === 'false') {
            if (modalOverlay) modalOverlay.classList.remove('active');
            if (hudTopBar) hudTopBar.classList.add('active');
        } else {
            if (modalOverlay) {
                modalOverlay.classList.add('active'); 
                
                const bgUrl = 'https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20GPS%20LOFI.png?raw=true';
                const bgImg = new Image();
                bgImg.src = bgUrl;
                
                bgImg.onload = () => {
                    modalOverlay.style.backgroundImage = `url('${bgUrl}')`;
                    setTimeout(() => {
                        if(modalBox) modalBox.classList.add('show-ui');
                    }, 250); 
                };
            }
        }

        // KHI BẤM NÚT ĐỒNG Ý HOẶC TỪ CHỐI GPS -> DỪNG NHẠC (HẾT PHẦN LOGIN) VÀ ẨN MODAL
        function handleGpsChoice() {
            playClickSound();
            triggerLoginMusic();
            
            // DỪNG VÀ HỦY NHẠC TRƯỚC KHI VÀO GAME
            if (kdriveBgMusic) {
                kdriveBgMusic.pause();
                kdriveBgMusic.currentTime = 0;
                kdriveBgMusic = null;
            }

            if (modalOverlay) modalOverlay.classList.remove('active');
            if (hudTopBar) hudTopBar.classList.add('active');
        }

        document.getElementById('gpsAllowBtn').addEventListener('click', () => {
            handleGpsChoice();
            sessionStorage.setItem('kdrive_gps_verified', 'true');
        });
        document.getElementById('gpsDenyBtn').addEventListener('click', () => {
            handleGpsChoice();
            sessionStorage.setItem('kdrive_gps_verified', 'false');
        });
    });
})();
