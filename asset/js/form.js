// URL Script Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbx9VidO21wA6S6VVTGg2Lrb6rGS8-QMkiS3pOl5OjiydhRGfr-JA0sCEQbUGxTmC0fhYQ/exec';

// Format angka dengan titik pemisah ribuan dan awalan "Rp"
function formatRupiah(value) {
const number = value.replace(/[^0-9]/g, '');
if (!number) return 'Rp 0';
return `Rp ${parseInt(number, 10).toLocaleString('id-ID')}`;
}

// Hitung biaya admin berdasarkan total transaksi
function calculateAdminFee(total) {
if (total >= 100000 && total < 1000000) return 10000; // 100rb - 999rb
if (total >= 1000000 && total < 10000000) return 20000; // 1jt - 9.999jt
if (total >= 10000000 && total < 20000000) return 35000; // 10jt - 19.999jt
if (total >= 20000000 && total < 40000000) return 50000; // 20jt - 39.99jt
if (total >= 40000000 && total < 50000000) return 100000; // 40jt - 49.99jt
if (total >= 50000000) return total * 0.002; // >50jt (0.2%)
return 5000; // Default: 10rb - 99rb
}

// Hitung total harga dan biaya admin
function calculateTotal() {
const priceValue = document.getElementById('price').value.replace(/[^0-9]/g, '');
const quantity = parseInt(document.getElementById('quantity').value) || 0;
const price = parseInt(priceValue) || 0;
const shippingFeeValue = document.getElementById('shipping-fee').getAttribute('data-value') || 0;
const shippingFee = parseInt(shippingFeeValue) || 0;

// Validasi input
if (quantity <= 0 || price <= 0) {
document.getElementById('sub-total').value = 'Rp 0';
document.getElementById('admin-fee').value = 'Rp 0';
document.getElementById('total').value = 'Rp 0';
return;
}

// Hitung subtotal, biaya admin, dan total
const subTotal = price * quantity;
const adminFee = calculateAdminFee(subTotal);
const total = subTotal + adminFee + shippingFee;

// Tampilkan biaya admin, biaya pengiriman, dan total
document.getElementById('sub-total').value = `Rp ${subTotal.toLocaleString('id-ID')}`;
document.getElementById('admin-fee').value = `Rp ${adminFee.toLocaleString('id-ID')}`;
document.getElementById('total').value = `Rp ${total.toLocaleString('id-ID')}`;
document.getElementById('shipping-fee').value = formatRupiah(shippingFeeValue);

return { subTotal, adminFee, total, shippingFee };
}

// Format rupiah pada input harga
document.getElementById('price').addEventListener('input', function (e) {
const rawValue = e.target.value.replace(/[^0-9]/g, '');
e.target.value = formatRupiah(rawValue);
calculateTotal();
});

// Format rupiah pada input shipping fee (biaya pengiriman)
document.getElementById('shipping-fee').addEventListener('input', function (e) {
const rawValue = e.target.value.replace(/[^0-9]/g, '');
const formattedValue = formatRupiah(rawValue);

// Menyimpan nilai asli (tanpa format Rupiah) di data atribut
e.target.setAttribute('data-value', rawValue);

// Mengubah tampilan nilai dengan format Rupiah
e.target.value = formattedValue;
calculateTotal();
});

// Hitung ulang total saat jumlah barang berubah
document.getElementById('quantity').addEventListener('input', calculateTotal);

// Menetapkan kode unik pada saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
const uniqueCode = `TRX-${Date.now()}`;
document.getElementById('unique-code').value = uniqueCode;
calculateTotal();
});

// Fungsi salin teks
async function copyText() {
const textElement = document.getElementById('xCode');

if (!textElement || !textElement.textContent) {
console.error("Elemen dengan ID 'xCode' tidak ditemukan atau kontennya kosong.");
return;
}

const codeText = textElement.textContent.trim();
if (!codeText) {
console.error("Tidak ada teks untuk disalin.");
return;
}

try {
if (navigator.clipboard) {
await navigator.clipboard.writeText(codeText);
alert('Kode transaksi berhasil disalin!');
} else {
const textArea = document.createElement("textarea");
textArea.value = codeText;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
alert('Kode transaksi berhasil disalin (fallback)!');
}
} catch (err) {
console.error('Gagal menyalin teks:', err);
alert('Terjadi kesalahan saat menyalin kode transaksi!');
}
}

