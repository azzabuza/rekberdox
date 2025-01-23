document.getElementById('shoppingForm').addEventListener('submit', function(event) {
event.preventDefault();

// GET DATA FROM
const name1 = document.getElementById('name1').value;
const whatsapp1 = document.getElementById('whatsapp1').value;
const name2 = document.getElementById('name2').value;
const whatsapp2 = document.getElementById('whatsapp2').value;
const product = document.getElementById('product').value;
const price = document.getElementById('price').value;
const quantity = document.getElementById('quantity').value;
const condition = document.getElementById('condition').value;
const shipping = document.getElementById('shipping-fee').value;
const subTotal = document.getElementById('sub-total').value;
const adminFee = document.getElementById('admin-fee').value;
const total = document.getElementById('total').value;
const trx = document.getElementById('unique-code').value;

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
<b>Kode Transaksi:</b> ${trx}\n
<b>Tanggal:</b> ${formattedDate}
<b>Waktu:</b> ${formattedTime}\n
<b>Nama Penjual:</b> ${name1}
<b>WA Penjual:</b> ${whatsapp1}
<b>Nama Pembeli:</b> ${name2}
<b>WA Pembeli:</b> ${whatsapp2}\n
<b>Produk:</b> ${product}
<b>Harga:</b> ${price}
<b>Jumlah:</b> ${quantity}
<b>Kondisi:</b> ${condition}\n
<b>Sub Total:</b> ${subTotal}
<b>Biaya Admin:</b> ${adminFee}
<b>Ongkir:</b> ${shipping}
<b>Total:</b> ${total}
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
