// Products Array
const products = [
  {
    id: 1,
    title: "Autumn Hoodie",
    price: 100,
    image: "https://pangaia.com/cdn/shop/products/Recycled-Nylon-NW-Flwrdwn-Quilted-Collarless-Jacket-Cerulean-Blue-Female-1_bf4b2a54-8a7f-4174-bc49-8ef22b24bfdd.jpg?v=1666708230&width=1426",
  },
  {
    id: 2,
    title: "FUSION HOODIE",
    price: 70,
    image: "https://images.undiz.com/on/demandware.static/-/Sites-ZLIN-master/default/dw2264d914/merch/BTS/654206666_x.jpg?sw=1250",
  },
  {
    id: 3,
    title: "Chestnut Brown",
    price: 60,
    image: "https://pangaia.com/cdn/shop/products/Recycled-Cashmere-Core-Hoodie-Chestnut-Brown-Male-1.jpg?v=1663947464&width=1426",
  },
  {
    id: 4,
    title: "Nike Sportswear",
    price: 55,
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61734ec7-dad8-40f3-9b95-c7500939150a/sportswear-club-mens-french-terry-crew-neck-sweatshirt-tdFDRc.png",
  },
  {
    id: 5,
    title: "Champion BASIC",
    price: 76,
    image: "https://img01.ztat.net/article/spp-media-p1/7067458719b744fe81ffee62d3d0b912/abad421e7d8e47f08a2abc1c6ffe07dc.jpg?imwidth=1800",
  },
  {
    id: 6,
    title: "Cotton Hoodie",
    price: 100,
    image: "https://pangaia.com/cdn/shop/files/Reclaim-3.0-Hoodie-Reclaim-Jade-Womens-3.jpg?v=1693398673&width=1426",
  },
  {
    id: 7,
    title: "CLASSIC CREWNECK",
    price: 100,
    image: "https://img01.ztat.net/article/spp-media-p1/10cea44041564f81ac585fc6c8978907/c4c32dbc45dd4dbc9d15087c846538f2.jpg?imwidth=1800",
  },
  {
    id: 8,
    title: "TAPE HOODED",
    price: 80,
    image: "https://img01.ztat.net/article/spp-media-p1/d391f90be278469ebfdff731800cfccc/6d2101bd672f4e059501f01fe726f315.jpg?imwidth=1800",
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
