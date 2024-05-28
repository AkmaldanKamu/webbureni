const payBtn = document.querySelector(".checkout-btn");

payBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    if (cart && cart.length > 0) {
        fetch("/stripe-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: cart
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Invalid URL from the server");
            }
        })
        .catch((err) => console.error("Error:", err));
    } else {
        console.error("Cart is empty or not found in localStorage");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCartItems() {
        cartItemsElement.innerHTML = cart
            .map(
                (item) => `
                <div class="cart-item container">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h2 class="cart-item-title">${item.title}</h2>
                        <input type="number" name="" min="1" value="${item.quantity}" data-id="${item.id}">
                    </div>
                    <h2 class="cart-item-price">Rp.${item.price.toFixed(3)}</h2>
                    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                </div>
            `
            )
            .join('');
        updateCartTotal();
        addCartEventListeners();
    }

    function updateCartTotal() {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        cartTotalElement.textContent = `Total: Rp.${total.toFixed(3)}`;
    }

    function addCartEventListeners() {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productID = parseInt(e.target.dataset.id);
                cart = cart.filter(item => item.id !== productID);
                saveToLocalStorage();
                renderCartItems();
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

    function saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartIcon() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartIcon = document.getElementById('cart-icon');
        cartIcon.setAttribute('data-quantity', totalQuantity);
    }


    renderCartItems();
    updateCartIcon();
});

