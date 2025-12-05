// Функция для кнопки "Наверх"
window.addEventListener('scroll', function() {
    const body = document.body;
    if (window.scrollY > 100) { // Показываем кнопку, если прокрутка больше 100px
        body.classList.add('scrolled');
    } else {
        body.classList.remove('scrolled');
    }
});

// Дождитесь загрузки API и готовности DOM.
document.addEventListener('DOMContentLoaded', function () {
    ymaps.ready(init);
});

function init() {
    // Координаты метки
    var coordinates = [55.913515, 37.813165];

    // Создание карты.
    var myMap = new ymaps.Map("map", {
        center: coordinates,
        zoom: 15
    });

    // Создание метки.
    var myPlacemark = new ymaps.Placemark(coordinates, {
        hintContent: 'MOONLIGHT',
        balloonContent: "Магазин MOONLIGHT <br> Пионерская ул., 8, Королёв"
    });

    // Добавление метки на карту.
    myMap.geoObjects.add(myPlacemark);
}
