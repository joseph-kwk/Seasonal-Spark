// content/contentScript.js

// Season detection function
function getSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  // Northern Hemisphere seasons
  if (month >= 2 && month <= 4) return "spring"; // Mar, Apr, May
  if (month >= 5 && month <= 7) return "summer"; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return "fall";   // Sep, Oct, Nov
  return "winter"; // Dec, Jan, Feb
}

// Fall effects
function injectFallEffects() {
  console.log("Injecting fall effects...");
  
  // Add the animation style once
  if (!document.getElementById('fall-animation-style')) {
    const style = document.createElement('style');
    style.id = 'fall-animation-style';
    style.innerHTML = `
      @keyframes fall {
        0% { 
          transform: translateY(0) translateX(0) rotate(0deg);
          opacity: 1;
        }
        100% { 
          transform: translateY(${window.innerHeight + 100}px) translateX(100px) rotate(360deg);
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create multiple leaves (5-10 leaves)
  const numberOfLeaves = Math.floor(Math.random() * 6) + 5; // 5-10 leaves
  
  for (let i = 0; i < numberOfLeaves; i++) {
    setTimeout(() => {
      const leaf = document.createElement("div");
      leaf.innerHTML = '🍂';
      leaf.style.position = 'fixed';
      leaf.style.top = '-50px';
      leaf.style.left = Math.random() * window.innerWidth + 'px';
      leaf.style.fontSize = (Math.random() * 15 + 15) + 'px'; // 15-30px
      leaf.style.animation = `fall ${Math.random() * 5 + 8}s linear infinite`; // 8-13s
      leaf.style.animationDelay = Math.random() * 5 + 's'; // 0-5s delay
      leaf.style.zIndex = '9999';
      leaf.style.pointerEvents = 'none';
      document.body.appendChild(leaf);
    }, i * 300); // Stagger creation by 300ms
  }
}

// Winter effects
function injectWinterEffects() {
  console.log("Injecting winter effects...");
  
  // Add the animation style once
  if (!document.getElementById('snow-animation-style')) {
    const style = document.createElement('style');
    style.id = 'snow-animation-style';
    style.innerHTML = `
      @keyframes snowfall {
        0% { 
          transform: translateY(0) translateX(0);
          opacity: 1;
        }
        100% { 
          transform: translateY(${window.innerHeight + 100}px) translateX(50px);
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create multiple snowflakes (8-15 snowflakes)
  const numberOfFlakes = Math.floor(Math.random() * 8) + 8; // 8-15 flakes
  
  for (let i = 0; i < numberOfFlakes; i++) {
    setTimeout(() => {
      const snowflake = document.createElement("div");
      snowflake.innerHTML = '❄️';
      snowflake.style.position = 'fixed';
      snowflake.style.top = '-50px';
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
      snowflake.style.fontSize = (Math.random() * 15 + 12) + 'px'; // 12-27px
      snowflake.style.animation = `snowfall ${Math.random() * 5 + 10}s linear infinite`; // 10-15s
      snowflake.style.animationDelay = Math.random() * 5 + 's'; // 0-5s delay
      snowflake.style.zIndex = '9999';
      snowflake.style.pointerEvents = 'none';
      document.body.appendChild(snowflake);
    }, i * 200); // Stagger creation by 200ms
  }
}

// Spring effects
function injectSpringEffects() {
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

// Summer effects
function injectSummerEffects() {
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

const tips = {
  fall: ["Take a walk in the crisp air 🍂", "Time for cozy socks and warm drinks!"],
  winter: ["Stay warm and hydrated ❄️", "Perfect time for reflection and rest."],
  spring: ["Fresh start — try something new 🌸", "Notice what's blooming around you."],
  summer: ["Don’t forget sunscreen ☀️", "Make time for play and rest."]
};

function showTip(season) {
  const tip = tips[season][Math.floor(Math.random() * tips[season].length)];
  const tipBox = document.createElement("div");
  tipBox.className = "seasonal-tip";
  tipBox.innerText = tip;
  tipBox.style.position = 'fixed';
  tipBox.style.bottom = '20px';
  tipBox.style.right = '20px';
  tipBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  tipBox.style.color = 'white';
  tipBox.style.padding = '10px';
  tipBox.style.borderRadius = '5px';
  tipBox.style.zIndex = '10000';
  tipBox.style.fontFamily = 'sans-serif';
  document.body.appendChild(tipBox);
}

function applySeasonalEffects() {
    chrome.storage.sync.get('effectsEnabled', (data) => {
        if (data.effectsEnabled !== false) { // Default to true
            const season = getSeason();
            console.log(`Current season: ${season}`);
            
            // Inject seasonal effects
            switch (season) {
                case 'fall':
                    injectFallEffects();
                    break;
                case 'winter':
                    injectWinterEffects();
                    break;
                case 'spring':
                    injectSpringEffects();
                    break;
                case 'summer':
                    injectSummerEffects();
                    break;
            }

            // Show a seasonal tip
            showTip(season);
        }
    });
}

applySeasonalEffects();
