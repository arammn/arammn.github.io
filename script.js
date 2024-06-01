let tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
    
    function toggleFullscreenPanel() {
        var panel = document.getElementById('fullscreenPanel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const lastExitTime = localStorage.getItem('lastExitTime');
    // Calculate the elapsed time since last exit in hours
    const elapsedTimeHours = (Date.now() - parseInt(lastExitTime)) / (1000 * 60 * 60);
        let tpcCount = 0;
        let clickValue = 1;
        let autoClickerInterval = null;
        let upgradePrices = {
            clickValue: 10,
            autoClicker: 100
        };
        // Load saved coins, click value, and upgrade prices from localStorage
        if (localStorage.getItem('tpcCount')) {
            tpcCount = parseInt(localStorage.getItem('tpcCount'));
            updateCoins();
        }

        if (localStorage.getItem('clickValue')) {
            clickValue = parseInt(localStorage.getItem('clickValue'));
        }

        if (localStorage.getItem('upgradePrices')) {
            upgradePrices = JSON.parse(localStorage.getItem('upgradePrices'));
        }

        const shopButton = document.getElementById('shop-button');
        const shop = document.getElementById('shop');
        const resetClicksButton = document.getElementById('reset-clicks-button');

        shopButton.addEventListener('click', function () {
            toggleShop();
        });

        resetClicksButton.addEventListener('click', function () {
            tpcCount = 0;
            updateCoins();
            saveCoins();
        });

        function toggleShop() {
            shop.classList.toggle('hidden');

        }

        document.getElementById('mine-button').addEventListener('click', () => {
            tpcCount += clickValue;
            updateCoins();
            saveCoins();
            createCoinEffect();
        });

        function createCoinEffect() {
            const coinEffect = document.createElement('div');
            coinEffect.className = 'coin-effect';
            const miningArea = document.getElementById('mining-area');
            miningArea.appendChild(coinEffect);

            const effectSize = 30;
            const areaWidth = miningArea.clientWidth - effectSize;
            const areaHeight = miningArea.clientHeight - effectSize;
            coinEffect.style.left = `${Math.random() * areaWidth}px`;
            coinEffect.style.top = `${Math.random() * areaHeight}px`;

            setTimeout(() => {
                miningArea.removeChild(coinEffect);
            }, 1000);
        }

        function updateCoins() {
            document.getElementById('TPC').textContent = formatNumber(tpcCount);
        }

        function saveCoins() {
            localStorage.setItem('tpcCount', tpcCount);
        }

// Определить максимальное время простоя (5 часов в миллисекундах)
const maxIdleTime = 5 * 60 * 60 * 1000; // 5 часов

let elapsedTimeSinceLastExit = 0;

// Проверяем, покидал ли пользователь сайт ранее
if (lastExitTime) {
    const currentTime = Date.now();
    elapsedTimeSinceLastExit = currentTime - parseInt(lastExitTime);
    // Ограничиваем прошедшее время максимальным временем простоя
    elapsedTimeSinceLastExit = Math.min(elapsedTimeSinceLastExit, maxIdleTime);

    // Рассчитываем количество кликов в течение прошедшего времени
    const clicksDuringIdle = Math.floor(elapsedTimeSinceLastExit / 1000) * clickValue;
    tpcCount += clicksDuringIdle;
    updateCoins();
}

// Запускаем автокликер, если он был активен ранее
if (localStorage.getItem('autoClickerRunning') === 'true') {
    startAutoClicker();
}

// Обновляем время последнего выхода при закрытии страницы пользователем
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastExitTime', Date.now());
});

// Перезапускаем автокликер при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    startAutoClicker();
});

// Функция для запуска автокликера
function startAutoClicker() {
    if (!autoClickerInterval) {
        autoClickerInterval = setInterval(() => {
            tpcCount += clickValue;
            updateCoins();
            saveCoins();
            createCoinEffect();
        }, 1000);
        localStorage.setItem('autoClickerRunning', 'true');
    }
}

