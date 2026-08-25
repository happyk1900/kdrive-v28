(function() {
    // 1. Tiêm CSS: Giao diện 2 trạng thái (Logo khi nghỉ vs Mặt lợn Boo + Vòng năng lượng khi hát)
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
            background: rgba(8, 12, 20, 0.85);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 229, 255, 0.5);
            padding: 8px 14px;
            border-radius: 30px;
            box-shadow: 0 0 25px rgba(0, 229, 255, 0.3);
            font-family: 'Space Grotesk', sans-serif;
            pointer-events: auto;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }
        .boo-car-widget:hover {
            box-shadow: 0 0 35px rgba(0, 229, 255, 0.6);
            border-color: #ff1493;
        }

        /* Khung chứa hình ảnh (Logo hoặc Mặt lợn Boo) */
        .boo-car-avatar-container {
            width: 38px;
            height: 38px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Hiệu ứng vòng năng lượng sinh mệnh (chỉ chạy khi đang hát) */
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
            top: -8px; left: -8px; right: -8px; bottom: -8px;
            border: 1px solid rgba(0, 229, 255, 0.6);
            animation: ringRotateReverse 6s linear infinite;
        }
        @keyframes ringRotate {
            100% { transform: rotate(360deg); }
        }
        @keyframes ringRotateReverse {
            100% { transform: rotate(-360deg); }
        }

        .boo-car-img {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
            transition: transform 0.3s ease;
        }

        /* Phần chữ hiển thị */
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
            letter-spacing: 0.5px;
        }
        .boo-car-sub {
            color: #00e5ff;
            font-size: 9px;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Menu điều khiển nhạc mini ẩn hiện khi bấm vào */
        .boo-mini-controls {
            position: absolute;
            bottom: 60px;
            right: 0;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid #00e5ff;
            padding: 6px 10px;
            border-radius: 16px;
            display: flex;
            gap: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.8);
            opacity: 0;
            pointer-events: none;
            transform: translateY(8px);
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
            font-size: 9px;
            padding: 3px 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
        }
        .boo-ctrl-btn:hover {
            background: #ff1493;
            box-shadow: 0 0 8px #ff1493;
        }
    `;
    document.head.appendChild(style);

    // 2. Định nghĩa nguồn ảnh và text cho 2 trạng thái
    const LOGO_URL = "https://github.com/happyk1900/kdrive-v28/blob/main/TELEPATHY-01-01.png?raw=true";
    // Sư phụ có thể thay link ảnh mặt lợn Boo chuẩn của anh vào đây (hiện tại em dùng link ảnh mẫu Boo)
    const BOO_SING_URL = "https://github.com/happyk1900/-m-thanh-app/blob/main/BOO%20LOGIC%20OK.png?raw=true"; 

    const COMPANY_NAME = "TELEPATHY CORP // KAI-RIPE";
    const WEBSITE_NAME = "TELEPATHY.COM.VN";

    // 3. Bơm Widget vào trang (Mặc định ở trạng thái Nghỉ: Hiện Logo + Website)
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    widget.innerHTML = `
        <div class="boo-car-avatar-container" id="booAvatarContainer">
            <img class="boo-car-img" id="booImage" src="${LOGO_URL}" alt="Logo">
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

    // 4. Xử lý logic chuyển đổi thông minh giữa 2 trạng thái
    window.addEventListener('DOMContentLoaded', () => {
        const audioTags = document.querySelectorAll('audio');
        let audioTag = null;
        
        audioTags.forEach(audio => {
            if (audio.id === 'bgMusic' || audio.id.includes('music') || !audio.src.includes('login')) {
                audioTag = audio;
            }
        });
        if (!audioTag && audioTags.length > 0) audioTag = audioTags[0];

        const avatarContainer = document.getElementById('booAvatarContainer');
        const booImage = document.getElementById('booImage');
        const mainText = document.getElementById('carMainText');
        const subText = document.getElementById('carSubText');
        const miniControls = document.getElementById('booMiniControls');
        const playBtn = document.getElementById('booPlayBtn');
        const reloadBtn = document.getElementById('booReloadBtn');

        // Bấm vào widget để mở/đóng menu điều khiển mini
        widget.addEventListener('click', (e) => {
            e.stopPropagation();
            miniControls.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            miniControls.classList.remove('active');
        });

        // Hàm chuyển sang trạng thái HÁT (Playing Mode)
        function setPlayingState() {
            booImage.src = BOO_SING_URL;
            avatarContainer.classList.add('active-pulse');
            mainText.textContent = "K-DRIVE: CYBER ANTHEM"; // Tên bài hát
            subText.textContent = COMPANY_NAME;           // Tên công ty / Celebrity
            playBtn.textContent = "⏸ PAUSE";
        }

        // Hàm chuyển về trạng thái NGHỈ (Idle / Logo Mode)
        function setIdleState() {
            booImage.src = LOGO_URL;
            avatarContainer.classList.remove('active-pulse');
            mainText.textContent = WEBSITE_NAME;          // Website công ty
            subText.textContent = COMPANY_NAME;           // Tên công ty
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

            audioTag.addEventListener('play', () => {
                setPlayingState();
            });

            audioTag.addEventListener('pause', () => {
                setIdleState();
            });

            audioTag.addEventListener('ended', () => {
                setIdleState();
            });

            // Kiểm tra trạng thái thực tế khi tải trang xong
            if (!audioTag.paused) {
                setPlayingState();
            } else {
                setIdleState();
            }
        }
    });
})();
