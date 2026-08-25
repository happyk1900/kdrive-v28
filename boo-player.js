(function() {
    // 1. Tự động bơm CSS cho mặt Boo hát và thanh hiển thị bài hát
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(10, 15, 25, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 229, 255, 0.5);
            padding: 8px 14px;
            border-radius: 30px;
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.2);
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
            transition: transform 0.1s ease;
        }
        /* Hiệu ứng chớp mắt của Boo */
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
            100% { transform: scale(1.15); box-shadow: 0 0 25px #ff1493, 0 0 40px #00e5ff; }
        }

        .boo-car-info {
            display: flex;
            flex-direction: column;
            max-width: 180px;
            overflow: hidden;
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
    `;
    document.head.appendChild(style);

    // 2. Tự động bơm HTML Widget vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon"></div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">K-DRIVE: HỆ THỐNG ONLINE</span>
            <span class="boo-car-sub">PHÓ SƯ BOO // VIP</span>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic kết nối âm thanh, đồng bộ MediaSession lên ô tô & điều khiển hiệu ứng mặt Boo hát
    window.addEventListener('DOMContentLoaded', () => {
        const audioTag = document.querySelector('audio#bgMusic') || document.querySelector('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
        const songTitleEl = document.getElementById('carSongTitle');

        if (audioTag) {
            // Lấy tên file nhạc làm tên bài hát hiển thị (hoặc tuỳ chỉnh theo ý anh)
            let songName = "K-DRIVE: CYBERPUNK ANTHEM";
            try {
                let srcPath = audioTag.src || audioTag.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    songName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                }
            } catch(e) {}

            songTitleEl.textContent = songName;

            // Đồng bộ chuẩn phát nhạc lên màn hình ô tô (MediaSession API)
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

            // Theo dõi trạng thái phát nhạc để bật/tắt hiệu ứng mặt Boo hát
            audioTag.addEventListener('play', () => {
                avatarIcon.classList.add('singing');
            });

            audioTag.addEventListener('pause', () => {
                avatarIcon.classList.remove('singing');
            });

            audioTag.addEventListener('ended', () => {
                avatarIcon.classList.remove('singing');
            });

            // Nếu nhạc đang chạy sẵn thì bật hiệu ứng luôn
            if (!audioTag.paused) {
                avatarIcon.classList.add('singing');
            }
        }
    });
})();
