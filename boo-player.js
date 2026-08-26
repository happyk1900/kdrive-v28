(function() {
    // 1. Tự động bơm CSS cho widget với hiệu ứng Phi tiêu Ninja xoay và nốt nhạc bay
    const style = document.createElement('style');
    style.innerHTML = `
        .boo-car-widget {
            position: fixed;
            bottom: 26px;
            right: 20px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(10, 15, 25, 0.88);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 229, 255, 0.6);
            padding: 8px 16px;
            border-radius: 35px;
            box-shadow: 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.2);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            cursor: pointer;
            transition: 0.3s ease;
        }
        .boo-car-widget:active {
            transform: scale(0.95);
        }
        .boo-car-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #00e5ff, #b026ff);
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.8);
            transition: transform 0.3s ease;
        }
        
        /* Trạng thái CHƯA PHÁT: Hiển thị chữ K to đẹp */
        .boo-car-avatar .avatar-k {
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            font-family: 'Space Grotesk', sans-serif;
            text-shadow: 0 0 10px #00e5ff, 0 0 20px #ff1493;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Trạng thái ĐANG PHÁT: Biến thành Phi tiêu Ninja 3 cánh xoay tít */
        .boo-car-avatar.spinning {
            background: radial-gradient(circle, #1a0033 0%, #000 100%);
            border: 1px solid #00e5ff;
            animation: ninjaSpin 1.2s linear infinite;
            box-shadow: 0 0 25px #00e5ff, 0 0 40px #ff1493;
        }
        .boo-car-avatar.spinning .avatar-k {
            display: none; /* Ẩn chữ K */
        }
        /* Vẽ phi tiêu ninja 3 cánh bằng CSS Vector */
        .boo-car-avatar.spinning::after {
            content: '';
            position: absolute;
            width: 26px;
            height: 26px;
            background: conic-gradient(#00e5ff 0deg 120deg, #ff1493 120deg 240deg, #ffd700 240deg 360deg);
            clip-path: polygon(50% 50%, 100% 0%, 65% 35%, 100% 100%, 35% 65%, 0% 100%, 0% 35%);
            box-shadow: 0 0 10px #fff;
        }
        @keyframes ninjaSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Hiệu ứng nốt nhạc bay lơ lửng trên đầu khi phát nhạc */
        .floating-note {
            position: absolute;
            top: -20px;
            right: 5px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            animation: noteFloatUp 1.8s infinite linear;
        }
        .floating-note:nth-child(2) {
            right: 20px;
            animation-delay: 0.9s;
            font-size: 11px;
        }
        .boo-car-avatar:not(.spinning) .floating-note {
            display: none; /* Tắt nốt nhạc khi chưa phát */
        }
        @keyframes noteFloatUp {
            0% { transform: translateY(0) scale(0.8); opacity: 1; filter: drop-shadow(0 0 5px #ff1493); }
            100% { transform: translateY(-35px) scale(1.3) rotate(15deg); opacity: 0; }
        }

        .boo-car-info {
            display: flex;
            flex-direction: column;
            max-width: 190px;
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
        <div class="boo-car-avatar" id="booAvatarIcon">
            <span class="avatar-k">K</span>
            <span class="floating-note">🎵</span>
            <span class="floating-note">🎶</span>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">Cyber Ninja : Chương I</span>
            <span class="boo-car-sub" id="carAlbumSub">www.telepathy.com.vn</span>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic điều khiển âm thanh, đồng bộ MediaSession và trạng thái giao diện
    window.addEventListener('DOMContentLoaded', () => {
        const audioTag = document.querySelector('audio#bg-music') || document.querySelector('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
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

            // Hàm cập nhật giao diện theo trạng thái Play/Pause
            function updatePlayerUI(isPlaying) {
                if (isPlaying) {
                    avatarIcon.classList.add('spinning');
                    songTitleEl.textContent = baseSongName; // Tên bài hát tự update
                    albumSubEl.textContent = "Cyber Ninja : Album I";
                } else {
                    avatarIcon.classList.remove('spinning');
                    songTitleEl.textContent = "Cyber Ninja : Chương I";
                    albumSubEl.textContent = "www.telepathy.com.vn";
                }
            }

            // Đồng bộ chuẩn phát nhạc lên màn hình ô tô & màn hình khóa điện thoại (MediaSession API)
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

            // Sự kiện tương tác bấm vào widget để Play / Pause nhạc
            widget.addEventListener('click', () => {
                if (audioTag.paused) {
                    audioTag.play().then(() => {
                        updatePlayerUI(true);
                    }).catch(err => console.log(err));
                } else {
                    audioTag.pause();
                    updatePlayerUI(false);
                }
            });

            // Lắng nghe sự kiện từ thẻ Audio
            audioTag.addEventListener('play', () => updatePlayerUI(true));
            audioTag.addEventListener('pause', () => updatePlayerUI(false));
            audioTag.addEventListener('ended', () => updatePlayerUI(false));

            // Trạng thái khởi tạo ban đầu
            updatePlayerUI(!audioTag.paused);
        }
    });
})();
