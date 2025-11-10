// effects/fall.js
export function injectFallEffects() {
  console.log("Injecting fall effects...");
  const leaf = document.createElement("div");
  // Applying a simple style for now. We'll make this better.
  leaf.innerHTML = '🍂';
  leaf.style.position = 'fixed';
  leaf.style.top = '-10px';
  leaf.style.left = Math.random() * window.innerWidth + 'px';
  leaf.style.fontSize = '20px';
  leaf.style.animation = 'fall 10s linear infinite';
  leaf.style.zIndex = '9999';
  leaf.style.pointerEvents = 'none';
  document.body.appendChild(leaf);

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fall {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(${window.innerHeight}px) rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
