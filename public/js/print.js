document.addEventListener('DOMContentLoaded', () => {
    const printBtn = document.getElementById('print-btn');

    printBtn.addEventListener('click', () => {
        printReceipt();
    });

    function printReceipt() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartItems = cartItemsContainer.innerHTML;
        const cartTotal = document.getElementById('cartTotal').innerText;

        
        const removeBtns = document.querySelectorAll('.remove-from-cart');
        const originalStyles = [];
        removeBtns.forEach(btn => {
            originalStyles.push(btn.style.display);
            btn.style.display = 'none'; 
        });

        const receiptContent = `
            <style>
                .cart-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .cart-item img {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }
                .cart-item-info {
                    flex: 1;
                }
                .cart-item-title {
                    margin: 0;
                }
                .cart-item-price {
                    margin: 0;
                }
                .cart-total {
                    margin-top: 20px;
                    font-weight: bold;
                    float:right;
                    font-size:50px;
                }
                .remove-from-cart {
                    display: none;
                }
            </style>
            <h2>Hasil Print Belanjaan</h2>
            <div id="cartItems">
                ${cartItems}
            </div>
            <div class="cart-total">${cartTotal}</div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Toko Akmal</title></head><body>');
        printWindow.document.write(receiptContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();

        // Mengembalikan gaya asli tombol remove setelah mencetak
        removeBtns.forEach((btn, index) => {
            btn.style.display = originalStyles[index];
        });
    }
});
