let tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
function toggleFullscreenPanel() {
    var panel = document.getElementById('fullscreenPanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}
function toggleFullscreenPanel1() {
    var panel1 = document.getElementById('fullscreenPanel1');
    panel1.style.display = panel1.style.display === 'none' ? 'flex' : 'none';
}
function toggleFullscreenPanel2() {
    var panel2 = document.getElementById('fullscreenPanel2');
    panel2.style.display = panel2.style.display === 'none' ? 'flex' : 'none';
}
document.addEventListener('DOMContentLoaded', function () {
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



    document.getElementById('mine-button').addEventListener('click', () => {
        tpcCount += clickValue;
        updateCoins();
        saveCoins();
        createCoinEffect();
    });
    
    document.getElementById('mine-button').addEventListener('touchstart', function(event) {
        // Получить количество касаний
        const touchCount = event.touches.length;

        // Выполнить несколько кликов
        for (let i = 0; i < touchCount; i++) {
        tpcCount += clickValue;
        updateCoins();
        saveCoins();
        createCoinEffect();
        }
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
                    updateTPCPerSecond();
                    localStorage.setItem('clickValue', clickValue);
                } else if (upgrade === 'autoClicker') {
                    startAutoClicker();
                    updateTPCPerSecond();
                }
                upgradePrices[upgrade] *= 2;
                localStorage.setItem('upgradePrices', JSON.stringify(upgradePrices));
                updateUpgradePrices();
            } else {
                const successMessage = document.createElement('div');
                    successMessage.textContent = `Not enough TPC!`;
                    successMessage.classList.add('success-message');
                document.body.appendChild(successMessage);
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 3000);
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
        updateTPCPerSecond();
    }
    function updateTPCPerSecond() {
        const tpcPerSecond = clickValue;
        document.getElementById('tpc-per-second').textContent = `TPC per second: ${formatNumber(tpcPerSecond)}`;
    }
    updateUpgradePrices();
    updateTPCPerSecond();
    // Initial update of upgrade prices
    

    // Check if autoClicker was running
    if (localStorage.getItem('autoClickerRunning') === 'true') {
        startAutoClicker();
        updateTPCPerSecond();
    }

    // Save the time of exit before the page unloads
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('lastExitTime', Date.now());
    });

    // Определяем задания и их требования
    const tasks = [
        { id: 'task1', description: 'Накликай 1000 раз', requirement: 1000 },
        { id: 'task2', description: 'Будь в игре 30 минут', requirement: 30 * 60 },
        { id: 'task3', description: 'Получи автокликер', requirement: 1 }
         // 30 минут в секундах
    ];

    // Функция для проверки выполнения задания
function checkTaskCompletion(taskId, currentProgress) {
    const task = tasks.find(task => task.id === taskId);
    if (task && currentProgress >= task.requirement) {
        // Задание выполнено, показываем временное сообщение "success"
        const successMessage = document.createElement('div');
        successMessage.textContent = `Вы выполнили задание: ${task.description}!`;
        successMessage.classList.add('success-message');
        document.body.appendChild(successMessage);

        // Скрыть сообщение через 3 секунды (3000 миллисекунд)
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 3000);

        // Удаляем задание из списка
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks)); // обновляем localStorage
        }

        // Удаляем прогресс задания из localStorage
        localStorage.removeItem(`${taskId}Progress`);

        // Обновляем интерфейс
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.parentNode.removeChild(taskElement);
        }
    }
}


    // Обновление прогресса задания
    function updateTaskProgress(taskId, currentProgress) {
        const taskProgressElement = document.getElementById(`${taskId}-progress`);
        const taskRequirement = tasks.find(task => task.id === taskId).requirement;
        const progressPercentage = (currentProgress / taskRequirement) * 100;
        taskProgressElement.style.width = `${progressPercentage}%`;
    }

    // Добавляем слушатели для кнопки "Mine" и покупки автокликера
    const mineButton = document.getElementById('mine-button');
    mineButton.addEventListener('click', function () {
        // Обновляем прогресс задания "Накликай 1000 раз"
        const task1Progress = parseInt(localStorage.getItem('task1Progress')) || 0;
        localStorage.setItem('task1Progress', task1Progress + 1);
        updateTaskProgress('task1', task1Progress + 1);

        // Проверяем выполнение задания
        checkTaskCompletion('task1', task1Progress + 1);
    });

    const autoClickerButton = document.querySelector('.buy-button[data-upgrade="autoClicker"]');
    autoClickerButton.addEventListener('click', function () {
        // Обновляем прогресс задания "Получи автокликер"
        const task3Progress = parseInt(localStorage.getItem('task3Progress')) || 0;
        localStorage.setItem('task3Progress', 1);
        updateTaskProgress('task3', 1);

        // Проверяем выполнение задания
        checkTaskCompletion('task3', 1);

        // Запускаем таймер, если он еще не запущен
        if (!inGameTimer) {
            startTimer();
        }
    });


    // Загрузка прогресса заданий из localStorage
    tasks.forEach(task => {
        const taskProgress = parseInt(localStorage.getItem(`${task.id}Progress`)) || 0;
        updateTaskProgress(task.id, taskProgress);
        checkTaskCompletion(task.id, taskProgress);
    });

    // Добавим функцию для проверки, находится ли пользователь в игре
    let timeSpentInGame = 0; // переменная для отслеживания времени, проведенного в игре (в секундах)
    let inGameTimer; // переменная для таймера

    // Функция, которая будет вызываться каждую секунду
    function tick() {
        timeSpentInGame++; // увеличиваем время, проведенное в игре
        updateTaskProgress('task2', timeSpentInGame); // обновляем прогресс задания "Быть в игре 30 минут"

        // Проверяем выполнение задания
        checkTaskCompletion('task2', timeSpentInGame);
        checkTaskCompletion('task3', timeSpentInGame);
    }

    // Запуск таймера при загрузке страницы
    function startTimer() {
        inGameTimer = setInterval(tick, 1000); // вызываем функцию tick каждую секунду
    }

    // Запускаем таймер, когда DOM загружен
    document.addEventListener('DOMContentLoaded', startTimer);

    // Останавливаем таймер при выходе из игры
    window.addEventListener('beforeunload', () => {
        clearInterval(inGameTimer); // очищаем интервал таймера
    });
    const resetAllButton = document.getElementById('reset-all-button');
    resetAllButton.addEventListener('click', () => {
    // Сбрасываем все данные в localStorage
    localStorage.clear();
    tpcCount = 0;
    // Обновляем страницу
    location.reload();
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


           // Проверяем, есть ли сохраненное значение Mega TPC в localStorage
    var megaTPCCount = parseFloat(localStorage.getItem('megaTPCCount')) || 0;

    // Отображаем сохраненное значение Mega TPC
    document.getElementById('mega-tpc-count').innerText = megaTPCCount.toFixed(3) + ' Mega TPC';

    document.getElementById('convert-button').addEventListener('click', function () {
        var tpcAmount = parseFloat(document.getElementById('tpc-amount').value);

        if (isNaN(tpcAmount)) {
            const successMessage = document.createElement('div');
            successMessage.textContent = `Введите числовое значение.`;
            successMessage.classList.add('success-message');
            document.body.appendChild(successMessage);
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);
            return;
        }
        if(tpcAmount <= tpcCount){
            var megaTPCAmount = tpcAmount / 1000;
            tpcCount = tpcCount - tpcAmount;
            megaTPCCount += megaTPCAmount; // Увеличиваем количество Mega TPC

            // Сохраняем значение Mega TPC в localStorage
            localStorage.setItem('megaTPCCount', megaTPCCount);
            updateCoins();
        }else{
            const successMessage = document.createElement('div');
            successMessage.textContent = `не хватает TPC`;
            successMessage.classList.add('success-message');
            document.body.appendChild(successMessage);
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);
        }
        // document.getElementById('result').innerText = megaTPCAmount.toFixed(3) + ' Mega TPC'; // Отображаем сконвертированное количество Mega TPC
        document.getElementById('mega-tpc-count').innerText = megaTPCCount.toFixed(3) + ' Mega TPC'; // Отображаем общее количество Mega TPC
    });
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    // Если устройство не мобильное, перенаправить на другую страницу или показать сообщение
    if (!isMobileDevice()) {
        document.body.innerHTML = '<h1>Доступ разрешен только с мобильных устройств</h1>';
    }
});
        
