document.addEventListener('DOMContentLoaded', () => {
    const maze = document.getElementById('maze');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseButton = document.getElementById('close-modal');

    // Массив с числами и их китайскими соответствиями
    const chineseNumbers = [
        { number: 15, text: '十五' },
        { number: 5, text: '五' },
        { number: 95, text: '九十五' },
        { number: 20, text: '二十' },
        { number: 44, text: '四十四' },
        { number: 54, text: '五十四' },
        { number: 2, text: '二' },
        { number: 80, text: '八十' },
        { number: 4, text: '四' },
        { number: 6, text: '六' },
        { number: 55, text: '五十五' }
    ];

    // Генерация сетки (maze)
    chineseNumbers.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.textContent = item.text;
        cell.dataset.number = item.number; // Привязываем число к каждой ячейке
        if (index === 0) {
            cell.classList.add('goal'); // Первая ячейка - цель
        }
        maze.appendChild(cell);
    });

    const cells = Array.from(maze.children);
    let currentGoalIndex = 0; // Индекс текущей цели

    // Обработка клика по кнопке Submit
    submitButton.addEventListener('click', () => {
        const answer = answerInput.value.trim(); // Ввод пользователя
        const currentCell = cells[currentGoalIndex];
        const correctAnswer = currentCell.dataset.number; // Правильный ответ из атрибута

        if (answer === correctAnswer) {
            // Если ответ правильный
            currentCell.classList.remove('goal'); // Убираем класс цели
            currentCell.classList.add('correct'); // Окрашиваем в оранжевый

            currentGoalIndex++; // Переход к следующей цели
            logAction("correctAnswer");

            if (currentGoalIndex < cells.length) {
                cells[currentGoalIndex].classList.add('goal'); // Следующая ячейка становится зелёной
                message.textContent = 'Correct! Move to the next number.';
                message.style.color = 'green';
            } else {
                // Если все ячейки пройдены
                message.textContent = 'Congratulations! You completed the game!';
                message.style.color = 'green';
                showModal(); // Показываем модальное окно с поздравлением
                answerInput.disabled = true;
                submitButton.disabled = true;
            }
        } else {
            // Если ответ неверный
            message.textContent = 'Wrong answer. Try again!';
            message.style.color = 'red';
            logAction("incorrectAnswer");

        }

        answerInput.value = ''; // Очищаем поле ввода
    });

    // Функция для показа модального окна
    function showModal() {
        modal.style.display = 'block';
        modalMessage.textContent = 'You have completed the game successfully! Congratulations!';
        logAction("showWinModal");
    }

    // Обработчик нажатия на кнопку "Начать заново"
    restartButton.addEventListener('click', () => {
        location.reload(); // Перезагружаем страницу для начала новой игры
    });

    // Закрытие модального окна
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});



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

  