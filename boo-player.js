(function() {
    // 1. Tiêm CSS: Trái tim đỏ chuẩn chỉ + Phi tiêu ninja xoay tròn khi hát
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
            max-width: 230px;
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

        /* TRÁI TIM ĐỎ CHUẨN CHỈ (Trạng thái Nghỉ) */
        .cyber-heart-k {
            position: relative;
            width: 28px;
            height: 28px;
            background-color: #ff1493;
            transform: rotate(-45deg);
            box-shadow: 0 0 12px rgba(255, 20, 147, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2px;
        }
        /* Tạo hai nửa hình tròn bên trên của trái tim */
        .cyber-heart-k::before,
        .cyber-heart-k::after {
            content: "";
            position: absolute;
            width: 28px;
            height: 28px;
            background-color: #ff1493;
            border-radius: 50%;
        }
        .cyber-heart-k::before {
            top: -14px;
            left: 0;
        }
        .cyber-heart-k::after {
            left: 14px;
            top: 0;
        }
        /* Chữ K nằm giữa trái tim (xoay ngược lại 45 độ để đứng thẳng) */
        .cyber-heart-k span {
            position: relative;
            z-index: 10;
            color: #ffd700;
            font-weight: 900;
            font-size: 13px;
            text-shadow: 0 0 6px rgba(255, 215, 0, 0.9);
            transform: rotate(45deg);
        }

        /* Phi tiêu Ninja 3 cánh Cyberpunk (Trạng thái Hát - Xoay tròn liên tục) */
        .cyber-ninja-star {
            width: 32px;
            height: 32px;
            background: radial-gradient(circle, #00e5ff 0%, #ff1493 100%);
            clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.9);
            animation: starRotate 1.5s linear infinite;
        }
        .cyber-ninja-star::after {
            content: '';
            width: 10px;
            height: 10px;
            background: #ffd700;
            border-radius: 50%;
            box-shadow: 0 0 6px #fff;
        }
        @keyframes starRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

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

    const STORY_SUB = "CYBER RONIN // CHƯƠNG I";
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
            <span class="boo-car-sub" id="carSubText">${STORY_SUB}</span>
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
            iconBox.className = "cyber-ninja-star";
            iconBox.innerHTML = ``;
            mainText.textContent = songName;
            subText.textContent = STORY_SUB;
            playBtn.textContent = "⏸ PAUSE";
        }

        function setIdleState() {
            iconBox.className = "cyber-heart-k";
            iconBox.innerHTML = `<span>K</span>`;
            mainText.textContent = WEBSITE_NAME;
            subText.textContent = STORY_SUB;
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
