// effects/spring.js
export function injectSpringEffects() {
  console.log("Injecting spring effects...");
  const flower = document.createElement("div");
  flower.innerHTML = '🌸';
  flower.style.position = 'fixed';
  flower.style.top = Math.random() * window.innerHeight + 'px';
  flower.style.left = Math.random() * window.innerWidth + 'px';
  flower.style.fontSize = '20px';
  flower.style.zIndex = '9999';
  flower.style.pointerEvents = 'none';
  document.body.appendChild(flower);
}
