<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title data-i18n="page_title">K-Drive: Lõi Lượng Tử</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Space+Grotesk:wght@500;700;900&display=swap" rel="stylesheet">
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
        body { background-color: #030508; height: 100vh; height: 100dvh; width: 100vw; display: flex; justify-content: center; align-items: center; margin: 0; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }
        img, video { -webkit-user-drag: none; pointer-events: none; }

        .kdrive-image-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; height: 100dvh; background: #010204; z-index: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .kdrive-bg-target { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2; opacity: 1; }
        
        /* POPUP CHỌN NGÔN NGỮ & ALIEN */
        .language-overlay {
            position: relative; width: 90%; max-width: 360px; background: rgba(5, 12, 22, 0.92); backdrop-filter: blur(15px);
            border: 1.5px solid rgba(0, 229, 255, 0.6); border-radius: 16px; padding: 20px 16px;
            box-shadow: 0 0 35px rgba(0, 229, 255, 0.3); z-index: 99999; display: flex; flex-direction: column; align-items: center;
        }

        /* NÚT ALIEN Ở TRÊN CÙNG (CHIẾM TRỌN 100% CHIỀU NGANG, KHÔNG CÓ CHỮ, NHẤP NHÁY) */
        .alien-top-btn {
            width: 100%; padding: 12px; margin-bottom: 14px; background: rgba(0, 229, 255, 0.15);
            border: 1px solid rgba(0, 229, 255, 0.6); border-radius: 10px; cursor: pointer;
            display: flex; justify-content: center; align-items: center;
            font-size: 20px; animation: alienBlink 1.5s infinite ease-in-out;
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
        }

        @keyframes alienBlink {
            0%, 100% { opacity: 1; text-shadow: 0 0 10px #00e5ff, 0 0 20px #00e5ff; border-color: rgba(0, 229, 255, 0.8); }
            50% { opacity: 0.4; text-shadow: 0 0 2px #00e5ff; border-color: rgba(0, 229, 255, 0.2); }
        }

        /* BỐ CỤC 12 QUỐC GIA (2 CỘT ĐỀU ĐẶN) */
        .lang-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 14px;
        }

        .lang-btn {
            background: rgba(10, 15, 25, 0.85); border: 1px solid rgba(0, 229, 255, 0.3);
            border-radius: 8px; color: #fff; padding: 10px 8px; font-family: 'Space Grotesk', sans-serif;
            font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
            transition: 0.3s;
        }
        .lang-btn:hover { border-color: #00e5ff; background: rgba(0, 229, 255, 0.2); box-shadow: 0 0 10px rgba(0,229,255,0.4); }

        /* NÚT ĐÓNG / XÁC NHẬN DƯỚI CÙNG */
        .lang-close-btn {
            width: 100%; padding: 10px; background: rgba(255, 0, 127, 0.2); border: 1px solid rgba(255, 0, 127, 0.8);
            border-radius: 8px; color: #ff3366; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 900;
            letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s;
            box-shadow: 0 0 12px rgba(255, 0, 127, 0.3); text-shadow: 0 0 6px rgba(255,51,102,0.8);
        }
        .lang-close-btn:hover { background: rgba(255, 0, 127, 0.4); color: #fff; box-shadow: 0 0 20px #ff3366; }
    </style>
</head>
<body oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">

    <audio id="bgMusic" crossorigin="anonymous" src="https://github.com/happyk1900/new-abum-17-track/raw/refs/heads/main/Path%20of%20the%20Ninja.mp3" preload="auto" loop></audio>

    <div class="kdrive-image-wrapper">
        <img src="https://github.com/happyk1900/-m-thanh-app/blob/main/ANH%20HUD%20(1).png?raw=true" class="kdrive-bg-target" alt="Background">
        
        <!-- BẢNG CHỌN NGÔN NGỮ BAN ĐẦU (CHƯA CÓ HUD PHÍA TRÊN) -->
        <div class="language-overlay" id="langSelectionBox">
            <!-- Nút Alien nhấp nháy chiếm 100% chiều ngang, bỏ chữ -->
            <div class="alien-top-btn" onclick="toggleAlienSymbols()">👽</div>

            <!-- 12 Quốc gia chia thành 2 cột cân đối -->
            <div class="lang-grid">
                <button class="lang-btn" onclick="selectLanguage('vi')">🇻🇳 Tiếng Việt</button>
                <button class="lang-btn" onclick="selectLanguage('en')">🇬🇧 English</button>
                <button class="lang-btn" onclick="selectLanguage('zh')">🇨🇳 中文</button>
                <button class="lang-btn" onclick="selectLanguage('ja')">🇯🇵 日本語</button>
                <button class="lang-btn" onclick="selectLanguage('ko')">🇰🇷 한국어</button>
                <button class="lang-btn" onclick="selectLanguage('fr')">🇫🇷 Français</button>
                <button class="lang-btn" onclick="selectLanguage('de')">🇩🇪 Deutsch</button>
                <button class="lang-btn" onclick="selectLanguage('es')">🇪🇸 Español</button>
                <button class="lang-btn" onclick="selectLanguage('ru')">🇷🇺 Русский</button>
                <button class="lang-btn" onclick="selectLanguage('th')">🇹🇭 ไทย</button>
                <button class="lang-btn" onclick="selectLanguage('id')">🇮🇩 Indonesia</button>
                <button class="lang-btn" onclick="selectLanguage('ar')">🇸🇦 العربية</button>
            </div>

            <button class="lang-close-btn" onclick="proceedToLogin()">XÁC NHẬN & VÀO LÕI</button>
        </div>
    </div>

    <script>
        function playHologramClick() { try { const snd = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); snd.volume = 0.5; snd.play().catch(e=>{}); } catch(err) {} }

        window.addEventListener('DOMContentLoaded', () => {
            const bgm = document.getElementById('bgMusic');
            if(bgm) { bgm.currentTime = 0; bgm.play().catch(e => {}); }
        });

        function toggleAlienSymbols() {
            playHologramClick();
            alert("⟨+⊙·≡ ≡⊙≡≡ ≡⊙∈≈ ⊙∪⊙⁺⟨ ⊡ā⁺"); // Hiển thị bộ mã ký tự lượng tử khi ấn vào alien
        }

        function selectLanguage(lang) {
            playHologramClick();
            localStorage.setItem('kdrive_lang', lang);
        }

        // Khi xác nhận xong, chuyển thẳng sang trang login có đầy đủ HUD phía trên theo đúng ý anh
        function proceedToLogin() {
            playHologramClick();
            window.location.href = 'login.html';
        }
    </script>
</body>
</html>
