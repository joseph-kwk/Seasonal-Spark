// effects/winter.js
export function injectWinterEffects() {
  console.log("Injecting winter effects...");
  const snowflake = document.createElement("div");
  snowflake.innerHTML = '❄️';
  snowflake.style.position = 'fixed';
  snowflake.style.top = '-10px';
  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  snowflake.style.fontSize = '20px';
  snowflake.style.animation = 'fall 10s linear infinite';
  snowflake.style.zIndex = '9999';
  snowflake.style.pointerEvents = 'none';
  document.body.appendChild(snowflake);

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fall {
      0% { transform: translateY(0); }
      100% { transform: translateY(${window.innerHeight}px); }
    }
  `;
  document.head.appendChild(style);
}
