// Функция для получения данных об игроках из localStorage
function getPlayerScores() {
    const players = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cryptoClickerGame')) {
            const gameState = JSON.parse(localStorage.getItem(key));
            players.push({
                name: key,
                score: gameState.score,
                rank: gameState.highestRank
            });
        }
    }
    return players;
}

// Функция для отображения данных об игроках в админ-панели
function displayPlayerScores() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = ''; // Очищаем предыдущий список

    const players = getPlayerScores();
    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.innerHTML = `<span>${player.name}</span> - Счет: ${player.score}, Ранг: ${player.rank}`;
        playersList.appendChild(playerDiv);
    });
}

// Обработчик события для кнопки обновления
document.getElementById('refresh').addEventListener('click', () => {
    displayPlayerScores();
});

// Начальное отображение данных об игроках при загрузке страницы
window.onload = () => {
    displayPlayerScores();
};

