// Products Array
const products = [
  {
    id: 1,
    title: "KUE NASTAR",
    price: 100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBARxNovc7VRQNbgpljdJ6nuqdJ3hrj9kng&s",
  },
  {
    id: 2,
    title: "KUE PUTRI SALJU",
    price: 70,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgR4UikWxdgmYLmNBlMLfGap61RyGjnIieXw&s",
  },
  {
    id: 3,
    title: "KUE KACANG",
    price: 60,
    image: "https://upload.wikimedia.org/wikipedia/id/1/1f/Kue_kacang_tanah.jpg",
  },
  {
    id: 4,
    title: "KUE SEMPRIT",
    price: 55,
    image: "https://image.popmama.com/content-images/post/20230406/1-cef8909573e5cd41e616f7dbda9098d8.jpg?width=1200&height=800",
  },
  {
    id: 5,
    title: "KUE KEJU",
    price: 76,
    image: "https://asset.kompas.com/crops/YFRTpYQZXPTw9UeVi2uDoGX4W8c=/0x258:800x791/750x500/data/photo/2022/04/17/625bae2b74ac6.jpg",
  },
  {
    id: 6,
    title: "RENDANG",
    price: 100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXrIXEH0SpKx7CusjpJC_IFg_oUuGakgEdg&s",
  },
  {
    id: 7,
    title: "KUE LIDAH KUCING",
    price: 100,
    image: "https://down-id.img.susercontent.com/file/4687a565610e83a5614b9d6d85bdb86b",
  },
  {
    id: 8,
    title: "KUE COKLAT",
    price: 80,
    image: "https://asset.kompas.com/crops/1imGaoYk0I_ldovogeJKbeu6neA=/57x0:901x563/750x500/data/photo/2021/02/26/603925798ecd8.jpg",
  },
];



// Menambahkan produk ke dalam list dan element
const productList = document.getElementById('productList');
const cartItemsElement = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts() {
  if (productList) {
    productList.innerHTML = products
      .map(
        (product) =>
          `
      <div class="product">
          <img src="${product.image}" alt="${product.title}" class="product-img">
          <div class="product-info">
              <h2 class="product-title">${product.title}</h2>
              <p class="product-price">Rp.${product.price.toFixed(3)}</p>
              <a class="add-to-cart" data-id="${product.id}" href="#">Add to cart</a>
          </div>
      </div>
      `
      )
      .join("");
    addEventListeners();
  }
}

// Render product ke dalam page cart
function renderCartItems() {
  if (cartItemsElement) {
    cartItemsElement.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item container">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
          <h2 class="cart-item-title">
          ${item.title}
          </h2>
          <input type="number" name="" min="1" value="${item.quantity}" data-id="${item.id}">
      </div>
      <h2 class="cart-item-price">Rp.${(item.price * item.quantity).toFixed(3)}</h2>
      <button class="remove-from-cart" data-id="${item.id}">Remove</button>
      </div>
      `
      )
      .join("");
    updateCartTotal();
    addCartEventListeners();
  }
}

function addToCart(event) {
  const productID = parseInt(event.target.dataset.id);
  const product = products.find((product) => product.id === productID);

  if (product) {
    const existingItem = cart.find((item) => item.id === productID);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      cart.push(cartItem);
    }
    event.target.textContent = "Added";
    renderCartItems();
    saveToLocalStorage();
    updateCartIcon();
  }
}

function removeFromCart(event) {
  const productID = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productID);
  saveToLocalStorage();
  renderCartItems();
  updateCartIcon();
}

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartTotal() {
  if (cartTotalElement) {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotalElement.textContent = `Total: Rp.${total.toFixed(3)}`;
  }
}

function addEventListeners() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(e);
      updateCartIcon();
    });
  });
}

function addCartEventListeners() {
  document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      removeFromCart(e);
      updateCartIcon();
    });
  });

  document.querySelectorAll('.cart-item input[type="number"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const quantity = parseInt(e.target.value);
      updateCartQuantity(id, quantity);
    });
  });
}

function updateCartQuantity(id, quantity) {
  const cartItem = cart.find(item => item.id === id);

  if (cartItem) {
    cartItem.quantity = quantity;
    saveToLocalStorage();
    renderCartItems();
    updateCartIcon();
  }
}

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    console.log(`Updating cart icon with total quantity: ${totalQuantity}`); // Debugging log
    cartIcon.setAttribute('data-quantity', totalQuantity);
    cartIcon.textContent = `Cart (${totalQuantity})`;
  } else {
    console.error('Cart icon element not found'); // Debugging log
  }
}

function updateCartIconOnChange() {
  updateCartIcon();
}

window.addEventListener('storage', updateCartIconOnChange);

// Initialize the page based on the current pathname
if (window.location.pathname.includes("cart.html")) {
  renderCartItems();
} else {
  renderProducts();
  updateCartIcon();
}
