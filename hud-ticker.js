(function() {
    // 1. Nạp font và CSS HUD cấu trúc 3 khối (Trái - Giữa - Phải), form GPS và Chat
    const styleId = 'kdrive-hud-module-styles';
    if (!document.getElementById(styleId)) {
        const linkFont = document.createElement('link');
        linkFont.rel = 'stylesheet';
        linkFont.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap';
        document.head.appendChild(linkFont);

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* THANH HUD 3 KHỐI: TRÁI - GIỮA - PHẢI TRONG SUỐT */
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
            
            /* GPS */
            .hud-gps { color: #ff007f !important; font-weight: 700; text-shadow: 0 0 8px rgba(255,0,127,0.8); }
            .hud-chat-badge { color: #ffd700; font-weight: 900; text-shadow: 0 0 10px rgba(255,215,0,0.8); cursor: pointer; transition: 0.2s; }
            .hud-chat-badge:hover { color: #fff; text-shadow: 0 0 15px #ffd700; }

            /* NÚT CHỌN NGÔN NGỮ NẰM Ở GIỮA THANH HUD */
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
                background-image: url('https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20HUD%20(1).png?raw=true'); 
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
            .chat-msg-row.strike-msg { border-left-color: #ffb700; background: rgba(255,183,0,0.05); color: #ffb700; font-weight: bold;}
            .chat-user-name { font-family: 'Share Tech Mono', monospace; font-weight: bold; margin-right: 6px; font-size: 13.5px; }

            .chat-input-wrapper { display: flex; gap: 10px; z-index: 1; }
            .chat-input-field {
                flex: 1; background: rgba(0,0,0,0.6); border: 1px solid rgba(0, 229, 255, 0.5);
                color: #fff; padding: 12px 15px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif;
                font-size: 13px; outline: none; transition: 0.3s;
            }
            .chat-input-field:focus { border-color: #00e5ff; box-shadow: inset 0 0 10px rgba(0,229,255,0.3); }
            
            /* TRẠNG THÁI CHƯA ĐĂNG NHẬP / BỊ KHÓA */
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

            /* ========================================================= */
            /* POPUP CẢNH BÁO TỐI CAO LÚC CHUẨN BỊ CHAT */
            /* ========================================================= */
            .strict-warning-overlay {
                position: fixed; inset: 0; background: rgba(10, 0, 0, 0.9); z-index: 2147483650;
                display: flex; justify-content: center; align-items: center;
                opacity: 0; visibility: hidden; transition: 0.3s; pointer-events: none; backdrop-filter: blur(10px);
            }
            .strict-warning-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            .strict-warning-box {
                width: 90%; max-width: 400px; background: #0a0204; border: 2px solid #ff003c;
                border-radius: 12px; padding: 25px; text-align: center;
                box-shadow: 0 0 40px rgba(255,0,60,0.5), inset 0 0 20px rgba(255,0,60,0.2);
                animation: redAlertPulse 1.5s infinite alternate;
            }
            @keyframes redAlertPulse {
                0% { box-shadow: 0 0 20px rgba(255,0,60,0.4), inset 0 0 10px rgba(255,0,60,0.2); border-color: #cc0033; }
                100% { box-shadow: 0 0 50px rgba(255,0,60,0.8), inset 0 0 25px rgba(255,0,60,0.4); border-color: #ff3366; }
            }
            .strict-title { color: #ff003c; font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 900; margin-bottom: 15px; letter-spacing: 2px; text-shadow: 0 0 15px #ff003c; }
            .strict-msg { color: #ffcccc; font-family: 'Space Grotesk', sans-serif; font-size: 13.5px; line-height: 1.6; margin-bottom: 20px; font-weight: 600; text-shadow: 0 2px 4px #000; }
            .strict-btn {
                background: rgba(255, 0, 60, 0.2); border: 2px solid #ff003c; color: #ff3366;
                font-family: 'Montserrat', sans-serif; font-weight: 900; padding: 12px 30px; border-radius: 8px;
                cursor: pointer; text-transform: uppercase; transition: 0.3s; letter-spacing: 1px;
            }
            .strict-btn:hover { background: rgba(255, 0, 60, 0.5); color: #fff; box-shadow: 0 0 20px #ff003c; }
        `;
        document.head.appendChild(style);
    }

    const globalTranslations = {
        vi: { 
            select_lang_title: "CHỌN NGÔN NGỮ QUỐC TẾ", close_btn: "ĐÓNG LẠI",
            strict_title: "⚠️ CẢNH BÁO KỶ LUẬT THÉP",
            strict_msg: "NGHIÊM CẤM tuyệt đối sử dụng ngôn từ thiếu văn hóa, phỉ báng tôn giáo, hoặc kích động chính trị.<br><br>Hệ thống AI tự động đánh gậy kiểm duyệt. <b>VI PHẠM 3 LẦN = CẤM CHAT VĨNH VIỄN!</b>",
            strict_understand: "TÔI ĐÃ RÕ",
            login_req: "⚠ CẦN LOGIN ĐỂ CHAT", banned_req: "⛔ TÀI KHOẢN ĐÃ BỊ KHÓA VĨNH VIỄN!"
        },
        en: { 
            select_lang_title: "SELECT GLOBAL LANGUAGE", close_btn: "CLOSE",
            strict_title: "⚠️ SUPREME WARNING",
            strict_msg: "STRICTLY FORBIDDEN to use offensive language, religious insults, or political incitement.<br><br>AI Auto-Strike System is active. <b>3 STRIKES = PERMANENT BAN!</b>",
            strict_understand: "I UNDERSTAND",
            login_req: "⚠ LOGIN REQUIRED", banned_req: "⛔ ACCOUNT PERMANENTLY BANNED!"
        },
        zh: { 
            select_lang_title: "选择全球语言", close_btn: "关闭",
            strict_title: "⚠️ 最高警告",
            strict_msg: "严禁使用不雅言辞、亵渎宗教或煽动政治。<br><br>AI 自动警告系统已激活。<b>违规3次 = 永久封禁！</b>",
            strict_understand: "我明白了",
            login_req: "⚠ 需要登录", banned_req: "⛔ 账号已永久封禁！"
        },
        ja: { 
            select_lang_title: "グローバル言語を選択", close_btn: "閉じる",
            strict_title: "⚠️ 最高警告",
            strict_msg: "不適切な言葉、宗教冒涜、政治的扇動は厳禁です。<br><br>AI自動ストライクシステム稼働中。<b>3回の違反 = 永久BAN！</b>",
            strict_understand: "理解しました",
            login_req: "⚠ ログインが必要", banned_req: "⛔ アカウント永久停止！"
        },
        ko: { 
            select_lang_title: "글로벌 언어 선택", close_btn: "닫기",
            strict_title: "⚠️ 최고 경고",
            strict_msg: "모욕적인 언어, 종교 모독 또는 정치적 선동은 엄격히 금지됩니다.<br><br>AI 자동 스트라이크 시스템 활성화. <b>3회 위반 시 영구 차단!</b>",
            strict_understand: "이해했습니다",
            login_req: "⚠ 로그인 필요", banned_req: "⛔ 계정 영구 정지!"
        },
        fr: { 
            select_lang_title: "SÉLECTIONNER LA LANGUE", close_btn: "FERMER",
            strict_title: "⚠️ AVERTISSEMENT SUPRÊME",
            strict_msg: "LANGAGE OFFENSANT, BLASPHÈME OU INCITATION POLITIQUE STRICTEMENT INTERDITS.<br><br>Système AI actif. <b>3 INFRACTIONS = BANNISSEMENT DÉFINITIF !</b>",
            strict_understand: "JE COMPRENDS",
            login_req: "⚠ CONNEXION REQUISE", banned_req: "⛔ COMPTE BANNI À VIE !"
        },
        de: { 
            select_lang_title: "WELTSPRACHE AUSWÄHLEN", close_btn: "SCHLIESSEN",
            strict_title: "⚠️ OBERSTE WARNUNG",
            strict_msg: "BELEIDIGUNGEN, RELIGIÖSE LÄSTERUNG ODER POLITISCHE HETZE SIND STRENGSTENS VERBOTEN.<br><br>AI-System aktiv. <b>3 VERSTÖßE = PERMANENTER BANN!</b>",
            strict_understand: "ICH VERSTEHE",
            login_req: "⚠ LOGIN ERFORDERLICH", banned_req: "⛔ KONTO PERMANENT GESPERRT!"
        },
        es: { 
            select_lang_title: "SELECCIONAR IDIOMA", close_btn: "CERRAR",
            strict_title: "⚠️ ADVERTENCIA SUPREMA",
            strict_msg: "EL LENGUAJE OFENSIVO, BLASFEMIA O INCITACIÓN POLÍTICA ESTÁN ESTRICTAMENTE PROHIBIDOS.<br><br>Sistema IA activo. <b>¡3 INFRACCIONES = BANEO PERMANENTE!</b>",
            strict_understand: "ENTENDIDO",
            login_req: "⚠ INICIO DE SESIÓN REQUERIDO", banned_req: "⛔ ¡CUENTA BANEADA PERMANENTEMENTE!"
        },
        ru: { 
            select_lang_title: "ВЫБЕРИТЕ ЯЗЫК", close_btn: "ЗАКРЫТЬ",
            strict_title: "⚠️ ВЫСШЕЕ ПРЕДУПРЕЖДЕНИЕ",
            strict_msg: "ОСКОРБЛЕНИЯ, БОГОХУЛЬСТВО ИЛИ ПОЛИТИЧЕСКИЕ ПОДСТРЕКАТЕЛЬСТВА СТРОГО ЗАПРЕЩЕНЫ.<br><br>Система ИИ активна. <b>3 НАРУШЕНИЯ = ПОЖИЗНЕННЫЙ БАН!</b>",
            strict_understand: "Я ПОНИМАЮ",
            login_req: "⚠ ТРЕБУЕТСЯ ВХОД", banned_req: "⛔ АККАУНТ ЗАБЛОКИРОВАН НАВСЕГДА!"
        },
        th: { 
            select_lang_title: "เลือกภาษา", close_btn: "ปิด",
            strict_title: "⚠️ คำเตือนสูงสุด",
            strict_msg: "ห้ามใช้คำหยาบคาบ ดูหมิ่นศาสนา หรือปลุกปั่นทางการเมืองโดยเด็ดขาด<br><br>ระบบ AI ทำงาน <b>ผิด 3 ครั้ง = แบนถาวร!</b>",
            strict_understand: "รับทราบ",
            login_req: "⚠ กรุณาเข้าสู่ระบบ", banned_req: "⛔ บัญชีถูกแบนถาวร!"
        },
        id: { 
            select_lang_title: "PILIH BAHASA", close_btn: "TUTUP",
            strict_title: "⚠️ PERINGATAN TERTINGGI",
            strict_msg: "BAHASA KASAR, PENGHINAAN AGAMA, ATAU HASUTAN POLITIK DILARANG KERAS.<br><br>Sistem AI aktif. <b>3 TEGURAN = BLOKIR PERMANEN!</b>",
            strict_understand: "SAYA MENGERTI",
            login_req: "⚠ HARUS LOGIN", banned_req: "⛔ AKUN DIBLOKIR PERMANEN!"
        },
        ar: { 
            select_lang_title: "اختر اللغة العالمية", close_btn: "إغلاق",
            strict_title: "⚠️ تحذير أقصى",
            strict_msg: "يُمنع استخدام لغة مسيئة أو إهانات دينية أو تحريض سياسي.<br><br>نظام الذكاء الاصطناعي نشط. <b>3 مخالفات = حظر دائم!</b>",
            strict_understand: "أفهم ذلك",
            login_req: "⚠ تسجيل الدخول مطلوب", banned_req: "⛔ الحساب محظور نهائياً!"
        }
    };

    function playClickSound() { try { new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3').play(); } catch(e){} }
    function playErrorSound() {
        try { 
            const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
            const osc = ctx.createOscillator(); const gain = ctx.createGain(); 
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'square'; osc.frequency.setValueAtTime(150, ctx.currentTime); 
            gain.gain.setValueAtTime(0.5, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
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
                    <div class="chat-messages-area" id="chatMessagesArea"></div>
                    <div class="chat-input-wrapper">
                        <input type="text" id="chatInputField" class="chat-input-field" autocomplete="off">
                        <button id="chatSendBtn" class="chat-send-btn">GỬI</button>
                    </div>
                </div>
            </div>

            <!-- CẢNH BÁO TỐI CAO LÚC CHUẨN BỊ CHAT -->
            <div class="strict-warning-overlay" id="strictWarningOverlay">
                <div class="strict-warning-box">
                    <div class="strict-title" id="strictTitle">⚠️ CẢNH BÁO TỐI CAO</div>
                    <div class="strict-msg" id="strictMsg">Nội dung cảnh báo...</div>
                    <button class="strict-btn" id="strictUnderstandBtn">TÔI ĐÃ RÕ</button>
                </div>
            </div>
        `;
        document.body.prepend(container);

        // --- QUẢN LÝ NGÔN NGỮ ĐỘNG ---
        window.openGlobalLang = function() { playClickSound(); document.getElementById('globalLangModal').classList.add('active'); };
        window.closeGlobalLang = function() { playClickSound(); document.getElementById('globalLangModal').classList.remove('active'); };
        window.setGlobalLang = function(lang) {
            playClickSound(); localStorage.setItem('kdrive_lang', lang);
            updateHudLangUI(lang); window.closeGlobalLang();
            window.dispatchEvent(new CustomEvent('kdriveLangChanged', { detail: { lang } }));
        };

        function updateHudLangUI(lang) {
            const lbl = document.getElementById('hudLangLabel'); if (lbl) lbl.innerText = lang.toUpperCase();
            const t = globalTranslations[lang] || globalTranslations['vi'];
            
            document.getElementById('langModalTitleText').innerHTML = t.select_lang_title;
            document.getElementById('langModalCloseBtn').innerHTML = t.close_btn;
            document.getElementById('strictTitle').innerHTML = t.strict_title;
            document.getElementById('strictMsg').innerHTML = t.strict_msg;
            document.getElementById('strictUnderstandBtn').innerHTML = t.strict_understand;

            updateChatInputState(lang);
        }

        document.getElementById('hudLangOpenBtn').addEventListener('click', window.openGlobalLang);
        const savedLang = localStorage.getItem('kdrive_lang') || 'vi';
        
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

        // --- KÊNH CHAT & HỆ THỐNG ĐÁNH GẬY KỶ LUẬT ---
        const chatBadge = document.getElementById('hudChatText');
        const chatModal = document.getElementById('globalChatModalOverlay');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatMessages = document.getElementById('chatMessagesArea');
        const chatInput = document.getElementById('chatInputField');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const strictOverlay = document.getElementById('strictWarningOverlay');
        const strictAcceptBtn = document.getElementById('strictUnderstandBtn');

        let isBanned = localStorage.getItem('kdrive_banned_' + username) === 'true';
        let strikes = parseInt(localStorage.getItem('kdrive_strikes_' + username)) || 0;

        function updateChatInputState(lang) {
            const t = globalTranslations[lang] || globalTranslations['vi'];
            if (!isLoggedIn) {
                chatInput.disabled = true; chatSendBtn.disabled = true;
                chatInput.placeholder = t.login_req;
            } else if (isBanned) {
                chatInput.disabled = true; chatSendBtn.disabled = true;
                chatInput.placeholder = t.banned_req;
            } else {
                chatInput.disabled = false; chatSendBtn.disabled = false;
                chatInput.placeholder = "...";
            }
        }

        updateHudLangUI(savedLang);

        let chatData = JSON.parse(localStorage.getItem('kdrive_global_chat')) || [
            { user: 'SYS.AI', text: 'Quantum Chat active. Respect Discipline rules.', isSys: true }
        ];

        function renderChat() {
            chatMessages.innerHTML = '';
            chatData.forEach(msg => {
                const row = document.createElement('div');
                let rowClass = 'chat-msg-row';
                if (msg.isSys) rowClass += ' sys-msg';
                if (msg.isStrike) rowClass += ' strike-msg';
                row.className = rowClass;
                
                let userColor = '#ffd700';
                if (msg.isSys) userColor = '#ff3366';
                if (msg.isStrike) userColor = '#ffb700';

                row.innerHTML = `<span class="chat-user-name" style="color: ${userColor}">[${msg.user}]</span> ${msg.text}`;
                chatMessages.appendChild(row);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatBadge.addEventListener('click', () => {
            playClickSound(); chatModal.classList.add('active'); renderChat();
        });

        chatCloseBtn.addEventListener('click', () => {
            playClickSound(); chatModal.classList.remove('active');
        });

        // Kích hoạt Cảnh báo tối cao khi focus vào ô input
        chatInput.addEventListener('focus', (e) => {
            if (!sessionStorage.getItem('kdrive_chat_warned')) {
                e.preventDefault();
                chatInput.blur();
                playErrorSound();
                strictOverlay.classList.add('active');
            }
        });

        strictAcceptBtn.addEventListener('click', () => {
            playClickSound();
            sessionStorage.setItem('kdrive_chat_warned', 'true');
            strictOverlay.classList.remove('active');
            chatInput.focus();
        });

        // --- CƠ CHẾ CHỐNG SPAM & BỘ LỌC PII/MẠO DANH ---
        let lastMessageTime = 0;
        const COOLDOWN_MS = 3000; // 3 giây

        function sendChatMessage() {
            if (!isLoggedIn || isBanned) return;
            const text = chatInput.value.trim();
            if (!text) return;

            const now = Date.now();
            if (now - lastMessageTime < COOLDOWN_MS) {
                playErrorSound();
                alert("⚠ HỆ THỐNG: Vui lòng đợi 3 giây trước khi gửi tin nhắn tiếp theo!");
                return;
            }

            // 1. Chống mạo danh Quản trị viên
            const restrictedNames = ["SYS.AI", "ADMIN", "KAI", "KAI RIPE", "TELEPATHY"];
            if (restrictedNames.includes(username.toUpperCase())) {
                playErrorSound();
                alert("⚠ LỖI BẢO MẬT: Tên định danh của bạn trùng với Quản trị viên. Đề nghị đổi tên!");
                return;
            }

            // 2. Bộ lọc Kỷ luật Thép & PII (Số đt, ngân hàng)
            const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
            const imgExtRegex = /\.(jpeg|jpg|gif|png|webp|bmp)/gi;
            const swearRegex = /(địt|lồn|cặc|cac|lon|fuck|shit|bitch|ass|đm|vkl|vl|đéo)/gi;
            const phoneRegex = /\b(0[3|5|7|8|9])+([0-9]{8})\b/g;
            const bankRegex = /\b(stk|số tài khoản|tk ngân hàng).{0,5}\d{6,15}\b/gi;

            let violationType = null;
            if (linkRegex.test(text) || imgExtRegex.test(text)) violationType = "SPAM LINK/IMAGE";
            else if (swearRegex.test(text)) violationType = "NGÔN TỪ THIẾU VĂN HÓA";
            else if (phoneRegex.test(text) || bankRegex.test(text)) violationType = "CẤM GIAO DỊCH / LỘ THÔNG TIN CÁ NHÂN";

            if (violationType) {
                playErrorSound();
                strikes++;
                localStorage.setItem('kdrive_strikes_' + username, strikes);
                
                chatData.push({ 
                    user: 'SYS.AI', 
                    text: `Phát hiện [${username.toUpperCase()}] vi phạm lỗi: ${violationType}. Cảnh cáo gậy thứ ${strikes}/3.`, 
                    isStrike: true 
                });

                if (strikes >= 3) {
                    isBanned = true;
                    localStorage.setItem('kdrive_banned_' + username, 'true');
                    chatData.push({ 
                        user: 'SYS.AI', 
                        text: `Tài khoản [${username.toUpperCase()}] ĐÃ BỊ KHÓA VĨNH VIỄN KHỎI KÊNH CHAT!`, 
                        isSys: true 
                    });
                    updateChatInputState(localStorage.getItem('kdrive_lang') || 'vi');
                }
            } else {
                playClickSound();
                lastMessageTime = now; 
                chatData.push({ user: username.toUpperCase(), text: text });
            }

            if (chatData.length > 50) chatData.shift(); 
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
