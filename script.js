
// Initialize immediately if DOM is ready; otherwise on DOMContentLoaded
(function(){ 
  function init(){
const orderForm = document.getElementById('orderForm');
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
      const nameInput = document.getElementById('custName');
  
  // Sticky elements
  const stickyBar = document.getElementById('stickyBar');
  const stickySubtotal = document.getElementById('stickySubtotal');
  const stickyWhats = document.getElementById('stickyWhats');

  // Fulfilment toggle
  fulfilSel.addEventListener('change', () => { updateWhatsAppLink(); 
  // Delivery notes character counter
  const dnEl = document.getElementById('deliveryNote');
  const dnCount = document.getElementById('dnCount');
  function updateDnCount(){
    if (!dnEl || !dnCount) return;
    dnCount.textContent = String(dnEl.value.length);
  }
  if (dnEl){
    dnEl.addEventListener('input', updateDnCount);
    updateDnCount();
  }

  // Ensure Add button always triggers addCurrentItem (fallback)
  const _add = document.getElementById('addItem');
  if (_add && !(_add.dataset.bound)){
    _add.addEventListener('click', (e)=>{ e.preventDefault(); addCurrentItem(); 
  // Ensure Add button remains non-submitting
  if (addBtn) addBtn.setAttribute('type','button');

  // Auto-expand delivery notes textarea
  const dnEl = document.getElementById('deliveryNote');
  function autosizeTextarea(el){
    if(!el) return;
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
  }
  if (dnEl){
    autosizeTextarea(dnEl);
    dnEl.addEventListener('input', ()=> autosizeTextarea(dnEl));
  }


  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
