// Handle Order building and WhatsApp link
const items = [];
const tableBody = document.querySelector('#orderTable tbody');
const subtotalCell = document.getElementById('subtotalCell');
const addBtn = document.getElementById('addItem');
const itemSel = document.getElementById('itemSelect');
const qtyInput = document.getElementById('qtyInput');
const noteInput = document.getElementById('noteInput');
const whatsBtn = document.getElementById('whatsAppBtn');
const clearBtn = document.getElementById('clearBtn');
const fulfilSel = document.getElementById('fulfilment');
const addrWrap = document.getElementById('addressWrap');
const addrInput = document.getElementById('custAddress');
const nameInput = document.getElementById('custName');
const timeInput = document.getElementById('custTime');

// Sticky bar elements
const stickyBar = document.getElementById('stickyBar');
const stickySubtotal = document.getElementById('stickySubtotal');
const stickyWhats = document.getElementById('stickyWhats');

document.getElementById('year').textContent = new Date().getFullYear();

fulfilSel.addEventListener('change', () => {
  if(fulfilSel.value === 'Delivery'){
    addrWrap.classList.remove('hidden');
  } else {
    addrWrap.classList.add('hidden');
    addrInput.value='';
  }
});

addBtn.addEventListener('click', () => {
  const name = itemSel.value;
  const price = parseFloat(itemSel.selectedOptions[0].dataset.price || '0');
  const qty = Math.max(1, parseInt(qtyInput.value||'1',10));
  const note = (noteInput.value||'').trim();
  items.push({name, price, qty, note});
  qtyInput.value = 1; noteInput.value = '';
  renderTable();
});

clearBtn.addEventListener('click', () => {
  items.length = 0;
  renderTable();
});

function renderTable(){
  tableBody.innerHTML = '';
  let subtotal = 0;
  items.forEach((it, idx) => {
    const row = document.createElement('tr');
    const lineTotal = it.price * it.qty;
    subtotal += lineTotal;
    row.innerHTML = `<td>${esc(it.name)}${it.note?`<div class="small muted">${esc(it.note)}</div>`:''}</td>
                     <td>${it.qty}</td>
                     <td>R${it.price.toFixed(2)}</td>
                     <td>R${lineTotal.toFixed(2)}</td>
                     <td><button class="btn subtle" data-index="${idx}">Remove</button></td>`;
    tableBody.appendChild(row);
  });
  subtotalCell.textContent = `R${subtotal.toFixed(2)}`;
  tableBody.querySelectorAll('button[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index,10);
      items.splice(i,1);
      renderTable();
    });
  });
  updateWhatsAppLink();
}

function updateWhatsAppLink(){
  // Update sticky subtotal
  const subtotalVal = items.reduce((s,it)=>s+it.price*it.qty,0);
  if (stickySubtotal) stickySubtotal.textContent = `R${subtotalVal.toFixed(2)}`;

  if(items.length===0 || !nameInput.value.trim()){
    whatsBtn.classList.add('disabled');
    whatsBtn.href = '#';
    if (stickyBar) stickyBar.classList.add('hidden');
    if (stickyWhats) { stickyWhats.classList.add('disabled'); stickyWhats.href = '#'; }
    return;
  }
  whatsBtn.classList.remove('disabled');
  if (stickyBar) stickyBar.classList.remove('hidden');
  const lines = [];
  lines.push(`*New Order — Archie & Son Bakery*`);
  lines.push(`Name: ${nameInput.value.trim()}`);
  lines.push(`Fulfilment: ${fulfilSel.value}`);
  if(fulfilSel.value==='Delivery' && addrInput.value.trim()){
    lines.push(`Address: ${addrInput.value.trim()}`);
  }
  if(timeInput.value){
    lines.push(`Preferred time: ${timeInput.value}`);
  }
  lines.push(``);
  lines.push(`Items:`);
  items.forEach(it=>{
    const nt = it.note ? ` (${it.note})` : '';
    lines.push(`- ${it.qty} x ${it.name}${nt} @ R${it.price.toFixed(2)} = R${(it.price*it.qty).toFixed(2)}`);
  });
  const subtotal = items.reduce((s,it)=>s+it.price*it.qty,0);
  lines.push(``);
  lines.push(`Subtotal: R${subtotal.toFixed(2)}`);
  lines.push(``);
  lines.push(`Please confirm availability and total. Thank you!`);
  const msg = encodeURIComponent(lines.join('\n'));
  whatsBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

['input','change'].forEach(ev=>{
  document.getElementById('orderForm').addEventListener(ev, updateWhatsAppLink);
});

function esc(s){ return (s+'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }


// localStorage: remember customer name
const NAME_KEY = 'archiebakery:custName';
const storedName = localStorage.getItem(NAME_KEY);
if (storedName){ nameInput.value = storedName; }
nameInput.addEventListener('input', ()=>{
  localStorage.setItem(NAME_KEY, nameInput.value.trim());
});
