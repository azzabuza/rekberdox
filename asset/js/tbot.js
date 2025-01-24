document.getElementById('shoppingForm').addEventListener('submit', function(event) {
event.preventDefault();

// GET DATA FROM
const notifName1 = document.getElementById('name1').value;
const notifWhatsapp1 = document.getElementById('whatsapp1').value;
const notifName2 = document.getElementById('name2').value;
const notifWhatsapp2 = document.getElementById('whatsapp2').value;
const notifProduct = document.getElementById('product').value;
const notifPrice = document.getElementById('price').value;
const notifQuantity = document.getElementById('quantity').value;
const notifCondition = document.getElementById('condition').value;
const notifShipping = document.getElementById('shipping-fee').value;
const notifSubTotal = document.getElementById('sub-total').value;
const notifAdminFee = document.getElementById('admin-fee').value;
const notifTotal = document.getElementById('total').value;
const notifCode = document.getElementById('unique-code').value;

// GET CURRENT DATE AND TIME
const now = new Date();
const formattedDate = now.toLocaleDateString('id-ID', { 
year: 'numeric', 
month: 'long', 
day: 'numeric' 
});
const formattedTime = now.toLocaleTimeString('id-ID', { 
hour: '2-digit', 
minute: '2-digit', 
second: '2-digit' 
});

// MESSAGE FORMAT FOR BOTS
const message = `
<b>MIN ADA ORDERAN REKBER NIH!!!</b>
<b>Kode Transaksi:</b> ${notifCode}\n
<b>Tanggal:</b> ${formattedDate}
<b>Waktu:</b> ${formattedTime}\n
<b>Nama Penjual:</b> ${notifName1}
<b>WA Penjual:</b> ${notifWhatsapp1}
<b>Nama Pembeli:</b> ${notifName2}
<b>WA Pembeli:</b> ${notifWhatsapp2}\n
<b>Produk:</b> ${notifProduct}
<b>Harga:</b> ${notifPrice}
<b>Jumlah:</b> ${notifQuantity}
<b>Kondisi:</b> ${notifCondition}\n
<b>Sub Total:</b> ${notifSubTotal}
<b>Biaya Admin:</b> ${notifAdminFee}
<b>Ongkir:</b> ${notifShipping}
<b>Total:</b> ${notifTotal}
`;

// SEND DATA TO TELEGRAM BOT
const botToken = '7555714605:AAEr1TbWrE8K8oB8ayVobOfhDhcxxwMr768';
const chatId = '6115365841';
const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

// BODY FETCH POST
const body = {
chat_id: chatId,
text: message,
parse_mode: "HTML"
};

// REQUEST BOT SENDER
fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(body)
})
.then(response => {
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
return response.json();
})
.then(data => {
console.log('Message sent to Telegram:', data);
})
.catch(error => {
console.error('Error sending message:', error.message, error);
});
});
