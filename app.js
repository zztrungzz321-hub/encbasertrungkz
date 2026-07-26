const inputCode = document.getElementById('inputCode');
const outputCode = document.getElementById('outputCode');

function encodeText(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeText(text) {
  return decodeURIComponent(escape(atob(text)));
}

document.getElementById('encodeBtn').addEventListener('click', () => {
  outputCode.value = 'encoded:' + encodeText(inputCode.value);
});

document.getElementById('decodeBtn').addEventListener('click', () => {
  const text = inputCode.value.trim();
  if (text.startsWith('encoded:')) {
    outputCode.value = decodeText(text.replace('encoded:', ''));
  } else {
    outputCode.value = 'Vui lòng nhập dữ liệu đã được Encode trước.';
  }
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  await navigator.clipboard.writeText(outputCode.value);
  alert('Đã sao chép kết quả!');
});

document.getElementById('clearBtn').addEventListener('click', () => {
  inputCode.value = '';
  outputCode.value = '';
});
