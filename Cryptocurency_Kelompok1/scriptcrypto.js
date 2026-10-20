// Data Kunci Private Asimetris
const KP_A = "ABC";
const KP_B = "567";

// tabel konversi karakter untuk enkripsi dan dekripsi
const mapEnkripsi = {
    // 1. Huruf Kapital
    'A': '1', 'B': '2', 'C': '3', 'D': '4', 'E': '5',
    'F': '6', 'G': '7', 'H': '8', 'I': '9', 'J': '10',
    'K': '11', 'L': '12', 'M': '13', 'N': '14', 'O': '15',
    'P': '16', 'Q': '17', 'R': '18', 'S': '19', 'T': '20',
    'U': '21', 'V': '22', 'W': '23', 'X': '24', 'Y': '25',
    'Z': '26',

    // 2. Huruf Kecil
    'a': '52', 'b': '51', 'c': '50', 'd': '49', 'e': '48',
    'f': '47', 'g': '46', 'h': '45', 'i': '44', 'j': '43',
    'k': '42', 'l': '41', 'm': '40', 'n': '39', 'o': '38',
    'p': '37', 'q': '36', 'r': '35', 's': '34', 't': '33',
    'u': '32', 'v': '31', 'w': '30', 'x': '29', 'y': '28',
    'z': '27',

    // 3. Angka (0 - 5)
    '0': '53',
    '1': 'A',
    '2': 'a',
    '3': 'Z',
    '4': 'z',
    '5': '54',

    // 4. Simbol Khusus
    '&': '$',
    '#': '@',
    '$': '&'
};

// Tabel Dekripsi (Membalikkan Peta Enkripsi secara Otomatis)
const mapDekripsi = {};
for (let key in mapEnkripsi) {
    mapDekripsi[mapEnkripsi[key]] = key;
}

let isPasswordValid = false;

// Event Listener saat mengetik password
document.getElementById('passwordInput').addEventListener('input', function() {
    const psw = this.value;
    validatePassword(psw);
});

// Fungsi Validasi Aturan Password
function validatePassword(psw) {
    const msg = document.getElementById('validationMessage');
    
    // Aturan 1: Tepat 4 Digit
    if (psw.length !== 4) {
        msg.className = "validation-msg msg-invalid";
        msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Password harus tepat 4 karakter!';
        isPasswordValid = false;
        clearOutputs();
        return;
    }

    // Aturan 2: Memiliki 2 Alfabet & Salah Satu Wajib Kapital
    const alphabets = psw.match(/[a-zA-Z]/g) || [];
    const hasUpper = /[A-Z]/.test(psw);
    if (alphabets.length !== 2 || !hasUpper) {
        msg.className = "validation-msg msg-invalid";
        msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harus 2 huruf (minimal 1 Kapital)!';
        isPasswordValid = false;
        clearOutputs();
        return;
    }

    // Aturan 3: 1 Angka antara 0 - 5
    const digits = psw.match(/[0-5]/g) || [];
    if (digits.length !== 1) {
        msg.className = "validation-msg msg-invalid";
        msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harus memuat 1 angka (antara 0 hingga 5)!';
        isPasswordValid = false;
        clearOutputs();
        return;
    }

    // Aturan 4: 1 Simbol (&, #, atau $)
    const symbols = psw.match(/[&#$]/g) || [];
    if (symbols.length !== 1) {
        msg.className = "validation-msg msg-invalid";
        msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Harus memuat 1 simbol (&, #, atau $)!';
        isPasswordValid = false;
        clearOutputs();
        return;
    }

    // Jika Semua Aturan Terpenuhi
    msg.className = "validation-msg msg-valid";
    msg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Password Valid! Memenuhi Aturan.';
    isPasswordValid = true;

    // Jalankan Enkripsi & Dekripsi
    prosesEnkripsi(psw);
}

// Fungsi Enkripsi Password (Berdasarkan Tabel Konversi)
function prosesEnkripsi(psw) {
    const encrypted = Array.from(psw, char => mapEnkripsi[char] || char).join(".");
    document.getElementById('encryptedOutput').innerText = encrypted;
    prosesKirimDanDekripsi();
}

// Fungsi Pengiriman & Dekripsi oleh Pihak A / B
function prosesKirimDanDekripsi() {
    if (!isPasswordValid) return;

    const encryptedData = document.getElementById('encryptedOutput').innerText;
    const target = document.querySelector('input[name="target"]:checked').value;
    const penerima = document.querySelector('input[name="penerima"]:checked').value;
    
    // Proses Dekripsi
    const decrypted = encryptedData
        .split(".")
        .map(token => mapDekripsi[token] || token)
        .join("");

    document.getElementById('decryptedOutput').innerText = decrypted;

    // Ambil Kunci Private Penerima
    const kp = (penerima === 'A') ? KP_A : KP_B;
    const combined = decrypted + kp;

    document.getElementById('combinedOutput').innerText = `${decrypted} + ${kp} = ${combined}`;

    // VALIDASI LOGIKA:
    // 1. Password hasil dekripsi harus cocok dengan password asli.
    // 2. Target Pengiriman HARUS SAMA dengan Penerima Asli.
    const validationBox = document.getElementById('validationResult');
    const pswOriginal = document.getElementById('passwordInput').value;

    if (decrypted === pswOriginal && target === penerima) {
        validationBox.className = "status-badge status-true";
        validationBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> STATUS VALIDASI: TRUE (Penerima Sesuai)';
    } else {
        validationBox.className = "status-badge status-false";
        if (target !== penerima) {
            validationBox.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> STATUS VALIDASI: FALSE (Salah Kirim! Harusnya ke ${target}, tapi diterima ${penerima})`;
        } else {
            validationBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> STATUS VALIDASI: FALSE (Password Tidak Cocok)';
        }
    }
}

// Clear Output jika input tidak valid
function clearOutputs() {
    document.getElementById('encryptedOutput').innerText = "-";
    document.getElementById('decryptedOutput').innerText = "-";
    document.getElementById('combinedOutput').innerText = "-";
    
    const validationBox = document.getElementById('validationResult');
    validationBox.className = "status-badge status-false";
    validationBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> STATUS VALIDASI: FALSE';
}

// Fungsi Copy to Clipboard
function copyEncrypted() {
    const text = document.getElementById('encryptedOutput').innerText;
    if (text !== "-") {
        navigator.clipboard.writeText(text);
        alert("Ciphertext berhasil disalin: " + text);
    }
}