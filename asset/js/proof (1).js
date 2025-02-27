function handleConfirmClick() {
if (document.getElementById('proofPopup')) {
return;
}
const uniqueCode = document.getElementById('unique-code').value;
const popupHtml = `
<div class="proof-info" id="proofPopup">
<div class="proof-content">
<h3>Upload Proof of Payment</h3>
<p>Anyone who modifies or edits the screenshot of proof of payment will result in the transaction being cancelled automatically.</p>
<input type="text" id="popupUnixCode" name="popupUnixCode" readonly value="${uniqueCode}" style="display:none;"/>
<input type="file" id="popupFile" name="popupFile" accept="image/*" required style="display:none;"/>
<label for="popupFile">Upload Image</label>
<div id="imagePreview"></div>
<div class="nav-proof">
<button id="close-proof">Close</button>
<button id="upload-proof" type="button" onclick="sendProofToTelegram()">Upload</button>
</div>
</div>
</div>`;

const popupContainer = document.createElement('div');
popupContainer.innerHTML = popupHtml;
document.body.appendChild(popupContainer);
}

document.addEventListener('change', function (event) {
if (event.target && event.target.id === 'popupFile') {
previewImage();
}
});

function previewImage() {
const fileInput = document.getElementById('popupFile');
const previewContainer = document.getElementById('imagePreview');
const file = fileInput.files[0];

if (file && file.type.startsWith('image/')) {
const reader = new FileReader();
reader.onload = function (e) {
previewContainer.style.display = 'block';
previewContainer.innerHTML = `<img src="${e.target.result}" alt="Proof Of Payment"/>`;
};
reader.readAsDataURL(file);
} else {
previewContainer.style.display = 'none';
previewContainer.innerHTML = '';
}
}

document.addEventListener('click', function (e) {
if (e.target && e.target.id === 'close-proof') {
document.querySelector('.proof-info').style.display = 'none';
}
});

async function sendProofToTelegram() {
const unixCode = document.getElementById('popupUnixCode').value;
const fileInput = document.getElementById('popupFile');
const file = fileInput.files[0];

if (!file) {
alert('Please upload a photo of proof of transfer.');
return;
}

const sendButton = document.querySelector('button[onclick="sendProofToTelegram()"]');
sendButton.disabled = true;
sendButton.textContent = 'Progress...';

const formData = new FormData();
formData.append('chat_id', '6115365841');
formData.append('caption', `Proof of Transfer for Invoice: ${unixCode}`);
formData.append('photo', file);

const botToken = '7555714605:AAFWIOLjh6K7qZNQmzKqOOnw7Jgui4qZw9k';
const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;

try {
const response = await fetch(url, {
method: 'POST',
body: formData
});

const result = await response.json();
if (result.ok) {
alert('Proof of transfer successfully sent!');
document.querySelector('.info-payment').style.display = 'none';
document.querySelector('.proof-info').style.display = 'none';
} else {
alert('Failed to send proof of transfer: ' + result.description);
}
} catch (error) {
console.error('Error:', error);
alert('An error occurred while sending proof of transfer.');
} finally {
sendButton.disabled = false;
sendButton.textContent = 'Upload';
}
}

document.addEventListener('click', function (event) {
if (event.target && event.target.id === 'confirmation') {
event.preventDefault();
handleConfirmClick();
}
});
