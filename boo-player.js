(function() {
    // 1. CSS & Đồ họa SVG Phi tiêu Sasuke (Có thêm nút Next/Prev tối giản)
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed; bottom: 26px; right: 20px; z-index: 999999;
            display: flex; align-items: center; gap: 12px;
            background: rgba(10, 15, 25, 0.9);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 229, 255, 0.6);
            padding: 8px 16px; border-radius: 35px;
            box-shadow: 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.2);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto; transition: 0.3s ease;
        }
        
        .boo-car-avatar {
            width: 38px; height: 38px; background: rgba(15, 20, 30, 0.95);
            border: 2px solid #ff2a2a; border-radius: 50%; position: relative;
            display: flex; justify-content: center; align-items: center;
            box-shadow: 0 0 15px rgba(255, 42, 42, 0.7), inset 0 0 8px rgba(255, 42, 42, 0.4);
            flex-shrink: 0; transition: box-shadow 0.3s ease; cursor: pointer;
        }
        .boo-car-avatar:active { transform: scale(0.9); }

        .boo-car-avatar.singing {
            animation: shurikenSpin 1.5s linear infinite, booSingPulse 0.6s infinite alternate ease-in-out;
        }
        @keyframes shurikenSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes booSingPulse { 0% { box-shadow: 0 0 12px #ff2a2a, 0 0 20px #00e5ff; } 100% { box-shadow: 0 0 25px #ff2a2a, 0 0 40px #00e5ff; } }

        .floating-note {
            position: absolute; top: -24px; right: 8px; font-size: 14px;
            pointer-events: none; opacity: 0; animation: noteFloatUp 2s infinite linear;
        }
        .boo-car-avatar:not(.singing) .floating-note { display: none; }
        @keyframes noteFloatUp { 0% { transform: translateY(0) scale(0.6); opacity: 1; filter: drop-shadow(0 0 6px #ff2a2a); } 100% { transform: translateY(-32px) scale(1.2) rotate(15deg); opacity: 0; } }

        .boo-car-info { display: flex; flex-direction: column; max-width: 170px; overflow: hidden; }
        .boo-car-title {
            color: #ffd700; font-size: 11px; font-weight: 700; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis; letter-spacing: 1px; text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        
        /* Cụm nút lùi/tới tích hợp tinh tế */
        .boo-mini-controls {
            display: flex; align-items: center; gap: 10px; margin-top: 3px;
        }
        .boo-car-sub { color: #00e5ff; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; }
        .mini-btn {
            color: #00e5ff; font-family: 'Share Tech Mono', monospace; font-size: 10px;
            cursor: pointer; transition: 0.2s; text-shadow: 0 0 5px #00e5ff; font-weight: bold;
        }
        .mini-btn:active { transform: scale(0.8); color: #fff; text-shadow: 0 0 8px #fff; }
    `;
    document.head.appendChild(style);

    // 2. Widget UI
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon">
            <svg width="26" height="26" viewBox="0 0 100 100" style="filter: drop-shadow(0 0 4px #ff2a2a);">
                <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z" fill="#ff2a2a" stroke="#ffffff" stroke-width="3"/>
                <circle cx="50" cy="50" r="14" fill="#0b0f19" stroke="#ff2a2a" stroke-width="4"/>
                <circle cx="50" cy="50" r="5" fill="#ffffff"/>
            </svg>
            <span class="floating-note">🎵</span>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">TELEPATHY COMPANY</span>
            <div class="boo-mini-controls">
                <span class="mini-btn" id="booBtnPrev">[ |◁ ]</span>
                <span class="boo-car-sub">CYBER NINJA : ALBUM I</span>
                <span class="mini-btn" id="booBtnNext">[ ▷| ]</span>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic Auto-Detect >= 45s
    window.addEventListener('DOMContentLoaded', () => {
        // Bắt chính xác thẻ audio nền
        const audioTag = document.querySelector('audio#bg-music') || document.querySelector('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
        const songTitleEl = document.getElementById('carSongTitle');

        if (audioTag) {
            let baseSongName = "K-DRIVE ANTHEM";

            // Hàm cập nhật trạng thái UI
            function updatePlayerUI(isPlaying) {
                if (isPlaying) {
                    avatarIcon.classList.add('singing');
                } else {
                    avatarIcon.classList.remove('singing');
                }
            }

            // Lắng nghe sự thay đổi của bài hát (Auto-detect)
            audioTag.addEventListener('loadedmetadata', () => {
                // CHỐT CHẶN: Chỉ nhận diện bài hát dài >= 45 giây
                if (audioTag.duration < 45) return; 

                try {
                    let srcPath = audioTag.src || audioTag.currentSrc;
                    if (srcPath) {
                        let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                        baseSongName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                        songTitleEl.textContent = baseSongName;

                        // Đẩy lên màn hình khóa điện thoại
                        if ('mediaSession' in navigator) {
                            navigator.mediaSession.metadata = new MediaMetadata({
                                title: baseSongName,
                                artist: 'K-Drive // Kai-Ripe',
                                album: 'Cyber Ninja : Album I',
                                artwork: [{ src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/Music%20anh%20nen.png?raw=true', sizes: '512x512', type: 'image/png' }]
                            });
                        }
                    }
                } catch(e) {}
            });

            // Play / Pause bằng cách click vào phi tiêu
            avatarIcon.addEventListener('click', () => {
                if (audioTag.paused) {
                    audioTag.play().catch(err => console.log(err));
                } else {
                    audioTag.pause();
                }
            });

            // Nút Next / Prev gọi hàm từ file HTML chính (nếu có)
            document.getElementById('booBtnNext').addEventListener('click', () => {
                if (typeof window.nextDreamSong === 'function') window.nextDreamSong();
            });
            document.getElementById('booBtnPrev').addEventListener('click', () => {
                if (typeof window.prevDreamSong === 'function') window.prevDreamSong();
            });

            audioTag.addEventListener('play', () => updatePlayerUI(true));
            audioTag.addEventListener('pause', () => updatePlayerUI(false));
            audioTag.addEventListener('ended', () => updatePlayerUI(false));

            updatePlayerUI(!audioTag.paused);
        }
    });
})();
