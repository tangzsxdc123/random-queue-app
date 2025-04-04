const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');

const min = 1;
const max = 10;
let availableNumbers = Array.from({length: max - min + 1}, (_, i) => i + min);

// ใส่ URL ที่คุณได้จาก Google Apps Script ลงไปที่นี่
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwWH4RC7fdE6K_vq1_ms2J1kLG9k9cA2v2ZJcL1-EjrpN9dSwzY_QgJ0uLphd_ns946/exec";

function sendToGoogleSheet(task, name, queueNumber) {
    const data = { task, name, queueNumber };
    fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

generateButton.addEventListener('click', () => {
    const name = nameInput.value;
    const task = taskSelector.value;

    if (!name) {
        alert('กรุณากรอกชื่อก่อน');
        return;
    }

    if (availableNumbers.length === 0) {
        alert('คิวทั้งหมดถูกสุ่มไปหมดแล้ว!');
        return;
    }

    let count = 0;
    const totalDuration = 5000;
    const intervalDuration = 100;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers.splice(randomIndex, 1)[0];
    
    const interval = setInterval(() => {
        count += intervalDuration;
        
        const fakeRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        resultDiv.innerHTML = `ชื่อ: ${name} <br> กำลังสุ่มคิว... <strong>${fakeRandomNumber}</strong>`;
        
        if (count >= totalDuration) {
            clearInterval(interval);
            
            resultDiv.innerHTML =
