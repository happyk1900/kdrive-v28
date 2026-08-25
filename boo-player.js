(function() {
    // 1. Tiêm CSS: Giao diện Ninja Cyber Boo + Hiệu ứng nốt nhạc bay lơ lửng
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

        /* Ninja Cyber Boo đội nón (Trạng thái Hát) */
        .cyber-ninja-boo {
            width: 34px;
            height: 34px;
            background: radial-gradient(circle, #ff69b4 0%, #4a0025 100%);
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 12px rgba(255, 20, 147, 0.9);
        }
        /* Nón Ninja Cyber che phần trên */
        .cyber-ninja-boo::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -3px;
            right: -3px;
            height: 18px;
            background: linear-gradient(135deg, #111, #333);
            border-bottom: 2px solid #00e5ff;
            clip-path: polygon(0 100%, 50% 0%, 100% 100%);
        }
        .boo-snout-ninja {
            position: absolute;
            top: 18px;
            width: 12px;
            height: 7px;
            background: #ff1493;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.5);
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 2;
        }
        .boo-snout-ninja span { width: 1.5px; height: 3px; background: #000; border-radius: 50%; }

        /* Hiệu ứng nốt nhạc bay lên đầu khi đang hát */
        .music-note-float {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #00e5ff;
            text-shadow: 0 0 8px #00e5ff;
            animation: noteFly 1.5s infinite ease-in-out;
            pointer-events: none;
            z-index: 10;
        }
        @keyframes noteFly {
            0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(-50%, -18px) scale(1.2); opacity: 0; }
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
            <div id="noteContainer"></div>
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

        const avatarContainer = document.getElementById('booAvatarContainer');
        const iconBox = document.getElementById('iconBox');
        const noteContainer = document.getElementById('noteContainer');
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
            iconBox.className = "cyber-ninja-boo";
            iconBox.innerHTML = `
                <div class="boo-snout-ninja"><span></span><span></span></div>
            `;
            // Thêm nốt nhạc bay lơ lửng trên đầu
            noteContainer.innerHTML = `<div class="music-note-float">♫</div>`;
            mainText.textContent = songName;
            subText.textContent = STORY_SUB;
            playBtn.textContent = "⏸ PAUSE";
        }

        function setIdleState() {
            iconBox.className = "cyber-heart-k";
            iconBox.innerHTML = `<span>K</span>`;
            noteContainer.innerHTML = ``; // Xóa nốt nhạc khi dừng
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
