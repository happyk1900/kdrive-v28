(function() {
    // 1. Tự động bơm CSS cho widget, mặt Boo chớp mắt, nốt nhạc bay và cụm nút điều khiển vật lý
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed;
            bottom: 26px;
            right: 20px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(10, 15, 25, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 229, 255, 0.6);
            padding: 8px 14px;
            border-radius: 35px;
            box-shadow: 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.2);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            transition: 0.3s ease;
        }
        .boo-car-avatar {
            width: 36px;
            height: 36px;
            background: #ff1493;
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.8);
            transition: transform 0.2s ease;
            cursor: pointer;
            flex-shrink: 0;
        }
        /* Hiệu ứng chớp mắt gốc của Boo */
        .boo-car-avatar::before, .boo-car-avatar::after {
            content: ''; position: absolute; width: 4px; height: 7px; top: 12px; background: #000; border-radius: 50%;
        }
        .boo-car-avatar::before { left: 10px; }
        .boo-car-avatar::after { right: 10px; }

        /* Class kích hoạt trạng thái "Đang hát" - Phát sáng nhấp nháy theo nhạc */
        .boo-car-avatar.singing {
            animation: booSingPulse 0.6s infinite alternate ease-in-out;
        }
        @keyframes booSingPulse {
            0% { transform: scale(1); box-shadow: 0 0 10px #ff1493, 0 0 20px #00e5ff; }
            100% { transform: scale(1.12); box-shadow: 0 0 25px #ff1493, 0 0 40px #00e5ff; }
        }

        /* Hiệu ứng nốt nhạc bay mờ ảo trên đầu khi phát nhạc */
        .floating-note {
            position: absolute;
            top: -22px;
            right: 2px;
            font-size: 13px;
            pointer-events: none;
            opacity: 0;
            animation: noteFloatUp 1.8s infinite linear;
        }
        .floating-note:nth-child(2) {
            right: 18px;
            animation-delay: 0.9s;
            font-size: 10px;
        }
        .boo-car-avatar:not(.singing) .floating-note {
            display: none;
        }
        @keyframes noteFloatUp {
            0% { transform: translateY(0) scale(0.7); opacity: 1; filter: drop-shadow(0 0 4px #ff1493); }
            100% { transform: translateY(-30px) scale(1.3) rotate(15deg); opacity: 0; }
        }

        .boo-car-info {
            display: flex;
            flex-direction: column;
            max-width: 160px;
            overflow: hidden;
            cursor: pointer;
        }
        .boo-car-title {
            color: #ffd700;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 1px;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        .boo-car-sub {
            color: #00e5ff;
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
        }

        /* Nút bấm vật lý điều khiển nhạc */
        .boo-car-ctrl {
            background: transparent;
            border: 1px solid rgba(0, 229, 255, 0.5);
            color: #00e5ff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 10px;
            transition: 0.2s;
            flex-shrink: 0;
        }
        .boo-car-ctrl:hover {
            background: rgba(0, 229, 255, 0.2);
            box-shadow: 0 0 10px #00e5ff;
        }
    `;
    document.head.appendChild(style);

    // 2. Tự động bơm HTML Widget vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon" title="Bấm để bật/tắt nhạc">
            <span class="floating-note">🎵</span>
            <span class="floating-note">🎶</span>
        </div>
        <div class="boo-car-info" id="booInfoArea" title="Bấm để bật/tắt nhạc">
            <span class="boo-car-title" id="carSongTitle">TELEPATHY COMPANY</span>
            <span class="boo-car-sub" id="carAlbumSub">Cyber Ninja : Chương I</span>
        </div>
        <button class="boo-car-ctrl" id="carPlayBtn" title="Play/Pause">▶</button>
    `;
    document.body.appendChild(widget);

    // 3. Logic điều khiển âm thanh, đồng bộ MediaSession và trạng thái giao diện
    window.addEventListener('DOMContentLoaded', () => {
        const audioTag = document.querySelector('audio#bgMusic') || document.querySelector('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
        const infoArea = document.getElementById('booInfoArea');
        const playBtn = document.getElementById('carPlayBtn');
        const songTitleEl = document.getElementById('carSongTitle');
        const albumSubEl = document.getElementById('carAlbumSub');

        if (audioTag) {
            let baseSongName = "K-DRIVE ANTHEM";
            try {
                let srcPath = audioTag.src || audioTag.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    baseSongName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                }
            } catch(e) {}

            // Cập nhật giao diện đồng bộ khi Play / Pause
            function updatePlayerUI(isPlaying) {
                if (isPlaying) {
                    avatarIcon.classList.add('singing');
                    songTitleEl.textContent = baseSongName; // Tên bài hát tự update
                    albumSubEl.textContent = "Cyber Ninja : Album I";
                    playBtn.textContent = "❚❚"; // Biểu tượng Pause
                } else {
                    avatarIcon.classList.remove('singing');
                    songTitleEl.textContent = "TELEPATHY COMPANY";
                    albumSubEl.textContent = "Cyber Ninja : Chương I";
                    playBtn.textContent = "▶"; // Biểu tượng Play
                }
            }

            // Đồng bộ chuẩn phát nhạc lên màn hình ô tô & màn hình khóa điện thoại (MediaSession API)[cite: 4]
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: baseSongName,
                    artist: 'K-Drive // Kai-Ripe',
                    album: 'Cyber Ninja : Album I',
                    artwork: [
                        { src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/Music%20anh%20nen.png?raw=true', sizes: '512x512', type: 'image/png' }
                    ]
                });
            }

            // Hàm xử lý Play/Pause chung khi bấm vào avatar, vùng chữ hoặc nút vật lý
            function togglePlayState() {
                if (audioTag.paused) {
                    audioTag.play().then(() => {
                        updatePlayerUI(true);
                    }).catch(err => console.log(err));
                } else {
                    audioTag.pause();
                    updatePlayerUI(false);
                }
            }

            avatarIcon.addEventListener('click', togglePlayState);
            infoArea.addEventListener('click', togglePlayState);
            playBtn.addEventListener('click', togglePlayState);

            // Lắng nghe sự kiện phát nhạc từ thẻ Audio gốc[cite: 4]
            audioTag.addEventListener('play', () => updatePlayerUI(true));
            audioTag.addEventListener('pause', () => updatePlayerUI(false));
            audioTag.addEventListener('ended', () => updatePlayerUI(false));

            // Trạng thái khởi tạo ban đầu[cite: 4]
            updatePlayerUI(!audioTag.paused);
        }
    });
})();
