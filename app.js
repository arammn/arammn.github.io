// script.js
let clickCount = 0;

// Функция для загрузки счётчика кликов из localStorage
function loadClickCount() {
    const savedCount = localStorage.getItem('clickCount');
    if (savedCount !== null) {
        clickCount = parseInt(savedCount, 10);
        document.getElementById('click-count').innerText = clickCount;
    }
}

// Функция для сохранения счётчика кликов в localStorage
function saveClickCount() {
    localStorage.setItem('clickCount', clickCount);
}

// Загрузка счётчика при загрузке страницы
window.onload = () => {
    loadClickCount();

    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand(); // Расширяет окно до полного размера

    document.getElementById('clicker-button').addEventListener('click', () => {
        clickCount++;
        document.getElementById('click-count').innerText = clickCount;
        saveClickCount();

        // Воспроизведение звука при клике
        const clickSound = document.getElementById('click-sound');
        clickSound.play();
    });
};
