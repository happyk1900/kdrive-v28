.boo-car-avatar {
            width: 44px;
            height: 42px;
            background: radial-gradient(circle, #ff69b4 0%, #c71585 100%);
            border-radius: 50% 50% 45% 45%; /* Tạo form đầu hơi bầu bĩnh của lợn */
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.9);
            transition: transform 0.2s ease;
        }

        /* Tai lợn (cụp sang hai bên thay vì dựng đứng như thỏ) */
        .boo-car-avatar::before, .boo-car-avatar::after {
            content: ''; position: absolute; top: 4px; width: 12px; height: 8px;
            background: #ff69b4; border-radius: 50%; border: 1px solid rgba(0,229,255,0.6);
        }
        .boo-car-avatar::before { left: -3px; transform: rotate(-20deg); }
        .boo-car-avatar::after { right: -3px; transform: rotate(20deg); }

        /* Mõm lợn đặc trưng ở chính giữa */
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

        /* Mắt lợn Boo */
        .boo-eyes {
            position: absolute; width: 20px; display: flex; justify-content: space-between; top: 10px;
        }
        .boo-eyes span {
            width: 3px; height: 5px; background: #000; border-radius: 50%;
            animation: booBlink 4s infinite;
        }
