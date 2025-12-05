// Функция для кнопки "Наверх"
window.addEventListener('scroll', function () {
    const body = document.body;
    if (window.scrollY > 100) { // Показываем кнопку, если прокрутка больше 100px
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

// Функция для открытия модального окна
function openModal(title, price, description, imageSrc) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('productModal').style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Функция для выбора размера
function selectSize(button) {
    const buttons = document.querySelectorAll('.size-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Функция для добавления товара в корзину
function addToCart() {
    const selectedSize = document.querySelector('.size-buttons button.active');
    if (selectedSize) {
        const title = document.getElementById('modalTitle').textContent;
        const price = document.getElementById('modalPrice').textContent;
        const size = selectedSize.textContent;
        const imageSrc = document.getElementById('modalImage').src; // Получаем путь к изображению из модального окна

        // Получаем текущие товары из корзины или создаем новую
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Проверяем, есть ли уже такой товар в корзине
        const existingItemIndex = cart.findIndex(item => item.title === title && item.size === size);

        if (existingItemIndex !== -1) {
            // Если товар уже есть, увеличиваем его количество, но не более 20
            if (cart[existingItemIndex].quantity < 20) {
                cart[existingItemIndex].quantity += 1;
            } else {
                showNotification("Максимальное количество данного товара в корзине - 20 шт.");
                closeModal();
                return;
            }
        } else {
            // Если товара нет, добавляем его
            cart.push({ title, price, size, imageSrc, quantity: 1 });
        }

        // Сохраняем обновленную корзину обратно в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        showNotification("Товар успешно добавлен в корзину");
        updateCartCount(); // Обновляем количество товаров в корзине
        closeModal();
    } else {
        alert('Пожалуйста, выберите размер.');
    }
}

// Функция для отображения уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Закрытие модального окна при клике вне его области
window.onclick = function (event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Функция для обновления количества товаров в корзине
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');

    if (cartCountElement) {
        if (cartCount > 0) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', updateCartCount);

// Фильтр товаров в каталоге
document.addEventListener("DOMContentLoaded", function () {
    // Определяем категории товаров
    const categories = {
        "Золото": ["z_ring1", "z_ring2", "z_ring3", "z_bracelet1", "z_bracelet2", "z_earrings", "z_pendant", "z_brooch"],
        "Платина": ["p_ring1", "p_ring2", "p_ring3", "p_bracelet1", "p_bracelet2", "p_earrings", "p_pendant", "p_brooch"],
        "Серебро": ["s_ring1", "s_ring2", "s_ring3", "s_bracelet1", "s_bracelet2", "s_earrings", "s_pendant", "s_brooch"],
        "Бижутерия": ["b_ring1", "b_ring2", "b_ring3", "b_bracelet1", "b_bracelet2", "b_earrings", "b_pendant", "b_brooch"]
    };

    // Получаем все ссылки и добавляем обработчик событий
    document.querySelectorAll(".tiles-choose-nav a").forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Убираем активность у всех ссылок
            document.querySelectorAll(".tiles-choose-nav a").forEach((item) => {
                item.removeAttribute("data-active");
            });

            // Добавляем активность текущей ссылке
            this.setAttribute("data-active", "true");

            // Получаем выбранную категорию
            const selectedCategory = this.textContent;

            // Обновляем отображаемые товары
            updateDisplayedProducts(selectedCategory);
        });
    });

    // Функция для обновления отображаемых товаров
    function updateDisplayedProducts(category) {
        // Скрываем все товары
        document.querySelectorAll(".tiles-products-item").forEach((item) => {
            item.style.display = "none";
        });

        // Показываем товары выбранной категории
        categories[category].forEach((id) => {
            const items = document.querySelectorAll(`#${id}`);
            items.forEach((item) => {
                item.style.display = "block";
            });
        });
    }

    // Получаем активную категорию при загрузке страницы
    const activeCategoryLink = document.querySelector(".tiles-choose-nav a[data-active='true']");
    if (activeCategoryLink) {
        const activeCategory = activeCategoryLink.textContent;
        updateDisplayedProducts(activeCategory);
    } else {
        // Если активная категория не установлена, показываем товары первой категории по умолчанию
        const firstCategory = Object.keys(categories)[0];
        updateDisplayedProducts(firstCategory);
    }
});