// Tạo thẻ style chứa toàn bộ CSS của HUD cũ và Ticker mới
const hudStyle = document.createElement('style');
hudStyle.innerHTML = `
    /* CSS CỦA HUD CŨ */
    .cyber-hud-container {
        position: fixed; top: 15px; left: 20px; right: 20px;
        display: flex; justify-content: space-between; align-items: flex-start;
        z-index: 9999999; pointer-events: none;
        font-family: 'Share Tech Mono', monospace; color: #00e5ff;
        text-shadow: 0 0 8px rgba(0,229,255,0.6);
    }
    .hud-left, .hud-right { display: flex; flex-direction: column; gap: 4px; }
    .hud-right { align-items: flex-end; text-align: right; }
    .hud-line { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; display: flex; align-items: center; gap: 6px; }
    .hud-gps { font-size: 8.5px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
    .signal-bars { display: flex; gap: 2px; align-items: flex-end; height: 10px; margin-right: 5px; }
    .bar { width: 3px; background: #00e5ff; animation: signalPulse 1.5s infinite; }
    .bar:nth-child(1) { height: 4px; animation-delay: 0s; }
    .bar:nth-child(2) { height: 7px; animation-delay: 0.2s; }
    .bar:nth-child(3) { height: 10px; animation-delay: 0.4s; }
    .bar:nth-child(4) { height: 7px; animation-delay: 0.6s; opacity: 0.3; }
    @keyframes signalPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; box-shadow: 0 0 8px #00e5ff; } }

    /* CSS CỦA TICKER KÊNH THẾ GIỚI */
    .hud-world-ticker {
        margin-top: 6px;
        font-size: 10.5px;
        background: rgba(5, 8, 15, 0.75);
        border-left: 2px solid #ff0055;
        padding: 3px 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 260px;
        backdrop-filter: blur(4px);
        pointer-events: auto; /* Cho phép click nếu cần */
        border-radius: 0 4px 4px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    }
    .hud-world-ticker span { color: #ff0055; font-weight: bold; margin-right: 5px; }
`;
document.head.appendChild(hudStyle);

// Tạo khung HTML chứa HUD và Ticker
const hudContainer = document.createElement('div');
hudContainer.className = 'cyber-hud-container';
hudContainer.innerHTML = `
    <div class="hud-left">
        <div class="hud-line">
            <div class="signal-bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
            SYS.ONLINE // 2126
        </div>
        <div class="hud-line" style="color: #ffffff;">USER: GUEST</div>
        <div class="hud-gps">GPS: 21.06°N, 105.91°E</div>
        
        <!-- Ticker Kênh Thế Giới bám dưới HUD bên trái -->
        <div class="hud-world-ticker" id="hudWorldTicker">
            <span>Hệ Thống:</span> Đang kết nối mạng lưới...
        </div>
    </div>
    <div class="hud-right">
        <div class="hud-line" style="letter-spacing: 3px;">K-DRIVE v2.6</div>
        <div class="hud-gps" style="color: #ffffff; font-family: 'Montserrat', sans-serif;">2126.08.31</div>
    </div>
`;
document.body.appendChild(hudContainer);

// Logic chạy chữ Kênh Thế Giới
const chatMessages = [
    { account: "Ares", text: "Hệ thống 1 dòng chạy tít mù." },
    { account: "Kaze", text: "Đấu trường Arena mở chưa?" },
    { account: "Kai", text: "Bảo mật tuyệt đối, không sợ hack." },
    { account: "Viper", text: "Widget mới nhìn xịn phết." },
    { account: "Shadow", text: "Chuẩn bị nộp file log Địa Luân thôi anh em." }
];

function updateTicker() {
    const ticker = document.getElementById('hudWorldTicker');
    if (!ticker) return;
    const msg = chatMessages[Math.floor(Math.random() * chatMessages.length)];
    ticker.innerHTML = \`<span>\${msg.account}:</span> \${msg.text}\`;
}

// Đổi tin nhắn mỗi 3.5 giây
setInterval(updateTicker, 3500);
