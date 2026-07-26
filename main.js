const sourceInput = document.getElementById('sourceInput');
const output = document.getElementById('output');
const encodeBtn = document.getElementById('encodeBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

const KEY = 'enc-web-2026';

function toBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(data) {
  return decodeURIComponent(escape(atob(data)));
}

function encodeSource() {
  const source = sourceInput.value.trim();
  if (!source) {
    output.value = 'Vui lòng nhập mã Python trước.';
    return;
  }

  const base64Value = toBase64(source);
  const encodedBytes = Array.from(base64Value, (char, index) => {
    const keyChar = KEY[index % KEY.length].charCodeAt(0);
    return char.charCodeAt(0) ^ keyChar;
  });

  const payloadHex = encodedBytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  const wrapped = `import base64\n\nkey = "${KEY}"\npayload = "${payloadHex}"\n\nraw = bytes.fromhex(payload)\nplain = bytes(b ^ ord(key[i % len(key)]) for i, b in enumerate(raw))\nsource = base64.b64decode(plain).decode("utf-8")\nexec(source)\n`;

  output.value = wrapped;
}

function copyOutput() {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = 'Đã sao chép';
    setTimeout(() => {
      copyBtn.textContent = 'Sao chép';
    }, 1200);
  });
}

function clearAll() {
  sourceInput.value = '';
  output.value = '';
}

function downloadPy() {
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'encoded_python.py';
  link.click();
  URL.revokeObjectURL(url);
}

encodeBtn.addEventListener('click', encodeSource);
copyBtn.addEventListener('click', copyOutput);
clearBtn.addEventListener('click', clearAll);
downloadBtn.addEventListener('click', downloadPy);

sourceInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    encodeSource();
  }
});
