(function() {
    // 1. Tiêm CSS nâng cấp: Giao diện Hologram, tai heo Cyberpunk & Menu điều khiển ẩn/hiện
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
            background: rgba(8, 12, 20, 0.9);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 229, 255, 0.6);
            padding: 10px 16px;
            border-radius: 40px;
            box-shadow: 0 0 30px rgba(0, 229, 255, 0.35), inset 0 0 15px rgba(255, 20, 147, 0.2);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }
        .boo-car-widget:hover {
            box-shadow: 0 0 40px rgba(0, 229, 255, 0.6), inset 0 0 20px rgba(255, 20, 147, 0.4);
            border-color: #ff1493;
        }

        /* Avatar mặt Boo cách điệu Cyberpunk */
        .boo-car-avatar {
            width: 42px;
            height: 42px;
            background: radial-gradient(circle, #ff1493 0%, #c71585 100%);
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.9);
            transition: transform 0.2s ease;
        }

        /* Tạo đôi tai heo cyber nhỏ nhắn phía trên */
        .boo-car-avatar::before, .boo-car-avatar::after {
            content: ''; position: absolute; top: -6px; width: 10px; height: 12px;
            background: #ff1493; border-radius: 50% 50% 0 0; border: 1px solid rgba(0,229,255,0.8);
        }
        .boo-car-avatar::before { left: 6px; transform: rotate(-15deg); }
        .boo-car-avatar::after { right: 6px; transform: rotate(15deg); }

        /* Mắt Boo chớp nháy */
        .boo-eyes {
            position: absolute; width: 22px; display: flex; justify-content: space-between; top: 16px;
        }
        .boo-eyes span {
            width: 4px; height: 6px; background: #000; border-radius: 50%;
            animation: booBlink 4s infinite;
        }
        @keyframes booBlink {
            0%, 96%, 100% { transform: scaleY(1); }
            98% { transform: scaleY(0.1); }
        }

        /* Trạng thái đang hát / phát sáng theo nhạc */
        .boo-car-avatar.singing {
            animation: booSingPulse 0.5s infinite alternate ease-in-out;
        }
        @keyframes booSingPulse {
            0% { transform: scale(1); box-shadow: 0 0 15px #ff1493, 0 0 30px #00e5ff; }
            100% { transform: scale(1.18); box-shadow: 0 0 30px #ff1493, 0 0 50px #00e5ff; }
        }

        .boo-car-info {
            display: flex;
            flex-direction: column;
            max-width: 160px;
            overflow: hidden;
        }
        .boo-car-title {
            color: #ffd700;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 1px;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.7);
        }
        .boo-car-sub {
            color: #00e5ff;
            font-size: 9px;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            opacity: 0.9;
        }

        /* Menu điều khiển nhạc mini lơ lửng khi bấm vào */
        .boo-mini-controls {
            position: absolute;
            bottom: 70px;
            right: 0;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid #00e5ff;
            padding: 8px 12px;
            border-radius: 20px;
            display: flex;
            gap: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.8);
            opacity: 0;
            pointer-events: none;
            transform: translateY(10px);
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
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.2s;
        }
        .boo-ctrl-btn:hover {
            background: #ff1493;
            box-shadow: 0 0 10px #ff1493;
        }
    `;
    document.head.appendChild(style);

    // 2. Tự động bơm HTML Widget vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon">
            <div class="boo-eyes"><span></span><span></span></div>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">K-DRIVE: ONLINE</span>
            <span class="boo-car-sub">PHÓ SƯ BOO // VIP</span>
        </div>
        <div class="boo-mini-controls" id="booMiniControls">
            <button class="boo-ctrl-btn" id="booPlayBtn">⏸ PAUSE</button>
            <button class="boo-ctrl-btn" id="booReloadBtn">🔄 SYNC</button>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic xử lý âm thanh, MediaSession và sự kiện tương tác
    window.addEventListener('DOMContentLoaded', () => {
        const audioTag = document.querySelector('audio#bgMusic') || document.querySelector('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
        const songTitleEl = document.getElementById('carSongTitle');
        const miniControls = document.getElementById('booMiniControls');
        const playBtn = document.getElementById('booPlayBtn');
        const reloadBtn = document.getElementById('booReloadBtn');

        // Bấm vào widget để bật/tắt menu điều khiển mini
        widget.addEventListener('click', (e) => {
            e.stopPropagation();
            miniControls.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            miniControls.classList.remove('active');
        });

        if (audioTag) {
            let songName = "K-DRIVE: CYBER ANTHEM";
            try {
                let srcPath = audioTag.src || audioTag.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    songName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                }
            } catch(e) {}

            songTitleEl.textContent = songName;

            // Đồng bộ lên màn hình ô tô qua chuẩn MediaSession
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: songName,
                    artist: 'K-Drive // Kai-Ripe',
                    album: 'Đạo Trường K-Drive VIP',
                    artwork: [
                        { src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/BOO%20LOGIC%20OK.png?raw=true', sizes: '512x512', type: 'image/png' }
                    ]
                });
            }

            // Nút Play/Pause nhanh trên menu mini của Boo
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (audioTag.paused) {
                    audioTag.play();
                    playBtn.textContent = "⏸ PAUSE";
                } else {
                    audioTag.pause();
                    playBtn.textContent = "▶ PLAY";
                }
            });

            // Nút đồng bộ lại âm thanh
            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioTag.currentTime = 0;
                audioTag.play();
            });

            // Lắng nghe trạng thái phát nhạc để đổi hiệu ứng mặt Boo hát
            audioTag.addEventListener('play', () => {
                avatarIcon.classList.add('singing');
                playBtn.textContent = "⏸ PAUSE";
            });

            audioTag.addEventListener('pause', () => {
                avatarIcon.classList.remove('singing');
                playBtn.textContent = "▶ PLAY";
            });

            audioTag.addEventListener('ended', () => {
                avatarIcon.classList.remove('singing');
                playBtn.textContent = "▶ PLAY";
            });

            if (!audioTag.paused) {
                avatarIcon.classList.add('singing');
            }
        }
    });
})();
