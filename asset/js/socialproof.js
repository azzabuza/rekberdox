var sp_freqency = 5000;
var sp_timeout = 3000;
var popbackup = "";

var names = ["Rika", "Husna", "Sinta", "Mega", "vina", "Irma", "Gatot", "Lukman", "Rasya", "Sabrina", "Solehah", "Maryam", "Fiki", "Fina", "Afandi", "Ahmad", "Ilham", "Krishna", "Aby", "Ningsih", "Doni", "Dodi", "Dona", "Dani", "Dina", "Diana", "Dewi", "Dewo", "Dewa", "Edi", "Edo", "Farah", "Farhan", "Fada", "Gita", "Gani", "Galang"];

var times = ["5", "8", "9", "10", "12", "15", "17", "18", "19", "21", "22", "28", "30", "31", "34", "36", "38", "41", "43", "44"];

// set data for the first time
fn_UpdateSocialProofData();
document.querySelector(".socialproof").style.display = 'none';

// set interval for popping up/down
var togglevar = setInterval(function () {
fn_ToggleSocialProof();
}, sp_freqency);

// set what to do on close
document.querySelector(".socialproof-close").addEventListener('click', function () {
// Stop all timers and hide social proof
clearTimeout(popbackup);
clearInterval(togglevar);
document.querySelector(".socialproof").style.display = 'none';
});

function fn_UpdateSocialProofData() {
var selectedname = names[Math.floor(Math.random() * names.length)];
var selectedtime = times[Math.floor(Math.random() * times.length)];

document.getElementById("sp_user").textContent = selectedname;
document.getElementById("sp_time").textContent = selectedtime;
}

function fn_ToggleSocialProof() {
var socialProof = document.querySelector(".socialproof");
if (window.getComputedStyle(socialProof).display === 'none') {
socialProof.style.display = 'block';
fn_UpdateSocialProofData();
popbackup = setTimeout(function () {
socialProof.style.display = 'none';
}, sp_timeout);
} else {
socialProof.style.display = 'none';
}
}
