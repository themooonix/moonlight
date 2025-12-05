// Функция для кнопки "Наверх"
window.addEventListener('scroll', function() {
    const body = document.body;
    if (window.scrollY > 100) { // Показываем кнопку, если прокрутка больше 100px
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutButton');

    let subtotal = 0;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <img src="images/others/okak.png" alt="Пустая корзина">
                <p>Ваша корзина пуста.</p>
            </div>
        `;
        checkoutButton.disabled = true;
    } else {
        cartItems.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            subtotal += itemPrice * (item.quantity || 1);

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.title}">
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p>Цена: ${item.price}</p>
                    <p>Размер: ${item.size}</p>
                </div>
                <div class="quantity-control">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <input type="text" value="${item.quantity || 1}" readonly>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });

        checkoutButton.addEventListener('click', function () {
            openCheckoutModal(); // Вызов модального окна оформления заказа
        });
    }

    const discount = subtotal * 0.2; // Скидка 20%
    const totalPrice = subtotal - discount;

    subtotalElement.textContent = `${subtotal.toFixed(2)} ₽`;
    discountElement.textContent = `-${discount.toFixed(2)} ₽`;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} ₽`;
});

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = (cart[index].quantity || 1) + delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // Удаляем товар, если количество <= 0
        } else if (cart[index].quantity > 20) {
            cart[index].quantity = 20; // Ограничение на максимум 20
            showCheckoutNotification('Максимальное количество товара - 20 шт.');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload(); // Перезагружаем страницу для обновления корзины
    }
}