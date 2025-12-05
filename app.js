const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");

// Статичная папка
app.use(express.static("public"));

// Cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Преобразование данных из буфера в читаемый вид
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const counterFilePath = path.join(__dirname, 'counter.json');

// Функция для чтения счетчика из файла
function readCounter() {
    try {
        if (!fs.existsSync(counterFilePath)) {
            writeCounter(0);
            return 0;
        }
        const data = fs.readFileSync(counterFilePath, 'utf8');
        return JSON.parse(data).count;
    } catch (error) {
        console.error("Ошибка при чтении файла счетчика:", error);
        return 0;
    }
}

// Функция для записи счетчика в файл
function writeCounter(count) {
    fs.writeFileSync(counterFilePath, JSON.stringify({ count }, null, 2), 'utf8');
}

// Рендер главной страницы
app.get(["/", "/index"], (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("index", { activePage: "index", visitorCount: count });
});

// Рендер каталога
app.get("/catalog", (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("catalog", { visitorCount: count });
});

// Рендер доставки
app.get("/delivery", (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("delivery", { visitorCount: count });
});

// Рендер магазинов
app.get("/shops", (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("shops", { visitorCount: count });
});

// Рендер ломбарда
app.get("/pawnshop", (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("pawnshop", { visitorCount: count });
});

// Рендер корзины
app.get("/cart", (req, res) => {
    let count = readCounter();
    count += 1;
    writeCounter(count);
    res.render("cart", { visitorCount: count });
});

app.listen(PORT, () => {
	console.log("см. тут: http://localhost:" + PORT);
});
