let score = 0;
let clickValue = 1;
let autoClicker = false;
let autoClickerInterval;
let highestRank = 'Novice';
const ranks = [
    { name: 'Novice', threshold: 0 },
    { name: 'Apprentice', threshold: 100 },
    { name: 'Journeyman', threshold: 500 },
    { name: 'Expert', threshold: 1000 },
    { name: 'Master', threshold: 5000 },
    { name: 'Grandmaster', threshold: 10000 }
];

const upgrades = [
    { cost: 10, value: 1, type: 'click', bought: 0, multiplier: 1.5 },
    { cost: 50, type: 'autoClicker', bought: 0, multiplier: 1.5 }
];

function updateScore() {
    document.getElementById('score').textContent = score;
    updateRank();
    saveGame();
}

function updateRank() {
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (score >= ranks[i].threshold) {
            highestRank = ranks[i].name;
            break;
        }
    }
    document.getElementById('rank').textContent = highestRank;
}

document.getElementById('clicker').addEventListener('click', () => {
    score += clickValue;
    updateScore();
});

document.querySelectorAll('.buy').forEach((button, index) => {
    button.addEventListener('click', () => {
        const upgrade = upgrades[index];
        if (score >= upgrade.cost) {
            score -= upgrade.cost;
            if (upgrade.type === 'click') {
                clickValue += upgrade.value;
            } else if (upgrade.type === 'autoClicker') {
                if (!autoClicker) {
                    autoClicker = true;
                    autoClickerInterval = setInterval(() => {
                        score += clickValue;
                        updateScore();
                    }, 1000);
                }
            }
            upgrade.bought += 1;
            upgrade.cost = Math.floor(upgrade.cost * upgrade.multiplier);
            document.querySelector(`#upgrade${index + 1} .cost`).textContent = `(Cost: ${upgrade.cost})`;
            updateScore();
        } else {
            showNotification('Not enough clicks!');
        }
    });
});

document.getElementById('open-shop').addEventListener('click', () => {
    document.getElementById('shop-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('shop-modal').style.display = 'none';
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function saveGame() {
    const gameState = {
        score: score,
        clickValue: clickValue,
        autoClicker: autoClicker,
        highestRank: highestRank,
        upgrades: upgrades
    };
    localStorage.setItem('cryptoClickerGame', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('cryptoClickerGame');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        score = gameState.score;
        clickValue = gameState.clickValue;
        autoClicker = gameState.autoClicker;
        highestRank = gameState.highestRank || 'Novice';
        Object.assign(upgrades, gameState.upgrades);

        upgrades.forEach((upgrade, index) => {
            document.querySelector(`#upgrade${index + 1} .cost`).textContent = `(Cost: ${upgrade.cost})`;
        });

        if (autoClicker) {
            autoClickerInterval = setInterval(() => {
                score += clickValue;
                updateScore();
            }, 1000);
        }

        updateScore();
    }
}

function resetGame() {
    score = 0;
    clickValue = 1;
    autoClicker = false;
    highestRank = 'Novice';
    clearInterval(autoClickerInterval);
    autoClickerInterval = null;

    upgrades.forEach((upgrade, index) => {
        upgrade.cost = index === 0 ? 10 : 50; // Reset initial costs
        upgrade.bought = 0;
        document.querySelector(`#upgrade${index + 1} .cost`).textContent = `(Cost: ${upgrade.cost})`;
        document.querySelector(`.buy[data-upgrade="${index + 1}"]`).disabled = false;
    });

    updateScore();
    localStorage.removeItem('cryptoClickerGame');
}

document.getElementById('reset').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all progress?')) {
        resetGame();
    }
});

window.onload = () => {
    loadGame();
};

window.onbeforeunload = () => {
    saveGame();
};
