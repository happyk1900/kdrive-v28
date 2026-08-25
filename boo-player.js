(function() {
    // 1. Tiêm CSS cho giao diện 2 trạng thái độc đáo
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(8, 12, 20, 0.88);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 20, 147, 0.5);
            padding: 8px 14px;
            border-radius: 30px;
            box-shadow: 0 0 25px rgba(255, 20, 147, 0.3);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }
        .boo-car-widget:hover {
            box-shadow: 0 0 35px rgba(0, 229, 255, 0.6);
            border-color: #00e5ff;
        }

        /* Khung chứa biểu tượng (Ca cơ chữ K hoặc Mặt lợn Boo) */
        .boo-car-avatar-container {
            width: 38px;
            height: 38px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Biểu tượng Ca Cơ chữ K độc quyền (Trạng thái Nghỉ) */
        .cyber-heart-k {
            width: 36px;
            height: 36px;
            background: radial-gradient(circle, #ff1493 0%, #8b008b 100%);
            /* Tạo hình trái tim / ca cơ bằng clip-path hoặc border-radius cách điệu */
            clip-path: polygon(50% 0%, 100% 35%, 82% 100%, 50% 75%, 18% 100%, 0% 35%);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.8);
            transition: transform 0.3s ease;
        }
        .cyber-heart-k span {
            color: #ffd700;
            font-weight: 900;
            font-size: 16px;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.9);
            margin-top: -2px;
        }

        /* Vòng năng lượng sinh mệnh (Chỉ hiện khi hát) */
        .boo-car-avatar-container.active-pulse::before,
        .boo-car-avatar-container.active-pulse::after {
            content: '';
            position: absolute;
            top: -5px; left: -5px; right: -5px; bottom: -5px;
            border-radius: 50%;
            border: 1px dashed rgba(255, 20, 147, 0.9);
            animation: ringRotate 4s linear infinite;
            pointer-events: none;
        }
        .boo-car-avatar-container.active-pulse::after {
            top: -9px; left: -9px; right: -9px; bottom: -9px;
            border: 1px solid rgba(0, 229, 255, 0.7);
            animation: ringRotateReverse 6s linear infinite;
        }
        @keyframes ringRotate { 100% { transform: rotate(360deg); } }
        @keyframes ringRotateReverse { 100% { transform: rotate(-360deg); } }

        /* Mặt lợn Boo chuẩn chỉnh (Trạng thái Hát) */
        .boo-real-face {
            width: 38px;
            height: 38px;
            background: radial-gradient(circle, #ff69b4 0%, #c71585 100%);
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.9);
        }
        .boo-real-face::before, .boo-real-face::after {
            content: ''; position: absolute; top: 3px; width: 10px; height: 7px;
            background: #ff69b4; border-radius: 50%; border: 1px solid rgba(0,229,255,0.6);
        }
        .boo-real-face::before { left: -2px; transform: rotate(-20deg); }
        .boo-real-face::after { right: -2px; transform: rotate(20deg); }
        .boo-snout {
            position: absolute; top: 18px; width: 14px; height: 8px;
            background: #ff1493; border-radius: 50%; border: 1px solid rgba(255,255,255,0.5);
            display: flex; justify-content: space-around; align-items: center;
        }
        .boo-snout span { width: 2px; height: 3px; background: #4a0025; border-radius: 50%; }
        .boo-eyes-mini {
            position: absolute; width: 18px; display: flex; justify-content: space-between; top: 10px;
        }
        .boo-eyes-mini span { width: 3px; height: 4px; background: #000; border-radius: 50%; }

        /* Phần chữ hiển thị */
        .boo-car-info {
            display: flex;
            flex-direction: column;
            max-width: 170px;
            overflow: hidden;
        }
        .boo-car-title {
            color: #ffd700;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.5px;
        }
        .boo-car-sub {
            color: #00e5ff;
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Menu điều khiển mini */
        .boo-mini-controls {
            position: absolute;
            bottom: 60px;
            right: 0;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid #00e5ff;
            padding: 6px 10px;
            border-radius: 16px;
            display: flex;
            gap: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.8);
            opacity: 0;
            pointer-events: none;
            transform: translateY(8px);
            transition: 0.3s ease;
        }
        .boo-mini-controls.active {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }
        .boo-ctrl-btn {
            background: transparent;
            border: 1px solid #ff1493;
            color: #fff;
            font-size: 9px;
            padding: 3px 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
        }
        .boo-ctrl-btn:hover {
            background: #ff1493;
            box-shadow: 0 0 8px #ff1493;
        }
    `;
    document.head.appendChild(style);

    const COMPANY_NAME = "TELEPATHY CORP // KAI-RIPE";
    const WEBSITE_NAME = "TELEPATHY.COM.VN";

    // 2. Bơm Widget vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar-container" id="booAvatarContainer">
            <div class="cyber-heart-k" id="iconBox"><span>K</span></div>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carMainText">${WEBSITE_NAME}</span>
            <span class="boo-car-sub" id="carSubText">${COMPANY_NAME}</span>
        </div>
        <div class="boo-mini-controls" id="booMiniControls">
            <button class="boo-ctrl-btn" id="booPlayBtn">▶ PLAY</button>
            <button class="boo-ctrl-btn" id="booReloadBtn">🔄 RESTART</button>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Xử lý logic chọn đúng nhạc nền chính & chuyển đổi trạng thái mượt mà
    window.addEventListener('DOMContentLoaded', () => {
        // Lọc chuẩn xác: Chỉ bắt thẻ audio có id là bgMusic hoặc file nhạc nền dài, bỏ qua voice ngắn
        let audioTag = document.querySelector('audio#bgMusic') || document.querySelector('audio[id*="music"]');
        if (!audioTag) {
            const allAudios = document.querySelectorAll('audio');
            for (let audio of allAudios) {
                let src = (audio.src || "").toLowerCase();
                // Bỏ qua các file ngắn/voice/login
                if (!src.includes('login') && !src.includes('error') && !src.includes('success')) {
                    audioTag = audio;
                    break;
                }
            }
            if (!audioTag && allAudios.length > 0) audioTag = allAudios[0];
        }

        const avatarContainer = document.getElementById('booAvatarContainer');
        const iconBox = document.getElementById('iconBox');
        const mainText = document.getElementById('carMainText');
        const subText = document.getElementById('carSubText');
        const miniControls = document.getElementById('booMiniControls');
        const playBtn = document.getElementById('booPlayBtn');
        const reloadBtn = document.getElementById('booReloadBtn');

        widget.addEventListener('click', (e) => {
            e.stopPropagation();
            miniControls.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            miniControls.classList.remove('active');
        });

        // Tự động bắt tên bài hát chuẩn từ file nhạc
        let songName = "K-DRIVE: CYBER ANTHEM";
        if (audioTag) {
            try {
                let srcPath = audioTag.src || audioTag.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    let cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                    if (cleanName.length > 2) songName = cleanName.toUpperCase();
                }
            } catch(e) {}
        }

        // Trạng thái HÁT (Playing Mode)
        function setPlayingState() {
            // Biến thành mặt lợn Boo chuẩn kèm vòng năng lượng
            iconBox.className = "boo-real-face";
            iconBox.innerHTML = `
                <div class="boo-eyes-mini"><span></span><span></span></div>
                <div class="boo-snout"><span></span><span></span></div>
            `;
            avatarContainer.classList.add('active-pulse');
            mainText.textContent = songName;      // Tên bài hát tự động bắt chuẩn
            subText.textContent = COMPANY_NAME;   // Tên công ty ở dưới
            playBtn.textContent = "⏸ PAUSE";
        }

        // Trạng thái NGHỈ (Idle Mode)
        function setIdleState() {
            // Biến thành quân bài Ca Cơ chữ K độc quyền
            iconBox.className = "cyber-heart-k";
            iconBox.innerHTML = `<span>K</span>`;
            avatarContainer.classList.remove('active-pulse');
            mainText.textContent = WEBSITE_NAME;  // Website công ty
            subText.textContent = COMPANY_NAME;   // Tên công ty
            playBtn.textContent = "▶ PLAY";
        }

        if (audioTag) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (audioTag.paused) {
                    audioTag.play();
                } else {
                    audioTag.pause();
                }
            });

            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioTag.currentTime = 0;
                audioTag.play();
            });

            audioTag.addEventListener('play', () => setPlayingState());
            audioTag.addEventListener('pause', () => setIdleState());
            audioTag.addEventListener('ended', () => setIdleState());

            if (!audioTag.paused) {
                setPlayingState();
            } else {
                setIdleState();
            }
        }
    });
})();