// Menangani pengiriman formulir
document.getElementById('shoppingForm').addEventListener('submit', async function (e) {
e.preventDefault();

const formData = new FormData(e.target);

// Ambil data biaya admin, total, dan biaya pengiriman dari kalkulasi
const { subTotal, adminFee, total, shippingFee } = calculateTotal();

// Format nilai sebelum dikirim ke Spreadsheet
formData.append('sub-total', `Rp ${subTotal.toLocaleString('id-ID')}`);
formData.append('admin-fee', `Rp ${adminFee.toLocaleString('id-ID')}`);
formData.append('total', `Rp ${total.toLocaleString('id-ID')}`);
formData.append('shipping-fee', `Rp ${shippingFee.toLocaleString('id-ID')}`);

// Validasi data
if (![...formData.values()].every(value => value.trim())) {
alert("Harap lengkapi semua data.");
return;
}

toggleLoading(true);

try {
const response = await fetch(scriptURL, { method: 'POST', body: formData });
if (!response.ok) throw new Error(`Server error: ${response.status}`);
const result = await response.json();

// Menampilkan informasi pembayaran jika response berhasil
if (document.querySelector('.info-payment')) {
displayPaymentInfo(formData, subTotal, adminFee, total, shippingFee);
} else {
console.error("Elemen info-payment tidak ditemukan.");
}

e.target.reset();
calculateTotal();
} catch (error) {
console.error('Fetch Error:', error);
alert("Gagal membuat transaksi.");
} finally {
toggleLoading(false);
}
});

// Tampilkan atau sembunyikan indikator loading
function toggleLoading(isLoading) {
document.querySelector(".shopping-button").style.display = isLoading ? "none" : "block";
document.getElementById("waiting-process").style.display = isLoading ? "block" : "none";
}

// Tampilkan informasi pembayaran
function displayPaymentInfo(formData, subTotal, adminFee, total, shippingFee) {
const paymentInfo = document.querySelector(".info-payment");

// Ambil kode unik
const uniqueCode = formData.get("Kode Transaksi");

// Format nilai admin-fee dan total
const subTotalFormatted = `Rp ${parseInt(formData.get("sub-total").replace(/[^0-9]/g, ''), 10).toLocaleString('id-ID')}`;
const adminFeeFormatted = `Rp ${parseInt(formData.get("admin-fee").replace(/[^0-9]/g, ''), 10).toLocaleString('id-ID')}`;
const totalFormatted = `Rp ${parseInt(formData.get("total").replace(/[^0-9]/g, ''), 10).toLocaleString('id-ID')}`;
const shippingFeeFormatted = formData.get("shipping-fee");

paymentInfo.innerHTML = `
<div class="payment-content">
<h3>Transaksi Berhasil Dibuat</h3>
<p>Kode transaksi: <span id="xCode" style="font-weight:500;">${uniqueCode}</span> <svg class="line" onclick="copyText()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
</svg></p>
<p>Salin kode transaksi lalu simpan ke catatan jika suatu saat diperlukan.</p>
<div class="data-payment">
<table>
<tr><td style="font-weight:500;">Penjual</td><td>${formData.get("Nama Penjual")}</td></tr>
<tr><td style="font-weight:500;">WA Penjual</td><td>${formData.get("Nomor Penjual")}</td></tr>
<tr><td style="font-weight:500;">Pembeli</td><td>${formData.get("Nama Pembeli")}</td></tr>
<tr><td style="font-weight:500;">WA Pembeli</td><td>${formData.get("Nomor Pembeli")}</td></tr>
</table>
</div>
<div class="data-payment">
<table>
<tr><td style="font-weight:500;">Barang</td><td>${formData.get("Nama Barang")}</td></tr>
<tr><td style="font-weight:500;">Satuan</td><td>${formData.get("Harga Satuan")}</td></tr>
<tr><td style="font-weight:500;">Jumlah</td><td>${formData.get("Jumlah Barang")}</td></tr>
<tr><td style="font-weight:500;">Kondisi</td><td>${formData.get("Kondisi Barang")}</td></tr>
</table>
</div>
<div class="data-payment">
<table>
<tr><td style="font-weight:500;">Sub Total</td><td>${subTotalFormatted}</td></tr>
<tr><td style="font-weight:500;">Biaya Admin</td><td>${adminFeeFormatted}</td></tr>
<tr><td style="font-weight:500;">Biaya Ongkir</td><td>${shippingFeeFormatted}</td></tr>
<tr><td style="font-weight:500;">Total</td><td>${totalFormatted}</td></tr>
</table>
</div>
<div class="nav-payment">
<button id="close">Tutup</button>
<a href="https://wa.me/6285640067363?text=Halo%20admin%20IDRekber,%20Saya%20ingin%20menggunakan%20layanan%20rekber%0A%0AKODE%20TRANSAKSI:%20${uniqueCode}" id="confirmation">Konfirmasi</a>
</div>
</div>
`;
paymentInfo.style.display = "block";
}

// Tutup informasi pembayaran
document.addEventListener('click', function (e) {
if (e.target.id === 'close') {
document.querySelector('.info-payment').style.display = 'none';
}
});
