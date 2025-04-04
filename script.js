const app = document.getElementById('root');

// 📝 กำหนดช่วงตัวเลขที่คุณต้องการ ที่นี่
const min = 1;
const max = 10;
let availableNumbers = Array.from({length: max - min + 1}, (_, i) => i + min);

// ฟังก์ชันสำหรับดึงข้อมูลที่เคยเก็บไว้จาก LocalStorage
function loadPreviousResults() {
    const savedData = localStorage.getItem('randomQueueResults');
    return savedData ? JSON.parse(savedData) : [];
}

// ฟังก์ชันสำหรับบันทึกข้อมูลลง LocalStorage
function saveResult(name, queueNumber) {
    const previousResults = loadPreviousResults();
    previousResults.push({ name, queueNumber, timestamp: new Date().toLocaleString() });
    localStorage.setItem('randomQueueResults', JSON.stringify(previousResults));
}

// ฟังก์ชันสำหรับแสดงข้อมูลที่เคยสุ่มได้
function displayPreviousResults() {
    const previousResults = loadPreviousResults();
    const resultsDiv = document.getElementById('previousResults');
    resultsDiv.innerHTML = '<h3>ประวัติการสุ่มคิว</h3>';
    
    previousResults.forEach(result => {
        resultsDiv.innerHTML += `<p>ชื่อ: ${result.name} | คิวที่สุ่มได้: ${result.queueNumber} | เวลา: ${result.timestamp}</p>`;
    });
}

app.innerHTML = `
    <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #ff8a47; margin-bottom: 0;">สุ่มคิวงาน</h1>
        <h2 style="color: #ff7a38; margin-top: 0;">ร้านยยมือทงกดบัตร</h2>
        <input id="nameInput" placeholder="กรอกชื่อของคุณ" style="padding: 10px; margin-top: 10px;"><br>
        <button id="generateButton" style="padding: 10px 20px; margin-top: 10px; background-color: #ff8a47; color: white; border: none; border-radius: 5px; cursor: pointer;">สุ่มคิว</button>
        <div id="result" style="margin-top: 20px;"></div>
        <div id="previousResults" style="margin-top: 20px;"></div>
    </div>
`;

// โหลดข้อมูลที่เคยสุ่มไว้ตอนที่หน้าเว็บโหลดขึ้นมา
displayPreviousResults();

document.getElementById('generateButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;

    if (!name) {
        alert('กรุณากรอกชื่อก่อน');
        return;
    }

    if (availableNumbers.length === 0) {
        alert('คิวทั้งหมดถูกสุ่มไปหมดแล้ว!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers.splice(randomIndex, 1)[0];
    
    let count = 0;
    const totalDuration = 2000; // ระยะเวลาที่จะทำการสุ่ม (มิลลิวินาที) = 2 วินาที
    const intervalDuration = 100; // ระยะเวลาที่จะเปลี่ยนเลขในแต่ละครั้ง (มิลลิวินาที)

    const interval = setInterval(() => {
        count += intervalDuration;

        // แสดงตัวเลขสุ่มไปมา
        const fakeRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        document.getElementById('result').innerHTML = `
            <p>ชื่อ: ${name}</p>
            <p>กำลังสุ่มคิว... <strong>${fakeRandomNumber}</strong></p>
        `;

        // เมื่อครบเวลาที่กำหนด ก็แสดงผลลัพธ์จริง
        if (count >= totalDuration) {
            clearInterval(interval);

            document.getElementById('result').innerHTML = `
                <p>ชื่อ: ${name}</p>
                <p>คิวที่สุ่มได้: <strong>${randomQueue}</strong></p>
            `;

            // บันทึกผลลัพธ์ลงใน LocalStorage
            saveResult(name, randomQueue);

            // แสดงรายการที่เคยสุ่ม
            displayPreviousResults();
        }
    }, intervalDuration);
});
