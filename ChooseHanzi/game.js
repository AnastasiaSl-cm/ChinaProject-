// Данные для заданий
const tasks = [
    {
        correct: "正",
        image: "image1.png",
        options: [
            { text: "正"},
            { text: "口" },
            { text: "人"},
            { text: "日" }
        ]
    },
    {
        correct: "好",
        image: "image2.png",
        options: [
            { text: "好" },
            { text: "女" },
            { text: "子" },
            { text: "大" }
        ]
    },
    {
        correct: "家",
        image: "image3.png",
        options: [
            { text: "家" },
            { text: "牛" },
            { text: "火"},
            { text: "鸟" }
        ]
    },
    {
        correct: "学",
        image: "image4.png",
        options: [
            { text: "学"},
            { text: "木"},
            { text: "水"},
            { text: "山" }
        ]
    },
    {
        correct: "友",
        image: "image5.png",
        options: [
            { text: "友"},
            { text: "月"},
            { text: "日"},
            { text: "车" }
        ]
    }
];

// Фразы для неправильных ответов
const incorrectPhrases = [
    "Попробуйте ещё раз!",
    "Не сдавайтесь, подумайте ещё!",
    "Это не то, что мы ищем.",
    "Не совсем правильно, попробуйте другой вариант.",
    "Хорошая попытка, но попробуйте снова!"
];

// Переменные
let currentTaskIndex = 0;
const optionsContainer = document.getElementById("options-container");
const resultDiv = document.getElementById("result");
const signalImage = document.getElementById("signal-image");

// Функция для случайного выбора фразы
function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * incorrectPhrases.length);
    return incorrectPhrases[randomIndex];
}

// Перемешивание вариантов
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Создание кнопок для выбора
function createOptions(task) {
    optionsContainer.innerHTML = ""; // Очищаем старые кнопки
    shuffle(task.options); // Перемешиваем варианты

    task.options.forEach(option => {
        const button = document.createElement("div");
        button.classList.add("option");

        const text = document.createElement("span");
        text.textContent = option.text; // Отображаем только текст иероглифа

        button.appendChild(text);

        button.addEventListener("click", () => checkAnswer(option.text));
        optionsContainer.appendChild(button);
    });
}


// Проверка ответа
function checkAnswer(selectedAnswer) {
    const currentTask = tasks[currentTaskIndex];
    if (selectedAnswer === currentTask.correct) {
        resultDiv.textContent = "Правильно! Отличная работа!";
        resultDiv.style.color = "green";
        showNextButton();
        logAction("CorrectAnswer");
    } else {
        resultDiv.textContent = getRandomPhrase();
        resultDiv.style.color = "red";
        logAction("inCorrectAnswer");
    }
}

// Показать кнопку "Далее"
function showNextButton() {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Далее";
    nextButton.style.marginTop = "20px";
    nextButton.addEventListener("click", nextTask);
    resultDiv.appendChild(nextButton);
}

// Загрузка следующего задания
function nextTask() {
    currentTaskIndex++;

    if (currentTaskIndex < tasks.length) {
        loadTask(currentTaskIndex);
    } else {
        showFinalScreen();
    }
    logAction("nextTask");
}

// Загрузка текущего задания
function loadTask(taskIndex) {
    const task = tasks[taskIndex];
    signalImage.src = task.image; // Устанавливаем картинку с неправильным иероглифом
    createOptions(task); // Создаём варианты ответов
    resultDiv.textContent = ""; // Сбрасываем результат
    logAction("loadTask");
}


// Показ финального экрана
// Функция для показа финального экрана
function showFinalScreen() {
    optionsContainer.innerHTML = ""; // Убираем кнопки
    signalImage.style.display = "none"; // Прячем картинку
    resultDiv.textContent = ""; // Очищаем текст результата

    // Создаем всплывающее окно
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modal.style.borderRadius = "10px";
    modal.style.textAlign = "center";
    modal.style.zIndex = "1000";

    // Заголовок
    const message = document.createElement("h2");
    message.textContent = "Поздравляем! Вы успешно завершили все задания!";
    message.style.color = "blue";

    // Кнопка "Начать заново"
    const restartButton = document.createElement("button");
    restartButton.textContent = "Начать заново";
    restartButton.style.margin = "10px";
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "16px";
    restartButton.style.cursor = "pointer";
    restartButton.addEventListener("click", () => {
        currentTaskIndex = 0; // Сбрасываем индекс задания
        signalImage.style.display = "block"; // Показываем картинку
        loadTask(currentTaskIndex); // Загружаем первое задание
        modal.remove(); // Убираем всплывающее окно
    });

    // Кнопка "Меню"
    const menuButton = document.createElement("button");
    menuButton.textContent = "Меню";
    menuButton.style.margin = "10px";
    menuButton.style.padding = "10px 20px";
    menuButton.style.fontSize = "16px";
    menuButton.style.cursor = "pointer";
    menuButton.addEventListener("click", () => {
        window.location.href = "C:/Users/Анастасия/newJS/ChinaProject/Menu/menu.html"; // Переход на страницу меню
    });

    // Добавляем элементы в окно
    modal.appendChild(message);
    modal.appendChild(restartButton);
    modal.appendChild(menuButton);

    // Добавляем окно на страницу
    document.body.appendChild(modal);

    logAction("showFinalScreen");
}


// Запуск первого задания
loadTask(currentTaskIndex);


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
  