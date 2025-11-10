// effects/summer.js
export function injectSummerEffects() {
  console.log("Injecting summer effects...");
  const sun = document.createElement("div");
  sun.innerHTML = '☀️';
  sun.style.position = 'fixed';
  sun.style.top = '20px';
  sun.style.right = '20px';
  sun.style.fontSize = '40px';
  sun.style.zIndex = '9999';
  sun.style.pointerEvents = 'none';
  document.body.appendChild(sun);
}
