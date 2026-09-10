(function() {
    // ==========================================
    // 1. BƠM GIAO DIỆN & HIỆU ỨNG ĐỒ HỌA
    // ==========================================
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
            pointer-events: auto; cursor: pointer; transition: 0.3s ease;
        }
        .boo-car-widget:active { transform: scale(0.96); }
        
        .boo-car-avatar {
            width: 38px; height: 38px;
            background: rgba(15, 20, 30, 0.95);
            border: 2px solid #ff2a2a; border-radius: 50%;
            position: relative; display: flex; justify-content: center; align-items: center;
            box-shadow: 0 0 15px rgba(255, 42, 42, 0.7), inset 0 0 8px rgba(255, 42, 42, 0.4);
            flex-shrink: 0; transition: box-shadow 0.3s ease;
        }

        .boo-car-avatar.singing {
            animation: shurikenSpin 1.5s linear infinite, booSingPulse 0.6s infinite alternate ease-in-out;
        }
        @keyframes shurikenSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes booSingPulse {
            0% { box-shadow: 0 0 12px #ff2a2a, 0 0 20px #00e5ff; }
            100% { box-shadow: 0 0 25px #ff2a2a, 0 0 40px #00e5ff; }
        }

        .floating-note {
            position: absolute; top: -24px; right: 8px; font-size: 14px;
            pointer-events: none; opacity: 0; animation: noteFloatUp 2s infinite linear;
        }
        .boo-car-avatar:not(.singing) .floating-note { display: none; }
        @keyframes noteFloatUp {
            0% { transform: translateY(0) scale(0.6); opacity: 1; filter: drop-shadow(0 0 6px #ff2a2a); }
            100% { transform: translateY(-32px) scale(1.2) rotate(15deg); opacity: 0; }
        }

        .boo-car-info { display: flex; flex-direction: column; max-width: 170px; overflow: hidden; }
        .boo-car-title {
            color: #ffd700; font-size: 11px; font-weight: 700;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            letter-spacing: 1px; text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        .boo-car-sub {
            color: #00e5ff; font-size: 9px; letter-spacing: 1px;
            text-transform: uppercase; opacity: 0.9;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. LÕI DỊCH THUẬT LƯỢNG TỬ
    // ==========================================
    const quantumMap = {
        'a': '⟡', 'á': '⟡⁺', 'à': '⟡₋', 'ả': '⟡∼', 'ã': '⟡≈', 'ạ': '⟡•',
        'â': '⌖', 'ấ': '⌖⁺', 'ầ': '⌖₋', 'ẩ': '⌖∼', 'ẫ': '⌖≈', 'ậ': '⌖•',
        'ă': '⍜', 'ắ': '⍜⁺', 'ằ': '⍜₋', 'ẳ': '⍜∼', 'ẵ': '⍜≈', 'ặ': '⍜•',
        'b': '❖', 'c': '⟨', 'd': '⎔', 'đ': '⟠',
        'e': '⟍', 'é': '⟍⁺', 'è': '⟍₋', 'ẻ': '⟍∼', 'ẽ': '⟍≈', 'ẹ': '⟍•',
        'ê': '⍎', 'ế': '⍎⁺', 'ề': '⍎₋', 'ể': '⍎∼', 'ễ': '⍎≈', 'ệ': '⍎•',
        'g': '◎', 'h': '☩', 'i': '║', 'í': '║⁺', 'ì': '║₋', 'ỉ': '║∼', 'ĩ': '║≈', 'ị': '║•',
        'k': '⎈', 'l': '⫷', 'm': '☲', 'n': '☱',
        'o': '⨀', 'ó': '⨀⁺', 'ò': '⨀₋', 'ỏ': '⨀∼', 'õ': '⨀≈', 'ọ': '⨀•',
        'ô': '⍜', 'ố': '⍜⁺', 'ồ': '⍜₋', 'ổ': '⍜∼', 'ỗ': '⍜≈', 'ộ': '⍜•',
        'ơ': '⍥', 'ớ': '⍥⁺', 'ờ': '⍥₋', 'ở': '⍥∼', 'ỡ': '⍥≈', 'ợ': '⍥•',
        'p': '⨁', 'q': '⍟', 'r': 'Ⱬ', 's': '⟡', 't': '⍂',
        'u': '⋃', 'ú': '⋃⁺', 'ù': '⋃₋', 'ủ': '⋃∼', 'ũ': '⋃≈', 'ụ': '⋃•',
        'ư': '⋲', 'ứ': '⋲⁺', 'ừ': '⋲₋', 'ử': '⋲∼', 'ữ': '⋲≈', 'ự': '⋲•',
        'v': '⟁', 'x': '⨂', 'y': '⋫', 'ý': '⋫⁺', 'ỳ': '⋫₋', 'ỷ': '⋫∼', 'ỹ': '⋫≈', 'ỵ': '⋫•',
        '2': '⟡', '6': '⌖', '.': '•', '@': '⌖', '_': '─', '-': '─', ' ': ' '
    };

    function formatText(text) {
        if (!text) return '';
        const currentLang = localStorage.getItem('kdrive_lang') || 'encoded';
        if (currentLang !== 'encoded') return text; // Giữ nguyên nếu đang ở ngôn ngữ thực
        
        return text.split('').map(char => {
            const lower = char.toLowerCase();
            return quantumMap[lower] !== undefined ? quantumMap[lower] : char;
        }).join('');
    }

    // ==========================================
    // 3. TẠO WIDGET TRÊN MÀN HÌNH
    // ==========================================
    const widget = document.createElement('div');
    widget.className = 'boo-car-widget';
    
    // Khởi tạo chữ mặc định đã được dịch
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
            <span class="boo-car-title" id="carSongTitle">${formatText("TELEPATHY COMPANY")}</span>
            <span class="boo-car-sub" id="carAlbumSub">${formatText("CHAPTER I: SAMURAI SPIRIT")}</span>
        </div>
    `;
    document.body.appendChild(widget);

    // ==========================================
    // 4. BỘ ĐIỀU KHIỂN & ĐỘC QUYỀN ÂM THANH
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const audioTags = document.querySelectorAll('audio');
        const avatarIcon = document.getElementById('booAvatarIcon');
        const songTitleEl = document.getElementById('carSongTitle');
        const albumSubEl = document.getElementById('carAlbumSub');
        
        let activeAudio = null;

        // Trích xuất và dọn rác tên bài hát tốt hơn
        function extractSongName(audioElement) {
            if (!audioElement) return formatText("TELEPATHY COMPANY");
            try {
                let srcPath = audioElement.src || audioElement.currentSrc;
                if (srcPath) {
                    let fileName = decodeURIComponent(srcPath.split('/').pop().split('?')[0]);
                    let cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase();
                    return formatText(cleanName);
                }
            } catch(e) {}
            return formatText("K-DRIVE ANTHEM");
        }

        // Cập nhật giao diện
        function updatePlayerUI(audioElement, isPlaying) {
            if (isPlaying) {
                activeAudio = audioElement;
                songTitleEl.textContent = extractSongName(audioElement);
                albumSubEl.textContent = formatText("CYBER NINJA : ALBUM I");
                avatarIcon.classList.add('singing');
                
                // Đồng bộ điện thoại
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: songTitleEl.textContent,
                        artist: 'K-Drive // DJ Kai-Ripe',
                        album: 'Cyber Ninja : Album I',
                        artwork: [{ src: 'https://github.com/happyk1900/-m-thanh-app/blob/main/Music%20anh%20nen.png?raw=true', sizes: '512x512', type: 'image/png' }]
                    });
                }
            } else {
                if (activeAudio === audioElement) {
                    avatarIcon.classList.remove('singing');
                    songTitleEl.textContent = formatText("TELEPATHY COMPANY");
                    albumSubEl.textContent = formatText("CHAPTER I: SAMURAI SPIRIT");
                }
            }
        }

        audioTags.forEach(audio => {
            audio.addEventListener('play', () => {
                // TÍNH NĂNG ĐỘC QUYỀN: Dừng tất cả các bài khác khi 1 bài đang phát
                audioTags.forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                    }
                });
                updatePlayerUI(audio, true);
            });
            audio.addEventListener('pause', () => updatePlayerUI(audio, false));
            audio.addEventListener('ended', () => updatePlayerUI(audio, false));
        });

        // Xử lý Click Play/Pause
        widget.addEventListener('click', () => {
            let playingAudio = Array.from(audioTags).find(a => !a.paused);
            
            if (playingAudio) {
                playingAudio.pause();
            } else {
                let toPlay = activeAudio || document.getElementById('bgMusic') || audioTags[0];
                if (toPlay) {
                    let playPromise = toPlay.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => console.log("Lỗi tự động phát: ", err));
                    }
                }
            }
        });

        // Lắng nghe lệnh đổi ngôn ngữ từ hệ thống HUD
        window.addEventListener('kdriveLangChanged', () => {
            if (activeAudio && !activeAudio.paused) {
                songTitleEl.textContent = extractSongName(activeAudio);
                albumSubEl.textContent = formatText("CYBER NINJA : ALBUM I");
            } else {
                songTitleEl.textContent = formatText("TELEPATHY COMPANY");
                albumSubEl.textContent = formatText("CHAPTER I: SAMURAI SPIRIT");
            }
        });

        // Tự động kiểm tra bài đang phát khi load trang
        let initialPlaying = Array.from(audioTags).find(a => !a.paused);
        if (initialPlaying) updatePlayerUI(initialPlaying, true);
    });
})();
