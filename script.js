const cartBtn=document.getElementById('cartBtn');
const cartPanel=document.getElementById('cartPanel');
const closeCart=document.getElementById('closeCart');
const overlay=document.getElementById('overlay');
const cartItems=document.getElementById('cartItems');
const cartCount=document.getElementById('cartCount');
const cartTotal=document.getElementById('cartTotal');
const checkout=document.getElementById('checkout');
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const toTop=document.getElementById('toTop');

const checkoutModal=document.getElementById('checkoutModal');
const closeCheckout=document.getElementById('closeCheckout');
const checkoutForm=document.getElementById('checkoutForm');
const checkoutSummary=document.getElementById('checkoutSummary');
const checkoutTotal=document.getElementById('checkoutTotal');
const successModal=document.getElementById('successModal');
const successMessage=document.getElementById('successMessage');
const successClose=document.getElementById('successClose');

let cart=JSON.parse(localStorage.getItem('sobellaCart')||'[]');

function money(value){
  return `RM ${Number(value).toFixed(2)}`;
}

function saveCart(){
  localStorage.setItem('sobellaCart',JSON.stringify(cart));
  renderCart();
}

function addToCart(name,price){
  const existing=cart.find(item=>item.name===name);

  if(existing){
    existing.qty += 1;
  }else{
    cart.push({
      name:name,
      price:Number(price),
      qty:1
    });
  }

  saveCart();
  openCart();
}

function renderCart(){
  if(!cart.length){
    cartItems.innerHTML=`
      <div class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <p>Your cart is empty.</p>
        <small>Add your favourite SOBELLA products.</small>
      </div>`;
    cartCount.textContent='0';
    cartTotal.textContent='RM 0.00';
    return;
  }

  let total=0;
  let count=0;
  cartItems.innerHTML='';

  cart.forEach((item,index)=>{
    total += item.price * item.qty;
    count += item.qty;

    const row=document.createElement('div');
    row.className='cart-item';

    row.innerHTML=`
      <div class="mini">💄</div>
      <div>
        <h4>${item.name}</h4>
        <p>${money(item.price)} × ${item.qty}</p>
        <div class="qty-controls">
          <button class="qty-btn decrease" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn increase" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove" data-index="${index}">Remove</button>
    `;

    cartItems.appendChild(row);
  });

  cartCount.textContent=count;
  cartTotal.textContent=money(total);

  document.querySelectorAll('.remove').forEach(button=>{
    button.addEventListener('click',()=>{
      cart.splice(Number(button.dataset.index),1);
      saveCart();
    });
  });

  document.querySelectorAll('.increase').forEach(button=>{
    button.addEventListener('click',()=>{
      cart[Number(button.dataset.index)].qty++;
      saveCart();
    });
  });

  document.querySelectorAll('.decrease').forEach(button=>{
    button.addEventListener('click',()=>{
      const index=Number(button.dataset.index);
      cart[index].qty--;

      if(cart[index].qty<=0){
        cart.splice(index,1);
      }

      saveCart();
    });
  });
}

function openCart(){
  cartPanel.classList.add('open');
  overlay.classList.add('show');
  document.body.classList.add('no-scroll');
}

function closeCartPanel(){
  cartPanel.classList.remove('open');
  overlay.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

function openCheckout(){
  if(!cart.length){
    alert('Your cart is empty. Please add a product first.');
    return;
  }

  closeCartPanel();
  renderCheckoutSummary();

  checkoutModal.classList.add('show');
  checkoutModal.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}

function closeCheckoutModal(){
  checkoutModal.classList.remove('show');
  checkoutModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

function renderCheckoutSummary(){
  let total=0;
  checkoutSummary.innerHTML='';

  cart.forEach(item=>{
    total += item.price * item.qty;

    const row=document.createElement('div');
    row.className='summary-item';
    row.innerHTML=`
      <span>${item.name} × ${item.qty}</span>
      <strong>${money(item.price*item.qty)}</strong>
    `;

    checkoutSummary.appendChild(row);
  });

  checkoutTotal.textContent=money(total);
}

function openSuccess(orderNumber,name,total){
  successMessage.innerHTML=
    `Order <strong>${orderNumber}</strong> has been created for <strong>${name}</strong>.<br>
     Order total: <strong>${money(total)}</strong>.<br>
     This is a front-end demo confirmation.`;

  successModal.classList.add('show');
  successModal.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}

function closeSuccess(){
  successModal.classList.remove('show');
  successModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

/* Add to cart */
document.querySelectorAll('.add-cart').forEach(button=>{
  button.addEventListener('click',()=>{
    addToCart(button.dataset.name,button.dataset.price);
  });
});

/* Cart */
cartBtn.addEventListener('click',openCart);
closeCart.addEventListener('click',closeCartPanel);
overlay.addEventListener('click',closeCartPanel);
checkout.addEventListener('click',openCheckout);

/* Checkout modal */
closeCheckout.addEventListener('click',closeCheckoutModal);

checkoutModal.addEventListener('click',event=>{
  if(event.target===checkoutModal){
    closeCheckoutModal();
  }
});

/* Submit checkout form */
checkoutForm.addEventListener('submit',event=>{
  event.preventDefault();

  if(!cart.length){
    closeCheckoutModal();
    alert('Your cart is empty.');
    return;
  }

  const name=document.getElementById('customerName').value.trim();
  const total=cart.reduce((sum,item)=>sum+(item.price*item.qty),0);
  const orderNumber='SB'+Date.now().toString().slice(-8);

  openSuccess(orderNumber,name,total);

  cart=[];
  saveCart();
  checkoutForm.reset();
  closeCheckoutModal();
});

/* Success modal */
successClose.addEventListener('click',closeSuccess);

successModal.addEventListener('click',event=>{
  if(event.target===successModal){
    closeSuccess();
  }
});

/* Mobile navigation */
menuToggle.addEventListener('click',()=>{
  nav.classList.toggle('mobile');
});

document.querySelectorAll('.nav a').forEach(link=>{
  link.addEventListener('click',()=>{
    nav.classList.remove('mobile');
  });
});

/* Product category filter */
const categoryButtons=document.querySelectorAll('.category-btn');
const products=document.querySelectorAll('.product');

categoryButtons.forEach(button=>{
  button.addEventListener('click',()=>{
    categoryButtons.forEach(btn=>btn.classList.remove('active'));
    button.classList.add('active');

    const filter=button.dataset.filter;

    products.forEach(product=>{
      if(filter==='all' || product.dataset.category===filter){
        product.classList.remove('hide');
      }else{
        product.classList.add('hide');
      }
    });
  });
});

/* Scroll-to-top + active navigation */
window.addEventListener('scroll',()=>{
  toTop.classList.toggle('show',window.scrollY>500);

  document.querySelectorAll('main section[id]').forEach(section=>{
    const rect=section.getBoundingClientRect();
    const link=document.querySelector(`.nav a[href="#${section.id}"]`);

    if(link && rect.top<140 && rect.bottom>140){
      document.querySelectorAll('.nav a').forEach(item=>item.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

toTop.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
});

renderCart();
