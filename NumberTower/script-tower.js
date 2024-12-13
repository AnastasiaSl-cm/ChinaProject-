document.addEventListener("DOMContentLoaded", () => {
    const blocksContainer = document.getElementById("blocks");
    const towerContainer = document.getElementById("tower");
    const winModal = document.getElementById("successModal");
    const restartButton = document.getElementById("restartButton");

    // Китайские числительные
    const numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    let shuffledNumbers = [];
    let correctOrder = [];

    function initializeGame() {
        shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
        correctOrder = [];
        blocksContainer.innerHTML = "";
        towerContainer.innerHTML = "";

        shuffledNumbers.forEach((number) => {
            const block = document.createElement("div");
            block.className = "block";
            block.textContent = number;
            block.draggable = true;
            block.dataset.number = numbers.indexOf(number) + 1;
            blocksContainer.appendChild(block);

            block.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text", event.target.dataset.number);
            });
        });
        logAction("Game initialized");
    }

    towerContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    towerContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const droppedNumber = event.dataTransfer.getData("text");
        const block = document.querySelector(`.block[data-number='${droppedNumber}']`);
        const lastNumber = correctOrder[correctOrder.length - 1];

        if (!lastNumber || parseInt(droppedNumber) === lastNumber + 1) {
            correctOrder.push(parseInt(droppedNumber));
            block.classList.add("correct");
            block.draggable = false;
            towerContainer.appendChild(block);

            // Расположение блоков друг на друга
            block.style.position = "absolute";
            block.style.bottom = `${correctOrder.length * 50 - 50}px`;

            if (correctOrder.length === numbers.length) {
                showWinModal();
            }
        } else {
            shakeTower();
            setTimeout(resetGame, 500);
        }
    });

    function shakeTower() {
        towerContainer.classList.add("shake");
        setTimeout(() => {
            towerContainer.classList.remove("shake");
        }, 500);
        logAction("shakeTower");
    }

    function resetGame() {
        initializeGame();
        logAction("resetGame");
    }

    function showWinModal() {
        winModal.classList.remove("hidden");
        logAction("showWinModal");
    }

    restartButton.addEventListener("click", () => {
        winModal.classList.add("hidden");
        resetGame();
    });

    // Инициализация игры
    initializeGame();
});

async function logAction(action) {
    const payload = {
        game: "Tower of Numbers", // Название игры
        user: "user1", // Идентификатор пользователя, можно сделать динамическим
        action: action, // Описание действия
    };

    try {
        await fetch("http://localhost:3000/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Failed to log action", error);
    }
}




   