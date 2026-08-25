(function() {
    // 1. Tiêm CSS tối ưu hóa: Sạch sẽ, không che khuất màn hình, không lỗi nút bấm
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(8, 12, 20, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 20, 147, 0.5);
            padding: 6px 12px;
            border-radius: 30px;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.25);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s ease;
            width: auto;
            max-width: 220px;
        }
        .boo-car-widget:hover {
            border-color: #00e5ff;
            box-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
        }

        /* Khung chứa icon */
        .boo-car-avatar-container {
            width: 34px;
            height: 34px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
        }

        /* Quân bài Ca Cơ chữ K (Trạng thái Nghỉ) */
        .cyber-heart-k {
            width: 32px;
            height: 32px;
            background: radial-gradient(circle, #ff1493 0%, #8b008b 100%);
            clip-path: polygon(50% 0%, 100% 35%, 82% 100%, 50% 75%, 18% 100%, 0% 35%);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 10px rgba(255, 20, 147, 0.7);
        }
        .cyber-heart-k span {
            color: #ffd700;
            font-weight: 900;
            font-size: 14px;
            text-shadow: 0 0 6px rgba(255, 215, 0, 0.9);
            margin-top: -2px;
        }

        /* Vòng năng lượng sinh mệnh (Trạng thái Hát) */
        .boo-car-avatar-container.active-pulse::before,
        .boo-car-avatar-container.active-pulse::after {
            content: '';
            position: absolute;
            top: -4px; left: -4px; right: -4px; bottom: -4px;
            border-radius: 50%;
            border: 1px dashed rgba(255, 20, 147, 0.8);
            animation: ringRotate 4s linear infinite;
            pointer-events: none;
        }
        .boo-car-avatar-container.active-pulse::after {
            top: -7px; left: -7px; right: -7px; bottom: -7px;
            border: 1px solid rgba(0, 229, 255, 0.6);
            animation: ringRotateReverse 6s linear infinite;
        }
        @keyframes ringRotate { 100% { transform: rotate(360deg); } }
        @keyframes ringRotateReverse { 100% { transform: rotate(-360deg); } }

        /* Mặt lợn Boo chuẩn chỉnh (Trạng thái Hát) */
        .boo-real-face {
            width: 34px;
            height: 34px;
            background: radial-gradient(circle, #ff69b4 0%, #c71585 100%);
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 12px rgba(255, 20, 147, 0.9);
        }
        .boo-real-face::before, .boo-real-face::after {
            content: ''; position: absolute; top: 2px; width: 9px; height: 6px;
            background: #ff69b4; border-radius: 50%; border: 1px solid rgba(0,229,255,0.6);
        }
        .boo-real-face::before { left: -2px; transform: rotate(-20deg); }
        .boo-real-face::after { right: -2px; transform: rotate(20deg); }
        .boo-snout {
            position: absolute; top: 15px; width: 12px; height: 7px;
            background: #ff1493; border-radius: 50%; border: 1px solid rgba(255,255,255,0.5);
            display: flex; justify-content: space-around; align-items: center;
        }
        .boo-snout span { width: 1.5px; height: 3px; background: #4a0025; border-radius: 50%; }
        .boo-eyes-mini {
            position: absolute; width: 15px; display: flex; justify-content: space-between; top: 8px;
        }
        .boo-eyes-mini span { width: 2.5px; height: 3.5px; background: #000; border-radius: 50%; }

        /* Chữ hiển thị */
        .boo-car-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            pointer-events: none;
        }
        .boo-car-title {
            color: #ffd700;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.5px;
        }
        .boo-car-sub {
            color: #00e5ff;
            font-size: 8.5px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            opacity: 0.9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Menu điều khiển mini */
        .boo-mini-controls {
            position: absolute;
            bottom: 50px;
            right: 0;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid #00e5ff;
            padding: 5px 8px;
            border-radius: 12px;
            display: flex;
            gap: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.8);
            opacity: 0;
            pointer-events: none;
            transform: translateY(6px);
            transition: 0.25s ease;
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
            font-size: 8.5px;
            padding: 3px 6px;
            border-radius: 6px;
            cursor: pointer;
            transition: 0.2s;
        }
        .boo-ctrl-btn:hover {
            background: #ff1493;
            box-shadow: 0 0 6px #ff1493;
        }
    `;
    document.head.appendChild(style);

    const COMPANY_NAME = "TELEPATHY CORP // KAI-RIPE";
    const WEBSITE_NAME = "TELEPATHY.COM.VN";

    // 2. Tạo Widget
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

    // 3. Xử lý logic
    window.addEventListener('DOMContentLoaded', () => {
        let audioTag = document.querySelector('audio#bgMusic') || document.querySelector('audio[id*="music"]');
        if (!audioTag) {
            const allAudios = document.querySelectorAll('audio');
            for (let audio of allAudios) {
                let src = (audio.src || "").toLowerCase();
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

        function setPlayingState() {
            iconBox.className = "boo-real-face";
            iconBox.innerHTML = `
                <div class="boo-eyes-mini"><span></span><span></span></div>
                <div class="boo-snout"><span></span><span></span></div>
            `;
            avatarContainer.classList.add('active-pulse');
            mainText.textContent = songName;
            subText.textContent = COMPANY_NAME;
            playBtn.textContent = "⏸ PAUSE";
        }

        function setIdleState() {
            iconBox.className = "cyber-heart-k";
            iconBox.innerHTML = `<span>K</span>`;
            avatarContainer.classList.remove('active-pulse');
            mainText.textContent = WEBSITE_NAME;
            subText.textContent = COMPANY_NAME;
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
