const snowflakesContainer = document.getElementById('snowflakes-container');

// Function to create a single snowflake
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';

    // Random position and size
    const size = Math.random() * 1.5 + 0.5 + 'em';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.fontSize = size;

    // Random animation duration
    const duration = Math.random() * 5 + 5 + 's';
    const delay = Math.random() * 5 + 's';
    snowflake.style.animationDuration = duration;
    snowflake.style.animationDelay = delay;

    snowflakesContainer.appendChild(snowflake);

    // Remove snowflake after animation
    snowflake.addEventListener('animationend', () => {
        snowflake.remove();
    });
}

// Create snowflakes at intervals
setInterval(createSnowflake, 200);

// CSS Keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes snow {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
