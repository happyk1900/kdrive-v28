<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title data-i18n="page_title">K-Drive: Lõi Lượng Tử</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
    
    <!-- Google Identity Services SDK -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        body { background-color: #030508; height: 100vh; height: 100dvh; width: 100vw; display: flex; justify-content: center; align-items: center; margin: 0; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }
        img, video { -webkit-user-drag: none; pointer-events: none; }

        /* NỀN ĐĂNG NHẬP MỚI */
        .kdrive-image-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; height: 100dvh; background: #010204; z-index: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .kdrive-bg-target { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2; opacity: 1; }
        
        /* BỐ CỤC CHÍNH */
        .gateway-container {
            position: relative; width: 90%; max-width: 340px; z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }

        /* HỘP ĐĂNG NHẬP / ĐĂNG KÝ THỦ CÔNG (Ở PHÍA TRÊN) */
        .manual-auth-box {
            width: 100%; background: rgba(5, 12, 22, 0.9); backdrop-filter: blur(15px);
            border: 1.5px solid rgba(0, 229, 255, 0.6); border-radius: 14px; padding: 18px 16px;
            box-shadow: 0 0 30px rgba(0, 229, 255, 0.3); display: flex; flex-direction: column; align-items: center;
            margin-bottom: 12px;
        }

        .auth-tabs { display: flex; width: 100%; margin-bottom: 14px; border-bottom: 1px solid rgba(0,229,255,0.3); padding-bottom: 8px; gap: 10px; }
        .auth-tab-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.5); font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: 0.3s; padding: 4px; }
        .auth-tab-btn.active { color: #ffd700; text-shadow: 0 0 8px rgba(255,215,0,0.8); border-bottom: 2px solid #ffd700; }

        .input-wrapper { position: relative; width: 100%; margin-bottom: 10px; }
        .login-input { 
            width: 100%; padding: 10px 12px; 
            background: rgba(10, 15, 25, 0.85); 
            border: 1px solid rgba(0, 229, 255, 0.3); 
            border-radius: 8px; color: #ffffff; outline: none; 
            font-weight: 500; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; 
            transition: all 0.3s; 
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus { border-color: #00e5ff; background: rgba(10, 15, 25, 0.95); box-shadow: 0 0 10px rgba(0,229,255,0.3); }

        .login-btn-submit { 
            width: 100%; padding: 10px; margin-top: 4px;
            background: rgba(0, 229, 255, 0.25); 
            color: #00e5ff; font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 11px; letter-spacing: 2px; 
            border: 1px solid #00e5ff; border-radius: 8px; 
            cursor: pointer; text-transform: uppercase; transition: 0.3s; 
            box-shadow: 0 0 12px rgba(0,229,255,0.3);
        }
        .login-btn-submit:hover { background: rgba(0, 229, 255, 0.45); color: #fff; box-shadow: 0 0 20px #00e5ff; }

        /* ĐIỀU KHOẢN PHÁP LÝ */
        .terms-row { display: flex; align-items: center; gap: 6px; width: 100%; margin-top: 10px; font-size: 9px; color: rgba(255,255,255,0.6); }
        .terms-row input { accent-color: #00e5ff; cursor: pointer; }

        /* KHU VỰC ĐĂNG NHẬP NHANH */
        .social-auth-box {
            width: 100%; background: rgba(5, 12, 22, 0.85); backdrop-filter: blur(12px);
            border: 1.5px solid rgba(255, 0, 127, 0.5); border-radius: 14px; padding: 14px 16px;
            box-shadow: 0 0 25px rgba(255, 0, 127, 0.3); display: flex; flex-direction: column; align-items: center;
        }
        .social-title { color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; text-shadow: 0 0 8px rgba(255,51,102,0.6); }
        
        .social-btn-row { display: flex; gap: 8px; width: 100%; }
        .social-btn {
            flex: 1; padding: 8px 4px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.3s;
        }
        .social-btn.google:hover { border-color: #db4437; background: rgba(219,68,55,0.2); color: #db4437; }
        .social-btn.facebook:hover { border-color: #4267B2; background: rgba(66,103,178,0.2); color: #4267B2; }
        .social-btn.icloud:hover { border-color: #a2aaad; background: rgba(162,170,173,0.2); color: #fff; }

        #successVideo { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 9999999; display: none; background: #000; }
    </style>
</head>
<body oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">

    <audio id="bgMusic" crossorigin="anonymous" src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Path%20of%20the%20Ninja.mp3" preload="auto" loop></audio>
    <video id="successVideo" src="https://github.com/happyk1900/-m-thanh-app/raw/refs/heads/main/VIDEO%20KAI%20RIEP%20Super.mp4" playsinline></video>

    <!-- KHUNG GIAO DIỆN CHÍNH (ĐÃ LOẠI BỎ TOÀN BỘ HUD VÀ TRÁI ĐẤT PHÍA TRÊN) -->
    <div class="kdrive-image-wrapper">
        <img src="https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20HUD%20(1).png?raw=true" class="kdrive-bg-target" alt="Core Background">
        
        <div class="gateway-container active" id="loginPanelContainer">
            <!-- HỘP ĐĂNG NHẬP / ĐĂNG KÝ THỦ CÔNG -->
            <div class="manual-auth-box">
                <div class="auth-tabs">
                    <button class="auth-tab-btn active" id="tabLoginBtn" onclick="switchTab('login')" data-i18n="tab_login">ĐĂNG NHẬP</button>
                    <button class="auth-tab-btn" id="tabRegBtn" onclick="switchTab('register')" data-i18n="tab_register">ĐĂNG KÝ</button>
                </div>

                <div class="input-wrapper">
                    <input type="text" id="accInput" class="login-input" placeholder="Tài khoản / Username" data-i18n-placeholder="placeholder_user">
                </div>
                <div class="input-wrapper">
                    <input type="password" id="passcodeInput" class="login-input" placeholder="Mật khẩu / Password" data-i18n-placeholder="placeholder_pass">
                </div>
                
                <button class="login-btn-submit" id="submitBtn" onclick="playHologramClick(); processAuth();" data-i18n="btn_login">XÁC NHẬN ĐĂNG NHẬP</button>
                
                <div class="terms-row">
                    <input type="checkbox" id="termsCheck" checked>
                    <label for="termsCheck" data-i18n="terms_label">Đồng ý Điều khoản & Chính sách bảo mật</label>
                </div>

                <div id="loginStatus" style="margin-top: 8px; font-weight: 700; text-align: center; font-size: 10px; color: #fff;"></div>
            </div>

            <!-- KHU VỰC ĐĂNG NHẬP NHANH -->
            <div class="social-auth-box">
                <div class="social-title" data-i18n="social_title">⚡ HOẶC ĐĂNG NHẬP NHANH MỘT CHẠM</div>
                <div class="social-btn-row">
                    <button class="social-btn google" onclick="socialLogin('Gmail')">🌐 Gmail</button>
                    <button class="social-btn facebook" onclick="socialLogin('Facebook')">📘 Facebook</button>
                    <button class="social-btn icloud" onclick="socialLogin('AppleID')">🍏 AppleID</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const translations = {
            vi: {
                page_title: "K-Drive: Lõi Lượng Tử",
                tab_login: "ĐĂNG NHẬP",
                tab_register: "ĐĂNG KÝ MỚI",
                placeholder_user: "Tài khoản / Username",
                placeholder_pass: "Mật khẩu / Password",
                btn_login: "XÁC NHẬN ĐĂNG NHẬP",
                btn_register: "HOÀN TẤT ĐĂNG KÝ",
                terms_label: "Đồng ý Điều khoản & Chính sách bảo mật",
                social_title: "⚡ HOẶC ĐĂNG NHẬP NHANH MỘT CHẠM",
                status_empty: "❌ VUI LÒNG ĐIỀN ĐỦ THÔNG TIN!",
                status_terms: "⚠️ BẠN PHẢI ĐỒNG Ý ĐIỀU KHOẢN SỬ DỤNG!",
                status_checking: "🛰️ ĐANG KẾT NỐI LÕI LƯỢNG TỬ...",
                status_success: "✅ ĐĂNG NHẬP THÀNH CÔNG!",
                status_error: "❌ TÀI KHOẢN HOẶC MẬT KHẨU KHÔNG ĐÚNG!",
                status_exist: "❌ TÀI KHOẢN ĐÃ TỒN TẠI TRÊN HỆ THỐNG!",
                status_disconnect: "❌ MẤT KẾT NỐI MÁY CHỦ LƯỢNG TỬ!"
            },
            en: {
                page_title: "K-Drive: Quantum Core",
                tab_login: "LOGIN",
                tab_register: "REGISTER",
                placeholder_user: "Username",
                placeholder_pass: "Password",
                btn_login: "CONFIRM LOGIN",
                btn_register: "COMPLETE REGISTRATION",
                terms_label: "Agree to Terms & Privacy Policy",
                social_title: "⚡ OR FAST ONE-TOUCH LOGIN",
                status_empty: "❌ PLEASE FILL IN ALL FIELDS!",
                status_terms: "⚠️ YOU MUST AGREE TO THE TERMS!",
                status_checking: "🛰️ CONNECTING TO QUANTUM CORE...",
                status_success: "✅ LOGIN SUCCESSFUL!",
                status_error: "❌ INVALID USERNAME OR PASSWORD!",
                status_exist: "❌ ACCOUNT ALREADY EXISTS!",
                status_disconnect: "❌ QUANTUM SERVER DISCONNECTED!"
            }
        };

        let currentAuthMode = 'login';

        function applyLanguage(lang) {
            const t = translations[lang] || translations['vi'];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key]) el.innerHTML = t[key];
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (t[key]) el.placeholder = t[key];
            });
            window.currentLangDict = t;
            updateModeUI();
        }

        function switchTab(mode) {
            playHologramClick();
            currentAuthMode = mode;
            document.getElementById('tabLoginBtn').classList.toggle('active', mode === 'login');
            document.getElementById('tabRegBtn').classList.toggle('active', mode === 'register');
            updateModeUI();
            document.getElementById('loginStatus').innerHTML = "";
        }

        function updateModeUI() {
            const t = window.currentLangDict || translations['vi'];
            const btnEl = document.getElementById('submitBtn');
            btnEl.innerHTML = (currentAuthMode === 'login') ? t.btn_login : t.btn_register;
        }

        window.addEventListener('kdriveLangChanged', (e) => { applyLanguage(e.detail.lang); });
        window.addEventListener('DOMContentLoaded', () => { 
            applyLanguage(localStorage.getItem('kdrive_lang') || 'vi');
            initGoogleAuth();
            const bgm = document.getElementById('bgMusic');
            if(bgm) { bgm.currentTime = 0; bgm.play().catch(e => {}); }
        });

        function playHologramClick() { try { const snd = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); snd.volume = 0.5; snd.play().catch(e=>{}); } catch(err) {} }

        const scriptURL = 'https://script.google.com/macros/s/AKfycbwPVjsQ6bd9RFcOB7BUBl2bSsYa6gccHoirg66hbNCruFYJ3HP9w-xJD6JpCupjUKSr/exec';
        
        function processAuth() {
            var acc = document.getElementById('accInput').value.trim(); 
            var code = document.getElementById('passcodeInput').value.trim(); 
            var termsChecked = document.getElementById('termsCheck').checked;
            var statusEl = document.getElementById('loginStatus');
            const t = window.currentLangDict || translations['vi'];

            if(acc === "" || code === "") { statusEl.innerHTML = t.status_empty; statusEl.style.color = "#ff3333"; return; }
            if(!termsChecked) { statusEl.innerHTML = t.status_terms; statusEl.style.color = "#ffcc00"; return; }
            
            statusEl.innerHTML = t.status_checking; statusEl.style.color = "#00e5ff";
            
            const dataForm = new FormData(); 
            dataForm.append('action', currentAuthMode === 'register' ? 'register' : 'checkLogin'); 
            dataForm.append('Username', acc); 
            dataForm.append('Password', code);
            dataForm.append('Email', currentAuthMode === 'register' ? (acc.includes('@') ? acc : acc + '@kdrive.io') : '');

            fetch(scriptURL, { method: 'POST', body: dataForm })
            .then(response => response.json())
            .then(data => {
                const isSuccess = (data.success === true || data.result === "success" || data.status === "success" || data.ket_qua === "thanh_cong");
                
                if(isSuccess) {
                    triggerSuccessFlow(acc);
                } else { 
                    if(currentAuthMode === 'register' && data.msg && data.msg.includes("TỒN TẠI")) {
                        statusEl.innerHTML = t.status_exist;
                    } else if(currentAuthMode === 'login' && data.msg) {
                        statusEl.innerHTML = "❌ " + data.msg;
                    } else {
                        statusEl.innerHTML = t.status_error; 
                    }
                    statusEl.style.color = "#ff3333"; 
                }
            })
            .catch(error => { statusEl.innerHTML = t.status_disconnect; statusEl.style.color = "#ff3333"; });
        }

        function initGoogleAuth() {
            try {
                if (typeof google !== 'undefined' && google.accounts) {
                    google.accounts.id.initialize({
                        client_id: "916035082915-656vp11qf63hmoplvtjfvbci053jti8r.apps.googleusercontent.com",
                        callback: handleGoogleResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                }
            } catch (e) {
                console.error("Google Auth init error:", e);
            }
        }

        function socialLogin(provider) {
            playHologramClick();
            var termsChecked = document.getElementById('termsCheck').checked;
            var statusEl = document.getElementById('loginStatus');
            const t = window.currentLangDict || translations['vi'];

            if(!termsChecked) { statusEl.innerHTML = t.status_terms; statusEl.style.color = "#ffcc00"; return; }

            if (provider === 'Gmail') {
                statusEl.innerHTML = "🛰️ ĐANG MỞ KHO GMAIL LƯỢNG TỬ...";
                statusEl.style.color = "#00e5ff";
                try {
                    if (typeof google !== 'undefined' && google.accounts) {
                        google.accounts.id.prompt((notification) => {
                            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                                fallbackGmailPrompt();
                            }
                        });
                    } else {
                        fallbackGmailPrompt();
                    }
                } catch (e) {
                    fallbackGmailPrompt();
                }
            } else {
                var socialUser = provider.toUpperCase() + "_" + Math.floor(1000 + Math.random() * 9000);
                executeSocialSync(provider, socialUser.toLowerCase() + "@kdrive.social", socialUser);
            }
        }

        function handleGoogleResponse(response) {
            try {
                const responsePayload = parseJwt(response.credential);
                const userEmail = responsePayload.email;
                const userName = responsePayload.name || userEmail.split('@')[0];
                executeSocialSync('Gmail', userEmail, userName);
            } catch (e) {
                fallbackGmailPrompt();
            }
        }

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        function fallbackGmailPrompt() {
            var userEmail = prompt("Vui lòng nhập địa chỉ GMAIL chính chủ của bạn để làm tài khoản và đồng bộ khôi phục lượng tử:", "player@gmail.com");
            if (userEmail && userEmail.includes('@')) {
                executeSocialSync('Gmail', userEmail, userEmail.split('@')[0]);
            } else {
                var statusEl = document.getElementById('loginStatus');
                statusEl.innerHTML = "❌ CẦN CÓ GMAIL HỢP LỆ ĐỂ TIẾP TỤC!";
                statusEl.style.color = "#ff3333";
            }
        }

        function executeSocialSync(provider, email, username) {
            var statusEl = document.getElementById('loginStatus');
            statusEl.innerHTML = "🛰️ ĐANG ĐỒNG BỘ " + provider.toUpperCase() + " VÀO LÕI...";
            statusEl.style.color = "#00e5ff";

            const dataForm = new FormData();
            dataForm.append('action', 'register');
            dataForm.append('Username', username);
            dataForm.append('Password', 'oauth_' + provider.toLowerCase() + '_secure');
            dataForm.append('Email', email);
            dataForm.append('Nickname', username);

            fetch(scriptURL, { method: 'POST', body: dataForm })
            .then(response => response.json())
            .then(data => {
                triggerSuccessFlow(username);
            })
            .catch(error => {
                triggerSuccessFlow(username);
            });
        }

        function triggerSuccessFlow(username) {
            try {
                const sndVortex = new Audio('https://assets.mixkit.co/active_storage/sfx/2771/2771-preview.mp3');
                sndVortex.volume = 1.0; sndVortex.play().catch(e=>{});
                if (navigator.vibrate) navigator.vibrate([300, 100, 400, 100, 500]);
            } catch(e) {}
            
            sessionStorage.setItem('kdrive_session', 'active'); 
            session`kdrive_username`, username); 
            
            document.getElementById('loginPanelContainer').classList.remove('active'); 
            setTimeout(() => {
                const successVid = document.getElementById('successVideo');
                if(successVid) {
                    successVid.style.display = 'block'; 
                    successVid.play().then(() => { 
                        successVid.onended = () => { window.location.href = 'core.html'; };
                    }).catch(err => { window.location.href = 'core.html'; });
                } else { window.location.href = 'core.html'; }
            }, 300);
        }
    </script>
        <script src="boo-player.js"></script>
</body>
</html>
