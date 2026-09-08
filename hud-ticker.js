<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#000000">
    <title>K-Drive - Quantum HUD Protocol</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; }
        body, html { width: 100%; height: 100%; overflow: hidden; background-color: #020406; font-family: 'Share Tech Mono', monospace; }

        /* MÀN HÌNH NỀN HUD LƯỢNG TỬ */
        #quantum-hud-bg { position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 1; background: radial-gradient(circle at center, #05101a 0%, #020406 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        
        /* KHU VỰC ĐIỀU KHIỂN & GIẢI MÃ NGÔN NGỮ (NÚT BẤM KÈM MŨI TÊN CHỈ DẪN) */
        #decoder-control-hub { position: absolute; top: 20px; right: 20px; z-index: 200; display: flex; align-items: center; gap: 10px; }
        
        .decoder-btn {
            background: rgba(0, 255, 102, 0.15); border: 1.5px solid #00ff66; color: #00ff66;
            font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: bold; padding: 8px 14px;
            border-radius: 6px; cursor: pointer; text-shadow: 0 0 8px #00ff66; box-shadow: 0 0 12px rgba(0,255,102,0.3);
            transition: all 0.2s; backdrop-filter: blur(4px);
        }
        .decoder-btn:hover { background: rgba(0, 255, 102, 0.3); box-shadow: 0 0 20px #00ff66; color: #fff; }

        /* MŨI TÊN CHỈ DẪN NHẤP NHÁY THU HÚT NGƯỜI DÙNG MỚI */
        .guide-arrow-container { display: flex; align-items: center; gap: 6px; animation: bounceArrow 1.2s infinite ease-in-out; pointer-events: none; }
        .guide-arrow-text { color: #00ff66; font-size: 11px; text-shadow: 0 0 6px #00ff66; font-weight: bold; letter-spacing: 1px; }
        .guide-arrow-icon { color: #00ff66; font-size: 16px; text-shadow: 0 0 8px #00ff66; }

        @keyframes bounceArrow {
            0%, 100% { transform: translateX(0); opacity: 0.6; }
            50% { transform: translateX(-6px); opacity: 1; }
        }

        /* KHUNG HUD TRUNG TÂM HIỂN THỊ KÝ HIỆU BÍ ẨN MẶC ĐỊNH */
        .hud-terminal-box {
            position: relative; z-index: 50; width: 90%; max-width: 380px;
            background: rgba(5, 10, 15, 0.88); border: 2px solid rgba(160, 192, 208, 0.4);
            border-radius: 12px; padding: 25px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.9), inset 0 0 20px rgba(160,192,208,0.15);
            backdrop-filter: blur(8px);
        }

        .hud-glyph-title { font-size: 20px; color: #a0c0d0; letter-spacing: 3px; margin-bottom: 15px; text-shadow: 0 0 10px rgba(160,192,208,0.6); }
        .hud-glyph-body { font-size: 14px; color: #8899a6; line-height: 1.8; margin-bottom: 25px; letter-spacing: 2px; }

        .hud-action-btn {
            background: rgba(160, 192, 208, 0.15); border: 1.5px solid #a0c0d0; color: #fff;
            font-family: 'Share Tech Mono', monospace; font-size: 14px; font-weight: bold; letter-spacing: 2px;
            padding: 12px 25px; border-radius: 8px; cursor: pointer; transition: all 0.2s;
            box-shadow: 0 0 12px rgba(160,192,208,0.3); text-transform: uppercase; width: 100%;
        }
        .hud-action-btn:hover { background: rgba(160, 192, 208, 0.3); border-color: #fff; box-shadow: 0 0 20px #fff; }
    </style>
</head>
<body>

    <div id="quantum-hud-bg"></div>

    <!-- KHU VỰC ĐIỀU KHIỂN & GIẢI MÃ NGÔN NGỮ KÈM MŨI TÊN CHỈ DẪN -->
    <div id="decoder-control-hub">
        <div class="guide-arrow-container" id="guide-pointer">
            <span class="guide-arrow-text" data-i18n="guide_txt">GIẢI MÃ</span>
            <span class="guide-arrow-icon">◀</span>
        </div>
        <button class="decoder-btn" id="lang-toggle-btn" onclick="toggleDecoderMode()">🌐 [DECODE]</button>
    </div>

    <!-- BẢNG HUD GIAO DIỆN CHÍNH -->
    <div class="hud-terminal-box">
        <div class="hud-glyph-title" id="hud-title">⎈ 𝚫-𝚲𝚯𝚸-𝚭⎈</div>
        <div class="hud-glyph-body" id="hud-desc">
            ◼◼◼ 𝚱-𝚫𝚹𝚨 𝚲𝚰𝚴𝚮 𝚻Ự ◼◼◼<br>
            [𝚫𝚷𝚼-𝚪𝚬𝚺-𝟶𝟾𝟾𝟖]<br>
            >>> 𝚨𝚱𝚻𝚰𝚳 𝚺𝚼𝚴𝚾 𝚪𝚰𝚫 <<<
        </div>
        <button class="hud-action-btn" id="hud-btn" onclick="executeHudAction()">⚡ [⎔-𝚫𝚱𝚾] ⚡</button>
    </div>

    <script>
        // TRẠNG THÁI GIẢM MÃ (MẶC ĐỊNH LÀ KÝ HIỆU CÔNG NGHỆ BÍ ẨN)
        let isDecoded = false;

        const glyphData = {
            title: "⎈ 𝚫-𝚲𝚯𝚸-𝚭⎈",
            desc: "◼◼◼ 𝚱-𝚫𝚹𝨨 𝚲𝚰𝚴𝚮 𝚻Ự ◼◼◼<br>[𝚫𝚷𝚼-𝚪𝚬𝚺-𝟶𝟾𝟾𝟖]<br>>> 𝚨𝚱𝚻𝚰𝚳 𝚺𝚼𝚴𝚾 𝚪𝚰𝚫 <<<",
            btn: "⚡ [⎔-𝚫𝚱𝚾] ⚡",
            guide: "GIẢI MÃ"
        };

        const humanData = {
            title: "⚡ GIAO DIỆN LÕI ⚡",
            desc: "◼ HỆ THỐNG AN NINH LƯỢNG TỬ ◼<br>[TRẠNG THÁI: HOẠT ĐỘNG]<br>>> CHẠM ĐỂ KẾT NỐI HỆ THỐNG <<<",
            btn: "KHỞI CHẠY HỆ THỐNG",
            guide: "KÝ HIỆU"
        };

        function toggleDecoderMode() {
            isDecoded = !isDecoded;
            playSound('coin');

            let titleEl = document.getElementById('hud-title');
            let descEl = document.getElementById('hud-desc');
            let btnEl = document.getElementById('hud-btn');
            let guideTxtEl = document.querySelector('.guide-arrow-text');
            let guideBox = document.getElementById('guide-pointer');

            if (isDecoded) {
                // ĐÃ GIẢM MÃ VỀ TIẾNG VIỆT
                titleEl.innerHTML = humanData.title;
                descEl.innerHTML = humanData.desc;
                btnEl.innerHTML = humanData.btn;
                guideTxtEl.innerText = humanData.guide;
                guideBox.style.opacity = '0.4'; // Mờ dần mũi tên khi đã giải mã
            } else {
                // QUAY VỀ KÝ HIỆU CÔNG NGHỆ BÍ ẨN MẶC ĐỊNH
                titleEl.innerHTML = glyphData.title;
                descEl.innerHTML = glyphData.desc;
                btnEl.innerHTML = glyphData.btn;
                guideTxtEl.innerText = glyphData.guide;
                guideBox.style.opacity = '1';
            }
        }

        function executeHudAction() {
            playSound('katana');
            alert(isDecoded ? "Hệ thống đã sẵn sàng kết nối!" : "⚠️ CẢNH BÁO: HỆ THỐNG ĐANG Ở MÃ HÓA LƯỢNG TỬ!");
        }

        // Âm thanh tương tác công nghệ đơn giản
        let fxCtx = null;
        function playSound(type) {
            try {
                if (!fxCtx) fxCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (fxCtx.state === 'suspended') fxCtx.resume();
                const osc = fxCtx.createOscillator();
                const gain = fxCtx.createGain();
                osc.connect(gain); gain.connect(fxCtx.destination);
                
                if (type === 'coin') {
                    osc.type = 'sine'; osc.frequency.setValueAtTime(1200, fxCtx.currentTime);
                    osc.frequency.setValueAtTime(1800, fxCtx.currentTime + 0.08);
                    gain.gain.setValueAtTime(0.2, fxCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, fxCtx.currentTime + 0.15);
                } else {
                    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, fxCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(200, fxCtx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.25, fxCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, fxCtx.currentTime + 0.15);
                }
                osc.start(); osc.stop(fxCtx.currentTime + 0.15);
            } catch(e) {}
        }
    </script>
</body>
</html>
