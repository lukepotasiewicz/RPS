let xPos = 0;
let yPos = 0;

document.addEventListener('mousemove', (event) => {
  xPos = event.clientX;
  yPos = event.clientY;
});

export const coinParticles = (coins) => {
  const container = document.querySelector('body');
  const topRandArray = [];
  for (let i = 0; i < coins; i += 1) {
    const particle = document.createElement('div');
    particle.classList.add('coin');
    particle.classList.add('particle');
    particle.style.left = `${xPos}px`;
    particle.style.top = `${yPos}px`;
    // eslint-disable-next-line no-loop-func
    setTimeout(() => {
      const leftRand = (Math.random() - 0.5) * 250;
      const topRand = (Math.random()) * -150 - 100;
      topRandArray.push(topRand);
      particle.style.left = `${xPos + leftRand}px`;
      particle.style.top = `${yPos + topRand}px`;
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        particle.style.transition = 'left 0.5s ease, top 0.9s ease-in, opacity 0.2s ease-out';
        particle.style.top = `${yPos + 1000}px`;
      }, Math.abs(topRandArray[i]));
    }, 0);
    setTimeout(() => {
      particle.style.opacity = 0;
    }, 200);
    setTimeout(() => {
      particle.remove();
    }, 1000);
    container.appendChild(particle);
  }
};
