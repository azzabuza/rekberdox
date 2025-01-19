// WIDGET
const header = document.getElementById('header');
const footer = document.getElementById('footer');

fetch('../template/header.html').then(function (snap) {
snap.text().then(function (result) {
if (header) {
header.innerHTML = result;
updateCartCount();
}
});
});
fetch('../template/footer.html').then(function (snap) {
snap.text().then(function (result) {
if (footer) {
footer.innerHTML = result;
}
});
});

// WEBSITE TAKEDOWN
var deadLine = new Date('3000-01-01');
var currentDate = new Date();
var timeDifference = deadLine - currentDate;

if (timeDifference <= 0) {
setTimeout(function () {
var popupElement = document.createElement('div');
popupElement.innerHTML = `
<div class="expired">
<div class="expired-content">
<h3>Lisensi Tidak Valid</h3>
<p>Silahkan beli lisensi untuk penggunaan komersial ke developer (Azza Kreatif Digital Studio).</p>
<p>Meluncur dalam waktu <span id="countdown">10</span> detik.</p>
</div>
</div>`;
document.body.appendChild(popupElement);

var countdownElement = document.getElementById('countdown');
var countdownTime = 10;

var countdownInterval = setInterval(function () {
countdownTime--;
countdownElement.textContent = countdownTime;
if (countdownTime <= 0) {
clearInterval(countdownInterval);
window.location.href = 'https://www.instagram.com/azzabuza';
}
}, 1000);
}, 10000);
}
