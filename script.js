window.addEventListener('DOMContentLoaded', () => {
  const ball = document.getElementById('ball');
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const ballWidth = ball.offsetWidth;
  const ballHeight = ball.offsetHeight;

  let x = containerWidth / 2 - ballWidth / 2; // initial x position
  let y = containerHeight / 2 - ballHeight / 2; // initial y position
  let dx = 2; // horizontal velocity
  let dy = 2; // vertical velocity

  function animate() {
    // Update ball position
    x += dx;
    y += dy;

    // Check collision with walls
    if (x + ballWidth >= containerWidth || x <= 0) {
      dx = -dx; // Reverse horizontal velocity
    }
    if (y + ballHeight >= containerHeight || y <= 0) {
      dy = -dy; // Reverse vertical velocity
    }

    // Move the ball
    ball.style.transform = `translate(${x}px, ${y}px)`;

    requestAnimationFrame(animate);
  }

  animate();
});