// Добавляем обработчик события для кнопки "Сбросить все"
const resetAllButton = document.getElementById('reset-all-button');
resetAllButton.addEventListener('click', () => {
    // Сбрасываем все данные в localStorage
    localStorage.clear();
    // Обновляем страницу
    location.reload();
});


        function formatNumber(number) {
            if (number >= 1000000000) {
                return (number / 1000000000).toFixed(1) + 'B';
            } else if (number >= 1000000) {
                return (number / 1000000).toFixed(1) + 'M';
            } else {
                return number.toString();
            }
        }

        function updateUpgradePrices() {
            document.querySelectorAll('.item-cost').forEach((element, index) => {
                element.textContent = `Cost: ${upgradePrices[Object.keys(upgradePrices)[index]]} TPC`;
            });
        }

        const buyButtons = document.querySelectorAll('.buy-button');
        buyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const upgrade = this.getAttribute('data-upgrade');
                const cost = upgradePrices[upgrade];
                if (tpcCount >= cost) {
                    tpcCount -= cost;
                    updateCoins();
                    if (upgrade === 'clickValue') {
                        clickValue += 1;
                        localStorage.setItem('clickValue', clickValue);
                    } else if (upgrade === 'autoClicker') {
                        startAutoClicker();
                    }
                    upgradePrices[upgrade] *= 2;
                    localStorage.setItem('upgradePrices', JSON.stringify(upgradePrices));
                    updateUpgradePrices();
                } else {
                    const successMessage = document.createElement('div');
                    successMessage.textContent = `Not enough TPC!`;
                    successMessage.classList.add('success-message');
                    document.body.appendChild(successMessage);
                }
            });
        });

        function startAutoClicker() {
            if (!autoClickerInterval) {
                autoClickerInterval = setInterval(() => {
                    tpcCount += clickValue;
                    updateCoins();
                    saveCoins();
                    createCoinEffect();
                }, 1000);
                localStorage.setItem('autoClickerRunning', 'true');
            }
        }

        // Calculate earnings while the user was aw

        // Initial update of upgrade prices
        updateUpgradePrices();

        // Check if autoClicker was running
        if (localStorage.getItem('autoClickerRunning') === 'true') {
            startAutoClicker();
        }

        // Останавливаем таймер при выходе из игры
        window.addEventListener('beforeunload', () => {
            clearInterval(inGameTimer); // очищаем интервал таймера
        });

        // При обновлении страницы, сохраняем время, проведенное в игре
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('timeSpentInGame', timeSpentInGame);
        });

        // При загрузке страницы, восстанавливаем время, проведенное в игре
        window.addEventListener('DOMContentLoaded', () => {
            timeSpentInGame = parseInt(localStorage.getItem('timeSpentInGame')) || 0;
            startTimer(); // запускаем таймер
        });

        // Добавляем слушатели для кнопки "Mine" и покупки автокликера
        mineButton.addEventListener('click', function () {
            // Обновляем прогресс задания "Накликай 1000 раз"
            const task1Progress = parseInt(localStorage.getItem('task1Progress')) || 0;
            localStorage.setItem('task1Progress', task1Progress + 1);
            updateTaskProgress('task1', task1Progress + 1);

            // Проверяем выполнение задания
            checkTaskCompletion('task1', task1Progress + 1);
        });

        autoClickerButton.addEventListener('click', function () {
            // Обновляем прогресс задания "Получи автокликер"
            const task3Progress = parseInt(localStorage.getItem('task3Progress')) || 0;
            localStorage.setItem('task3Progress', 1);
            updateTaskProgress('task3', 1);

            // Проверяем выполнение задания
            checkTaskCompletion('task3', 1);
        });

        // Define the maximum idle time (5 hours in milliseconds)
// Определение максимального времени бездействия (5 часов в миллисекундах)
        

                
    });
