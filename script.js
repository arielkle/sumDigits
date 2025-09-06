const numberInput = document.getElementById('numberInput');
const visualizeBtn = document.getElementById('visualizeBtn');
const visualizationArea = document.getElementById('visualizationArea');
const resultArea = document.getElementById('resultArea');
const ANIMATION_DELAY = 1500; // ms, increased for better viewing of colors

visualizeBtn.addEventListener('click', () => {
    const numStr = numberInput.value;
    if (numStr && parseInt(numStr) >= 0) {
        const num = parseInt(numStr);
        visualizeRecursion(num);
    } else {
        resultArea.textContent = 'אנא הכנס מספר חיובי ושלם.';
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualizeRecursion(num) {
    visualizeBtn.disabled = true;
    visualizationArea.innerHTML = '';
    resultArea.innerHTML = '';
    
    try {
        const result = await sumDigitsRecursive(num, 0);
        resultArea.innerHTML = `הסכום הסופי הוא: <span class="text-green-600">${result}</span>`;
    } catch (e) {
         resultArea.textContent = "אירעה שגיאה. המספר אולי גדול מדי.";
    } finally {
        visualizeBtn.disabled = false;
    }
}

async function sumDigitsRecursive(num, depth) {
    const indent = depth * 30;
    
    const callDiv = document.createElement('div');
    callDiv.className = 'call-box p-4 border-2 rounded-lg';
    callDiv.style.marginRight = `${indent}px`;
    
    // --- State 1: Calling (Blue) ---
    callDiv.classList.add('state-calling');
    callDiv.innerHTML = `
        <p class="font-bold">קורא ל- <code>sumDigits(${num})</code></p>
        <p class="status text-gray-600">בודק תנאי עצירה...</p>
    `;
    visualizationArea.appendChild(callDiv);
    await sleep(100);
    callDiv.classList.add('visible');

    await sleep(ANIMATION_DELAY);

    // --- State 2: Base Case (Teal) ---
    if (num <= 9) {
        callDiv.classList.remove('state-calling');
        callDiv.classList.add('state-base-case');
        callDiv.innerHTML = `
            <p class="font-bold"><code>sumDigits(${num})</code></p>
            <p class="status text-teal-800"><strong>תנאי עצירה!</strong> המספר חד-ספרתי.</p>
            <p class="font-semibold">מחזיר: <span class="text-xl">${num}</span></p>
        `;
        await sleep(ANIMATION_DELAY);
        return num;
    }

    const lastDigit = num % 10;
    const remainingNum = Math.floor(num / 10);

    // --- State 3: Waiting (Orange) ---
    callDiv.classList.remove('state-calling');
    callDiv.classList.add('state-waiting');
    callDiv.innerHTML = `
        <p class="font-bold"><code>sumDigits(${num})</code></p>
        <p class="status text-gray-600">צריך לחשב: <code class="text-blue-700">${lastDigit} + sumDigits(${remainingNum})</code></p>
        <p class="status text-orange-800 font-semibold">ממתין לתוצאה של <code>sumDigits(${remainingNum})</code>...</p>
    `;
    
    await sleep(ANIMATION_DELAY);

    const resultFromBelow = await sumDigitsRecursive(remainingNum, depth + 1);
    
    // --- State 4: Processing (Indigo) ---
    callDiv.classList.remove('state-waiting');
    callDiv.classList.add('state-processing');
    callDiv.innerHTML = `
         <p class="font-bold"><code>sumDigits(${num})</code></p>
         <p class="status text-indigo-800">קיבלתי בחזרה <strong>${resultFromBelow}</strong> מהקריאה ל-<code>sumDigits(${remainingNum})</code>.</p>
         <p class="status text-gray-800">מחשב: <code class="text-blue-700">${lastDigit} + ${resultFromBelow}</code></p>
    `;

    await sleep(ANIMATION_DELAY);

    const finalResult = lastDigit + resultFromBelow;

    // --- State 5: Returning (Green) ---
    callDiv.classList.remove('state-processing');
    callDiv.classList.add('state-returning');
    callDiv.innerHTML = `
         <p class="font-bold"><code>sumDigits(${num})</code></p>
         <p class="font-semibold text-green-800">מחזיר את הסכום: <span class="text-xl">${finalResult}</span></p>
    `;

    await sleep(ANIMATION_DELAY);

    return finalResult;
}

