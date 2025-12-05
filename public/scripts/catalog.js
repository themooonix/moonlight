// Функция для кнопки "Наверх"
window.addEventListener('scroll', function() {
    const body = document.body;
    if (window.scrollY > 100) { // Показываем кнопку, если прокрутка больше 100px
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Определяем категории товаров
    const categories = {
        "Золото": ["z_ring1", "z_ring2", "z_ring3", "z_bracelet1", "z_bracelet2", "z_earrings", "z_pendant", "z_brooch"],
        "Платина": ["p_ring1", "p_ring2", "p_ring3", "p_bracelet1", "p_bracelet2", "p_earrings", "p_pendant", "p_brooch"],
        "Серебро": ["s_ring1", "s_ring2", "s_ring3", "s_bracelet1", "s_bracelet2", "s_earrings", "s_pendant", "s_brooch"],
        "Бижутерия": ["b_ring1", "b_ring2", "b_ring3", "b_bracelet1", "b_bracelet2", "b_earrings", "b_pendant", "b_brooch"]
    };

    // Получаем все ссылки и добавляем обработчик событий
    document.querySelectorAll(".catalog-choose-nav a").forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Убираем класс активности у всех ссылок
            document.querySelectorAll(".catalog-choose-nav a").forEach((item) => {
                item.classList.remove("catalog-choose-nav-active");
                item.removeAttribute("data-active");
            });

            // Добавляем класс активности текущей ссылке
            this.classList.add("catalog-choose-nav-active");
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
        document.querySelectorAll(".catalog-products-item").forEach((item) => {
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
    const activeCategoryLink = document.querySelector(".catalog-choose-nav a[data-active='true']");
    if (activeCategoryLink) {
        const activeCategory = activeCategoryLink.textContent;
        updateDisplayedProducts(activeCategory);
    } else {
        // Если активная категория не установлена, показываем товары первой категории по умолчанию
        const firstCategory = Object.keys(categories)[0];
        updateDisplayedProducts(firstCategory);
    }
});
