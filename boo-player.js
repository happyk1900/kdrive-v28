(function() {
    // 1. Tự động bơm CSS & Đồ họa SVG Phi tiêu Sasuke chuẩn xác
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
            background: rgba(10, 15, 25, 0.9);
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
            transform: scale(0.96);
        }
        
        /* 🌟 AVATAR PHI TIÊU SASUKE SẮC LẸM ĐỎ RỰC 🌟 */
        .boo-car-avatar {
            width: 38px;
            height: 38px;
            background: rgba(15, 20, 30, 0.95);
            border: 2px solid #ff2a2a;
            border-radius: 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 15px rgba(255, 42, 42, 0.7), inset 0 0 8px rgba(255, 42, 42, 0.4);
            flex-shrink: 0;
            transition: box-shadow 0.3s ease;
        }

        /* Class kích hoạt: Nhạc bật -> Phi tiêu XOAY TÍT MÙ + Phát sáng nhấp nháy */
        .boo-car-avatar.singing {
            animation: shurikenSpin 1.5s linear infinite, booSingPulse 0.6s infinite alternate ease-in-out;
        }
        @keyframes shurikenSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes booSingPulse {
            0% { box-shadow: 0 0 12px #ff2a2a, 0 0 20px #00e5ff; }
            100% { box-shadow: 0 0 25px #ff2a2a, 0 0 40px #00e5ff; }
        }

        /* Hiệu ứng nốt nhạc kép bay mờ ảo trên đầu khi phát nhạc */
        .floating-note {
            position: absolute;
            top: -24px;
            right: 8px;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            animation: noteFloatUp 2s infinite linear;
        }
        .boo-car-avatar:not(.singing) .floating-note {
            display: none;
        }
        @keyframes noteFloatUp {
            0% { transform: translateY(0) scale(0.6); opacity: 1; filter: drop-shadow(0 0 6px #ff2a2a); }
            100% { transform: translateY(-32px) scale(1.2) rotate(15deg); opacity: 0; }
        }

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

    // 2. Tự động bơm Widget kèm hình vẽ SVG Phi tiêu Sasuke vào trang
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar" id="booAvatarIcon">
            <!-- Đồ họa SVG Phi tiêu Sasuke chuẩn y hệt ảnh mẫu -->
            <svg width="26" height="26" viewBox="0 0 100 100" style="filter: drop-shadow(0 0 4px #ff2a2a);">
                <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z" fill="#ff2a2a" stroke="#ffffff" stroke-width="3"/>
                <circle cx="50" cy="50" r="14" fill="#0b0f19" stroke="#ff2a2a" stroke-width="4"/>
                <circle cx="50" cy="50" r="5" fill="#ffffff"/>
            </svg>
            <span class="floating-note">🎵</span>
        </div>
        <div class="boo-car-info">
            <span class="boo-car-title" id="carSongTitle">TELEPATHY COMPANY</span>
            <span class="boo-car-sub" id="carAlbumSub">CHAPTER I: SAMURAI SPIRIT</span>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Logic ĐIỀU KHIỂN ÂM THANH THÔNG MINH (Quét toàn bộ thẻ Audio)
    window.addEventListener('DOMContentLoaded', () => {
        const audioTags = document.querySelectorAll('audio'); // Quét TẤT CẢ các thẻ nhạc trong file
        const avatarIcon = document.getElementById('booAvatarIcon');
        const songTitleEl = document.getElementById('carSongTitle');
        const albumSubEl = document.getElementById('carAlbumSub');
        
        let activeAudio = null; // Biến ghi nhớ thẻ audio nào đang phát

        // Hàm trích xuất tên bài nhạc từ đường link
        function extractSongName(audioElement) {
            if (!audioElement) return "TELEPATHY COMPANY";
            try {
                let srcPath = audioElement.src || audioElement.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                }
            } catch(e) {}
            return "K-DRIVE ANTHEM";
        }

        // Hàm cập nhật Giao diện (Tên, Xoay phi tiêu, Media Session)
        function updatePlayerUI(audioElement, isPlaying) {
            if (isPlaying) {
                activeAudio = audioElement; // Lưu lại bài đang phát
                const songName = extractSongName(audioElement);
                avatarIcon.classList.add('singing');
                songTitleEl.textContent = songName;
                albumSubEl.textContent = "CYBER NINJA : ALBUM I";
                
                // Đồng bộ lên thanh thông báo của điện thoại
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: songName,
                        artist: 'K-Drive // DJ Kai-Ripe',
                        album: 'Cyber Ninja : Album I',
                        artwork: [
                            { src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/Music%20anh%20nen.png?raw=true', sizes: '512x512', type: 'image/png' }
                        ]
                    });
                }
            } else {
                // Chỉ dừng xoay nếu bài bị dừng chính là bài đang active
                if (activeAudio === audioElement) {
                    avatarIcon.classList.remove('singing');
                    songTitleEl.textContent = "TELEPATHY COMPANY";
                    albumSubEl.textContent = "CYBER NINJA : CHAPTER I";
                }
            }
        }

        // Gắn mắt thần theo dõi vào TẤT CẢ các bài nhạc
        audioTags.forEach(audio => {
            audio.addEventListener('play', () => updatePlayerUI(audio, true));
            audio.addEventListener('pause', () => updatePlayerUI(audio, false));
            audio.addEventListener('ended', () => updatePlayerUI(audio, false));
        });

        // Xử lý khi bấm tay vào cái hộp nhạc
        widget.addEventListener('click', () => {
            // Tìm xem có bài nhạc nào đang rên nền không
            let playingAudio = Array.from(audioTags).find(a => !a.paused);
            
            if (playingAudio) {
                playingAudio.pause(); // Nếu có thì tắt đi
            } else {
                // Nếu đang im lặng thì bật bài active gần nhất, hoặc bật đại bài nền (bgMusic)
                let toPlay = activeAudio || document.getElementById('bgMusic') || audioTags[0];
                if (toPlay) {
                    toPlay.play().catch(err => console.log(err));
                }
            }
        });

        // Kiểm tra xem khi web load xong có bài nào bị ép phát luôn không
        let initialPlaying = Array.from(audioTags).find(a => !a.paused);
        if (initialPlaying) {
            updatePlayerUI(initialPlaying, true);
        }
    });
})();
