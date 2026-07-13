function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; 

    var data = JSON.parse(e.postData.contents);
    var action = data.action || "start"; 

    // 1. TỊNH TÂM KHAI TRẬN
    if (action === "start") {
      var timestamp = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
      var idPhien = "KDRIVE-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm");
      sheet.appendRow([
        idPhien, data.account, timestamp, data.lunarDate, data.zodiacHour, 
        data.facing || "", data.position || "", data.buyIn, "", 
        data.result || "0", data.aiEvaluation || "", data.tourneyType || "DAILY"
      ]);
      return ContentService.createTextOutput(JSON.stringify({"status": "success", "id": idPhien})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. ĐỔI TỌA ĐỘ
    else if (action === "update") {
      var searchId = data.idPhien;
      var values = sheet.getDataRange().getValues();
      for (var i = 0; i < values.length; i++) {
        if (values[i][0] === searchId) {
          var currentFacing = values[i][5];   
          var currentPosition = values[i][6]; 
          if (data.facing && currentFacing !== data.facing) {
            sheet.getRange(i + 1, 6).setValue(currentFacing ? (currentFacing + " → " + data.facing) : data.facing);
          }
          if (data.position && currentPosition !== data.position) {
            sheet.getRange(i + 1, 7).setValue(currentPosition ? (currentPosition + " → " + data.position) : data.position);
          }
          return ContentService.createTextOutput(JSON.stringify({"status": "updated"})).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 3. ĐÓNG SỔ
    else if (action === "end") {
      var searchId = data.idPhien;
      var values = sheet.getDataRange().getValues();
      for (var i = 0; i < values.length; i++) {
        if (values[i][0] === searchId) {
          sheet.getRange(i + 1, 9).setValue(data.duration);  
          sheet.getRange(i + 1, 10).setValue(data.result);   
          return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 4. BÁO CÁO X-QUANG KÉP & KIỂM SOÁT THỂ LỰC
    else if (action === "report") {
      var targetAccount = data.account;
      var values = sheet.getDataRange().getValues();
      
      var allTime = { matches: 0, duration: 0, profit: 0, dailyStats: {}, xray: { "DAILY": 0, "MULTIDAY": 0, "DEEPSTACK": 0 } };
      var weekly = { matches: 0, duration: 0, profit: 0, dailyStats: {}, xray: { "DAILY": 0, "MULTIDAY": 0, "DEEPSTACK": 0 } };

      var now = new Date();
      var todayStr = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd");
      var todayDuration = 0; // Bộ đếm số phút hôm nay

      var dayOfWeek = now.getDay();
      var diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      var startOfWeek = new Date(now.getTime());
      startOfWeek.setDate(now.getDate() + diffToMonday);
      startOfWeek.setHours(0,0,0,0);

      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        if (row[1] === targetAccount && row[8] !== "") { 
          var dur = Number(row[8]) || 0;
          var buyIn = Number(String(row[7]).replace(/,/g, '')) || 0; 
          var result = Number(String(row[9]).replace(/,/g, '')) || 0; 
          
          if (buyIn > 0 && buyIn < 10000) { buyIn = buyIn * 1000; }
          var matchProfit = result - buyIn;
          
          var tType = String(row[11]).trim().toUpperCase();
          if(tType !== "DAILY" && tType !== "MULTIDAY" && tType !== "DEEPSTACK") tType = "DAILY";

          var rowDateStr = "";
          var rowDateObj = null;
          if (row[2]) {
            if (row[2] instanceof Date) { rowDateObj = row[2]; rowDateStr = Utilities.formatDate(rowDateObj, "GMT+7", "yyyy-MM-dd"); } 
            else { 
                var parts = String(row[2]).split(" ")[0].split("-");
                if(parts.length === 3) { rowDateObj = new Date(parts[0], parts[1]-1, parts[2]); }
                rowDateStr = String(row[2]).split(" ")[0]; 
            }
          }
          
          // CỘNG DỒN THỜI GIAN THỰC TẾ TRONG NGÀY
          if (rowDateStr === todayStr) {
            todayDuration += dur;
          }

          // Dữ liệu All-Time
          allTime.matches++; allTime.duration += dur; allTime.profit += matchProfit;
          allTime.xray[tType] += matchProfit;
          if (rowDateStr !== "") { 
            if (!allTime.dailyStats[rowDateStr]) { allTime.dailyStats[rowDateStr] = { buyIn: 0, result: 0 }; }
            allTime.dailyStats[rowDateStr].buyIn += buyIn; allTime.dailyStats[rowDateStr].result += result;
          }

          // Dữ liệu Weekly
          if (rowDateObj && rowDateObj.getTime() >= startOfWeek.getTime()) {
            weekly.matches++; weekly.duration += dur; weekly.profit += matchProfit;
            weekly.xray[tType] += matchProfit;
            if (rowDateStr !== "") { 
              if (!weekly.dailyStats[rowDateStr]) { weekly.dailyStats[rowDateStr] = { buyIn: 0, result: 0 }; }
              weekly.dailyStats[rowDateStr].buyIn += buyIn; weekly.dailyStats[rowDateStr].result += result;
            }
          }
        }
      }

      function calcDays(statObj) {
          var tDays = 0, iDays = 0;
          for (var d in statObj.dailyStats) {
              tDays++;
              if (statObj.dailyStats[d].result > statObj.dailyStats[d].buyIn) iDays++;
          }
          return { total: tDays, itm: iDays };
      }
      var atDays = calcDays(allTime);
      var wDays = calcDays(weekly);

      function formatMoney(amount) {
        if (amount === 0) return "0";
        var sign = amount > 0 ? "+" : "";
        var m = amount / 1000000;
        var mStr = (m % 1 === 0) ? m.toString() : m.toFixed(1);
        return sign + mStr + "M";
      }

      var activeData = weekly.matches > 0 ? weekly : allTime; 
      
      var profits = [
          {name: "DAILY", val: activeData.xray["DAILY"]},
          {name: "MULTIDAY", val: activeData.xray["MULTIDAY"]},
          {name: "DEEPSTACK", val: activeData.xray["DEEPSTACK"]}
      ];
      profits.sort(function(a,b) { return b.val - a.val; }); 
      var best = profits[0];
      var worst = profits[2];

      var sciStatus = "SAFE";
      var booHint = "📊 X-Quang: DEEP (" + formatMoney(activeData.xray["DEEPSTACK"]) + ") | MULTI (" + formatMoney(activeData.xray["MULTIDAY"]) + ") | DAILY (" + formatMoney(activeData.xray["DAILY"]) + ")";
      var booCommand = "> BOO: PHONG ĐỘ ỔN ĐỊNH. TIẾP TỤC DUY TRÌ KỶ LUẬT.";

      // ==========================================
      // TÒA ÁN SCI: LUẬT THỜI GIAN VÀ BANKROLL
      // ==========================================
      
      // 1. CHỐT CHẶN THỜI GIAN (Ưu tiên xét xử trước)
      if (todayDuration >= 540) { // Quá 9 tiếng
          sciStatus = "CRITICAL";
          booCommand = "> [ 🔴 SCI VỠ TRẬN ]: NÃO BỘ QUÁ TẢI (CHƠI QUÁ 9 TIẾNG). CẤM NẠP THÊM MẠNG DƯỚI MỌI HÌNH THỨC!";
      } 
      else if (todayDuration >= 360) { // Quá 6 tiếng
          sciStatus = "WARNING";
          booCommand = "> [ 🟠 SCI BÁO ĐỘNG ]: THỂ LỰC SUY GIẢM (TRÊN 6 TIẾNG). YÊU CẦU THU HẸP RANGE BÀI, ĐÁNH TIGHT LẠI!";
      }
      // 2. CHỐT CHẶN TIỀN BẠC (Nếu thời gian chưa vi phạm)
      else if (activeData.profit <= -3000000) {
          if (best.val > 0 && best.name === "DEEPSTACK") {
              sciStatus = "WARNING";
              booCommand = "> [ 🟠 ĐIỀU HƯỚNG ]: " + worst.name + " ĐANG LỖ NẶNG (" + formatMoney(worst.val) + "). CẮT MÁU NGAY LẬP TỨC! ĐỢI THU HOẠCH TẠI DEEPSTACK.";
          } else {
              sciStatus = "CRITICAL";
              booCommand = "> [ 🔴 BÁO ĐỘNG ]: RÒ RỈ CHIP TRÊN DIỆN RỘNG! ĐANG SAY MÁU, LỆNH RỜI BÀN KHẨN CẤP!";
          }
      } 
      else if (activeData.profit < 0) {
          if (best.val > 0) {
              sciStatus = "WARNING";
              booCommand = "> [ 🟠 NHỊP ĐỘ ]: " + worst.name + " ĐANG BÀO MÒN VỐN. HÃY DỒN LỰC VÀO SỞ TRƯỜNG " + best.name + " ĐỂ GỠ LẠI THẾ TRẬN.";
          } else {
              sciStatus = "WARNING";
              booCommand = "> [ 🟠 CẢNH BÁO ]: CHƯA CÓ ĐIỂM SÁNG LỢI NHUẬN. ĐÁNH CHẮC TAY HOẶC NGHỈ NGƠI PHỤC HỒI THỂ LỰC.";
          }
      } 
      else {
          if (worst.val < 0) {
              sciStatus = "SAFE";
              booCommand = "> [ 🟡 CHIẾN THUẬT ]: " + best.name + " ĐANG GÁNH TEAM (" + formatMoney(best.val) + "). TRÁNH VUNG TIỀN BỪA BÃI VÀO " + worst.name + "!";
          } else {
              sciStatus = "SAFE";
              booCommand = "> [ 🟢 ĐỘC TÔN ]: CHIẾN THUẬT HOÀN HẢO. CẢ 3 MẶT TRẬN ĐỀU ĐANG ÉP CHIP ĐỐI THỦ!";
          }
      }

      var reportData = {
        allTime: { matches: allTime.matches, days: atDays.total, itmDays: atDays.itm, duration: allTime.duration, profit: allTime.profit, xray: allTime.xray },
        weekly: { matches: weekly.matches, days: wDays.total, itmDays: wDays.itm, duration: weekly.duration, profit: weekly.profit, xray: weekly.xray },
        todayDuration: todayDuration,
        sciStatus: sciStatus,
        booCommand: booCommand,
        booHint: booHint
      };

      return ContentService.createTextOutput(JSON.stringify({"status": "success", "data": reportData})).setMimeType(ContentService.MimeType.JSON);
    }

  } catch(error) { 
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "No Action"})).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}
