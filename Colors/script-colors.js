const player = document.getElementById('player');
const obstaclesContainer = document.getElementById('obstacles');
const question = document.getElementById('question');
const feedback = document.getElementById('answer-feedback');
const buttonsContainer = document.getElementById('buttons');
const successPopup = document.getElementById('success-popup');
const restartButton = document.getElementById('restart');

let playerPosition = 50; // Игрок стартует слева
let obstacleIndex = 0;
let obstacles = [];

const colors = [
    { name: "红色 (hóng sè)", translation: "Красный", color: "red" },
    { name: "蓝色 (lán sè)", translation: "Синий", color: "blue" },
    { name: "绿色 (lǜ sè)", translation: "Зелёный", color: "green" },
    { name: "黄色 (huáng sè)", translation: "Жёлтый", color: "yellow" },
    { name: "黑色 (hēi sè)", translation: "Чёрный", color: "black" }
];

// Create obstacles dynamically
function createObstacle(index) {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.backgroundColor = colors[index].color;
    obstacle.style.left = '800px'; // Появляется справа от игрока
    obstacle.dataset.index = index;
    obstacles.push(obstacle);
    obstaclesContainer.appendChild(obstacle);
    logAction("createObstacle");
}

// Generate buttons once with randomized positions
// Generate buttons once with randomized positions
function generateButtons() {
    // Новый порядок кнопок
    const newOrder = [4, 1, 2, 0, 3]; // Индексы для перемешивания цветов

    newOrder.forEach((index) => {
        const color = colors[index];
        const button = document.createElement('button');
        button.className = 'answer';
        button.textContent = color.name;
        button.dataset.color = color.color;
        button.addEventListener('click', checkAnswer);
        buttonsContainer.appendChild(button);
        
    });
    logAction("generateButtons");
}



// Check if the answer is correct
function checkAnswer(event) {
    const button = event.target;
    const currentObstacle = obstacles[0];
    const isCorrect = button.dataset.color === currentObstacle.style.backgroundColor;

    if (isCorrect) {
        feedback.classList.add('hidden'); // Скрываем сообщение о неправильном ответе
        feedback.textContent = ''; // Очищаем текст сообщения (опционально)

        // Анимация разрушения препятствия
        currentObstacle.classList.add('destroy');
        setTimeout(() => {
            currentObstacle.remove();
            obstacles.shift();
        }, 500);

        // Игрок отскакивает на середину
        playerPosition = 600;
        player.style.left = `${playerPosition}px`;

        obstacleIndex++;
        if (obstacleIndex < colors.length) {
            // Если ещё остались препятствия, создаём следующее
            setTimeout(() => createObstacle(obstacleIndex), 2000);
        } else {
            // Все препятствия разрушены — показываем всплывающее окно
            setTimeout(() => {
                successPopup.classList.remove('hidden'); // Убираем класс hidden
                createSparkles(); // Генерируем искры
            }, 1000); // Небольшая задержка для завершения анимации
        }
        logAction("CorrectAnswer");
    } else {
        feedback.textContent = 'Неправильно! Попробуйте снова.'; // Показываем сообщение о неправильном ответе
        feedback.classList.remove('hidden'); // Убеждаемся, что сообщение отображается
        playerPosition = Math.max(0, playerPosition - 20);
        player.style.left = `${playerPosition}px`;

        currentObstacle.classList.add('shake');
        setTimeout(() => currentObstacle.classList.remove('shake'), 500);
        logAction("inCorrectAnswer");
    }
}



// Handle player movement
document.addEventListener('keydown', (event) => {
    const currentObstacle = obstacles[0];
    const obstacleLeft = currentObstacle ? parseInt(currentObstacle.style.left) : 0;

    if (event.key === 'ArrowRight') {
        if (obstacleLeft - playerPosition > 70) {
            playerPosition = Math.min(playerPosition + 10, 1150);
        } else {
            currentObstacle.classList.add('shake');
            setTimeout(() => currentObstacle.classList.remove('shake'), 500);
        }
    } else if (event.key === 'ArrowLeft') {
        playerPosition = Math.max(playerPosition - 10, 50);
    }

    player.style.left = `${playerPosition}px`;
});

// Restart game
restartButton.addEventListener('click', () => {
    playerPosition = 50; // Начало игры слева
    obstacleIndex = 0;
    player.style.left = `${playerPosition}px`;
    obstacles = [];
    obstaclesContainer.innerHTML = '';
    buttonsContainer.innerHTML = ''; // Сбрасываем кнопки
    generateButtons();
    createObstacle(obstacleIndex);
    successPopup.classList.add('hidden');
});

// Redirect to menu
const menuButton = document.createElement('button');
menuButton.id = 'menu';
menuButton.textContent = 'Меню';
menuButton.addEventListener('click', () => {
    window.location.href = 'C:/Users/Анастасия/newJS/ChinaProject/Menu/menu.html';
});
successPopup.appendChild(menuButton);

function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles-container');
    sparklesContainer.innerHTML = ''; // Очистить старые искры

    // Генерируем 50 искр
    for (let i = 0; i < 100; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Случайное расположение по периметру контейнера
        const randomX = Math.random() * 2 - 1; // Значение от -1 до 1
        const randomY = Math.random() * 2 - 1; // Значение от -1 до 1

        sparkle.style.setProperty('--random-x', randomX);
        sparkle.style.setProperty('--random-y', randomY);

        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;

        sparklesContainer.appendChild(sparkle);

        // Удаляем искры после завершения анимации
        setTimeout(() => sparkle.remove(), 1000);
    }
}




// Initialize game
generateButtons();
createObstacle(obstacleIndex);

async function logAction(action) {
    const payload = {
        game: "Numbers", // Название игры
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