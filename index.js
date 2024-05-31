const cookie = document.querySelector("#cookie");
const autoClick = document.querySelector("#auto-click");
const autoClickTextPrice = document.querySelector("#auto-click .price span");
const upgradeClick = document.querySelector("#upgrade-click");
const upgradeClickTextPrice = document.querySelector("#upgrade-click .price span");

const updateScore = cookies => {
    const title = document.querySelector("title");
    const score = document.querySelector("#score span");
    

    score.innerText = cookies;
    title.innerHTML = cookies + " cookies - Cookie Clicker"

    localStorage.setItem("cookies", cookies);
}

const updatePowerupsStorage = powerup => {
    let powerups = JSON.parse(localStorage.getItem("powerups")) || [];
    powerups.push(powerup);

    localStorage.setItem("powerups", JSON.stringify(powerups));
}

const getStorage = () => {
    const cookies = localStorage.getItem("cookies") || 0;
    const powerups = JSON.parse(localStorage.getItem("powerups")) || [];

    const storage = {
        "cookies": cookies,
        "powerups": powerups
    }

    return storage;
}

const cookieClicked = cookies => {
    const storage = getStorage();

    const score = document.querySelector("#score span");
    const scoreValue = cookies ? cookies : parseInt(score.innerText);

    let newScore;

    if(storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;
        if(multiplier == 1){
            newScore = scoreValue + 2;
        } else {
            newScore = scoreValue + (2 ** multiplier)
        }
    } else {
        newScore = scoreValue + 1;
    }

    updateScore(newScore);
}

const createParticle = (x,y) => {
    const cookieClicks = document.querySelector(".cookie-clicks");

    const particle = document.createElement("img");
    particle.setAttribute("src", "img/cookie.png");
    particle.setAttribute("class", "cookie-particle");
    particle.style.left = x + "px";
    particle.style.top = y + "px";

    cookieClicks.appendChild(particle);


    setTimeout(() => {
        cookieClicks.removeChild(particle);
    }, 3000);
}

cookie.addEventListener("click", (e) => {
    createParticle(e.clientX, e.clientY);
    cookieClicked()
});

const autoClickCookie = () => {
    setInterval(() => {
        const score = document.querySelector("#score span");
        const scoreValue = parseInt(score.innerText);

        newScore = scoreValue + 1;

        updateScore(newScore);
    }, 1000)
}

autoClick.addEventListener("click", () => {
    const price = autoClick.getAttribute("data-price");
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText)

    if (scoreValue >= price) {
        updatePowerupsStorage("auto-click");

        const storage = getStorage();
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        const newScore = scoreValue - price;

        updateScore(newScore)

        if(quantAutoClicks == 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextPrice.innerHTML = 100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextPrice.innerHTML = 100 * (quantAutoClicks + 1);
            document.getElementById('max').textContent = quantAutoClicks + "x";
        }

        document.querySelector(".auto-clicks").classList.remove("disable");

       // document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">'

        autoClickCookie();
    } else {
        autoClick.classList.add("invalid")
        setTimeout(() => {
            autoClick.classList.remove("invalid")
        }, 300);
    }
})

upgradeClick.addEventListener("click", () => {
    const price = upgradeClick.getAttribute("data-price");
    const score = document.querySelector("#score span");
    const scoreValue = parseInt(score.innerText)

    if (scoreValue >= price) {
        updatePowerupsStorage("upgrade-click");

        const storage = getStorage();
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;

        const newScore = scoreValue - price;

        updateScore(newScore)

        if(multiplier == 1) {
            upgradeClick.setAttribute("data-price", 100 * 2);
            upgradeClickTextPrice.innerHTML = 100 * 2;
        } else {
            upgradeClick.setAttribute("data-price", 100 * (2 ** multiplier));
            upgradeClickTextPrice.innerHTML = 100 * (2 ** multiplier);
        }
    } else {
        upgradeClick.classList.add("invalid")
        setTimeout(() => {
            upgradeClick.classList.remove("invalid")
        }, 300);
    }
})

const getSavedData = () => {
    
    const storage = getStorage();

    updateScore(storage.cookies);

    if (storage.powerups.includes("upgrade-click")) {
        const multiplier = storage.powerups.filter(powerup => powerup == "upgrade-click").length;

        if(multiplier == 1) {
            upgradeClick.setAttribute("data-price", 100 * 2);
            upgradeClickTextPrice.innerHTML = 100 * 2;
        } else {
            upgradeClick.setAttribute("data-price", 100 * (2 ** multiplier));
            upgradeClickTextPrice.innerHTML = 100 * (2 ** multiplier);
        }
    }

    if(storage.powerups.includes("auto-click")) {
        const quantAutoClicks = storage.powerups.filter(powerup => powerup == "auto-click").length;

        document.querySelector(".auto-clicks").classList.remove("disable")

        if(quantAutoClicks == 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextPrice.innerHTML = 100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextPrice.innerHTML = 100 * (quantAutoClicks + 1);
        }

        for (i=1;i <= quantAutoClicks; i++) {
            document.getElementById('max').textContent = quantAutoClicks + "x";
            autoClickCookie();
            //document.getElementsByClassName('max').textContent = quantAutoClicks;
            //console.log(document.getElementById('max').textContent);
            //document.querySelector(".auto-clicks").classList.remove("disable");
            //document.querySelector(".auto-clicks .cursors").innerHTML// += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">'

        }
    }
}

document.addEventListener("load", getSavedData());