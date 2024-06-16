let score = 0;
let clickValue = 1;
let autoClicker = false;
let autoClickerInterval;
let energy = 1000;
let maxEnergy = 1000;
let highestRank = 'Novice';
const ranks = [
    { name: 'Novice', threshold: 0, regen: 1, maxEnergy: 1000 },
    { name: 'Apprentice', threshold: 100, regen: 2, maxEnergy: 1500 },
    { name: 'Journeyman', threshold: 500, regen: 3, maxEnergy: 2000 },
    { name: 'Expert', threshold: 1000, regen: 4, maxEnergy: 2500 },
    { name: 'Master', threshold: 5000, regen: 5, maxEnergy: 3000 },
    { name: 'Grandmaster', threshold: 10000, regen: 6, maxEnergy: 3500 }
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
            if (ranks[i].threshold > ranks.find(r => r.name === highestRank).threshold) {
                highestRank = ranks[i].name;
                maxEnergy = ranks[i].maxEnergy;
                if (energy > maxEnergy) {
                    energy = maxEnergy;
                }
            }
            break;
        }
    }
    document.getElementById('rank').textContent = highestRank;
    document.getElementById('energy').textContent = energy;
    document.getElementById('max-energy').textContent = maxEnergy;
}

document.getElementById('clicker').addEventListener('click', () => {
    if ((energy - 1) > 0) {
        score += clickValue;
        energy -= 1;
        updateScore();
        updateEnergy();
    } else {
        showNotification('Not enough energy!');
    }
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

function updateEnergy() {
    document.getElementById('energy').textContent = energy;
    document.getElementById('max-energy').textContent = maxEnergy;
}

function regenerateEnergy() {
    const rank = ranks.find(r => r.name === highestRank);
    if (rank && energy < maxEnergy) {
        energy += rank.regen;
        if (energy > maxEnergy) energy = maxEnergy; // Cap energy at max energy
        updateEnergy();
    }
}

setInterval(regenerateEnergy, 1000);

function saveGame() {
    const gameState = {
        score: score,
        clickValue: clickValue,
        autoClicker: autoClicker,
        highestRank: highestRank,
        energy: energy,
        maxEnergy: maxEnergy,
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
        energy = gameState.energy || 1000;
        maxEnergy = gameState.maxEnergy || 1000;
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
        updateEnergy();
    }
}

function resetGame() {
    score = 0;
    clickValue = 1;
    autoClicker = false;
    energy = 1000;
    maxEnergy = 1000;
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
    updateEnergy();
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
