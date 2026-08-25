(function() {
    // 1. Tiêm CSS: Giao diện mặt lợn Cyberpunk & Menu điều khiển
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

        /* Avatar mặt lợn Boo chuẩn chỉnh */
        .boo-car-avatar {
            width: 44px;
            height: 42px;
            background: radial-gradient(circle, #ff69b4 0%, #c71585 100%);
            border-radius: 50% 50% 45% 45%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.9);
            transition: transform 0.2s ease;
        }

        /* Tai lợn cụp hai bên */
        .boo-car-avatar::before, .boo-car-avatar::after {
            content: ''; position: absolute; top: 4px; width: 12px; height: 8px;
            background: #ff69b4; border-radius: 50%; border: 1px solid rgba(0,229,255,0.6);
        }
        .boo-car-avatar::before { left: -3px; transform: rotate(-20deg); }
        .boo-car-avatar::after { right: -3px; transform: rotate(20deg); }

        /* Mõm lợn đặc trưng */
        .boo-pig-snout {
            position: absolute;
            top: 20px;
            width: 16px;
            height: 10px;
            background: #ff1493;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.4);
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .boo-pig-snout span {
            width: 2px;
            height: 4px;
            background: #4a0025;
            border-radius: 50%;
        }

        /* Mắt lợn chớp nháy */
        .boo-eyes {
            position: absolute; width: 20px; display: flex; justify-content: space-between; top: 10px;
        }
        .boo-eyes span {
            width: 3px; height: 5px; background: #000; border-radius: 50%;
            animation: booBlink 4s infinite;
        }
        @keyframes booBlink {
            0%, 96%, 100% { transform: scaleY(1); }
            98% { transform: scaleY(0.1); }
        }

        /* Trạng thái phát sáng khi nhạc chạy */
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

        /* Menu điều khiển nhạc mini */
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

    // 2. Bơm Widget vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon">
            <div class="boo-eyes"><span></span><span></span></div>
            <div class="boo-pig-snout"><span></span><span></span></div>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">K-DRIVE: CYBER ANTHEM</span>
            <span class="boo-car-sub">♫ ALBUM MUSIC // 24_7</span>
        </div>
        <div class="boo-mini-controls" id="booMiniControls">
            <button class="boo-ctrl-btn" id="booPlayBtn">⏸ PAUSE</button>
            <button class="boo-ctrl-btn" id="booReloadBtn">🔄 SYNC</button>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Xử lý logic
    window.addEventListener('DOMContentLoaded', () => {
        // Chỉ bắt các thẻ audio chính, loại bỏ các file ngắn/voice phụ bằng cách kiểm tra thời lượng hoặc class
        const audioTags = document.querySelectorAll('audio');
        let audioTag = null;
        
        // Ưu tiên tìm thẻ bgMusic hoặc thẻ dài hơn
        audioTags.forEach(audio => {
            if (audio.id === 'bgMusic' || audio.id.includes('music') || !audio.src.includes('login')) {
                audioTag = audio;
            }
        });
        if (!audioTag && audioTags.length > 0) audioTag = audioTags[0];

        const avatarIcon = document.getElementById('booAvatarIcon');
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

        if (audioTag) {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: 'K-Drive Cyber Anthem',
                    artist: 'K-Drive // Kai-Ripe',
                    album: 'Album Music VIP',
                    artwork: [
                        { src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/BOO%20LOGIC%20OK.png?raw=true', sizes: '512x512', type: 'image/png' }
                    ]
                });
            }

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

            reloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioTag.currentTime = 0;
                audioTag.play();
            });

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
