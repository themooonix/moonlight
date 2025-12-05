// Открытие модального окна оформления заказа
function openCheckoutModal() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItemsContainer = document.getElementById('orderItems');
        const subtotalElement = document.getElementById('orderSubtotal');
        const discountElement = document.getElementById('orderDiscount');
        const totalPriceElement = document.getElementById('orderTotalPrice');

        // Проверяем наличие необходимых элементов
        if (!orderItemsContainer || !subtotalElement || !discountElement || !totalPriceElement) {
            console.error('Ошибка: Не найдены элементы orderItems, orderSubtotal, orderDiscount или orderTotalPrice');
            showCheckoutNotification('Ошибка при загрузке заказа');
            return;
        }

        // Очищаем контейнер для товаров
        orderItemsContainer.innerHTML = '';

        let subtotal = 0;

        // Заполняем список товаров
        cart.forEach(item => {
            if (!item.title || !item.size || !item.quantity || !item.price) {
                console.warn('Некорректные данные товара:', item);
                return;
            }
            const itemElement = document.createElement('p');
            itemElement.textContent = `${item.title} (Размер: ${item.size}, Кол-во: ${item.quantity}) - ${item.price}`;
            orderItemsContainer.appendChild(itemElement);

            // Извлекаем цену, предполагая формат "1000 ₽"
            const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) * (item.quantity || 1);
            if (!isNaN(price)) {
                subtotal += price;
            } else {
                console.warn(`Некорректная цена для товара: ${item.title}`);
            }
        });

        // Рассчитываем скидку и итоговую сумму
        const discount = subtotal * 0.2; // Скидка 20%, как в корзине
        const totalPrice = subtotal - discount;

        // Отображаем суммы
        subtotalElement.textContent = `${subtotal.toFixed(2)} ₽`;
        discountElement.textContent = `-${discount.toFixed(2)} ₽`;
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} ₽`;

        // Показываем модальное окно
        const modal = document.getElementById('orderCheckoutModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error('Ошибка: Не найден элемент orderCheckoutModal');
            showCheckoutNotification('Ошибка при открытии окна');
        }

        // Инициализация кнопок оплаты
        const paymentButtons = document.querySelectorAll('.payment-btn');
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    } catch (error) {
        console.error('Ошибка в openCheckoutModal:', error);
        showCheckoutNotification('Произошла ошибка при загрузке заказа');
    }
}

// Закрытие модального окна
function closeCheckoutModal() {
    const modal = document.getElementById('orderCheckoutModal');
    const form = document.getElementById('checkoutForm');

    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('Ошибка: Не найден элемент orderCheckoutModal');
    }

    if (form) {
        form.reset();
        // Сбрасываем выбор оплаты на "Кредитная карта"
        const paymentButtons = document.querySelectorAll('.payment-btn');
        paymentButtons.forEach(btn => btn.classList.remove('active'));
        const defaultButton = document.querySelector('.payment-btn[data-payment="card"]');
        if (defaultButton) {
            defaultButton.classList.add('active');
        }
    } else {
        console.error('Ошибка: Не найдена форма checkoutForm');
    }
}

// Обработка отправки формы
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkoutForm');
    if (!form) {
        console.error('Ошибка: Не найдена форма checkoutForm');
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        try {
            const name = document.getElementById('customerName')?.value?.trim();
            const email = document.getElementById('customerEmail')?.value?.trim();
            const phone = document.getElementById('customerPhone')?.value?.trim();
            const address = document.getElementById('deliveryAddress')?.value?.trim();
            const postalCode = document.getElementById('postalCode')?.value?.trim();
            const paymentMethod = document.querySelector('.payment-btn.active')?.dataset.payment;

            // Проверка на заполненность всех полей
            if (!name || !email || !phone || !address || !postalCode || !paymentMethod) {
                showCheckoutNotification('Пожалуйста, заполните все поля и выберите способ оплаты');
                return;
            }

            // Логика отправки данных на сервер (заглушка)
            console.log({
                name,
                email,
                phone,
                address,
                postalCode,
                paymentMethod,
                cart: JSON.parse(localStorage.getItem('cart')) || []
            });

            // Очищаем корзину
            localStorage.removeItem('cart');

            // Показываем уведомление
            showCheckoutNotification('Заказ успешно оформлен!');

            // Закрываем модальное окно
            closeCheckoutModal();

            // Перезагружаем страницу для обновления корзины
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showCheckoutNotification('Ошибка при оформлении заказа');
        }
    });
});

// Уведомление
function showCheckoutNotification(message) {
    try {
        const notification = document.createElement('div');
        notification.className = 'checkout-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        notification.style.display = 'block';

        setTimeout(() => {
            notification.remove();
        }, 3000);
    } catch (error) {
        console.error('Ошибка в showCheckoutNotification:', error);
    }
}

// Закрытие при клике вне модального окна
window.addEventListener('click', (event) => {
    const modal = document.getElementById('orderCheckoutModal');
    if (modal && event.target === modal) {
        closeCheckoutModal();
    }
});