// content/contentScript.js

// Detect hemisphere from timezone
function getHemisphere() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const southernZones = ['Australia', 'Auckland', 'Argentina', 'Chile', 
                         'South_Africa', 'Brazil', 'Paraguay', 'Uruguay',
                         'Antarctica', 'Bolivia', 'Peru', 'Namibia'];
  return southernZones.some(zone => timezone.includes(zone)) ? 'southern' : 'northern';
}

// Season detection function
function getSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  
  // Get season based on Northern Hemisphere
  let season;
  if (month >= 2 && month <= 4) season = "spring"; // Mar, Apr, May
  else if (month >= 5 && month <= 7) season = "summer"; // Jun, Jul, Aug
  else if (month >= 8 && month <= 10) season = "fall";   // Sep, Oct, Nov
  else season = "winter"; // Dec, Jan, Feb
  
  // Check user's hemisphere preference (or auto-detect)
  chrome.storage.sync.get(['hemisphere'], (data) => {
    const hemisphere = data.hemisphere || getHemisphere();
    console.log(`Detected hemisphere: ${hemisphere}`);
  });
  
  // For now, we'll add hemisphere flipping in the next step
  return season;
}

// Get weather-based season (when weather mode is enabled)
async function getWeatherSeason(lat, lon) {
  try {
    // Using OpenWeatherMap API (free tier: 1000 calls/day)
    const API_KEY = 'WEATHER_API_KEY'; // User will add their own key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    const weatherMain = data.weather[0].main;
    const temp = data.main.temp;
    
    console.log(`Weather: ${weatherMain}, Temp: ${temp}°C`);
    
    // Map weather conditions to seasons/effects
    if (weatherMain === 'Snow') return 'winter';
    if (weatherMain === 'Rain' || weatherMain === 'Drizzle') return 'rain';
    if (temp > 25) return 'summer'; // Hot
    if (temp < 10) return 'winter'; // Cold
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 8 && month <= 10) return 'fall';
    
    return 'summer'; // Default
  } catch (error) {
    console.log('Weather mode failed, falling back to calendar:', error);
    return getSeason(); // Fallback to calendar
  }
}

// Determine which season to use (weather mode or calendar)
async function determineCurrentSeason() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['weatherMode', 'weatherApiKey', 'userLocation'], async (data) => {
      if (data.weatherMode && data.weatherApiKey && data.userLocation) {
        // Weather mode enabled
        const { lat, lon } = data.userLocation;
        const season = await getWeatherSeason(lat, lon);
        resolve(season);
      } else {
        // Calendar mode (default)
        resolve(getSeason());
      }
    });
  });
}

// Rain effects (new for weather mode)
function injectRainEffects() {
  console.log("Injecting rain effects...");
  
  // Add the animation style once
  if (!document.getElementById('rain-animation-style')) {
    const style = document.createElement('style');
    style.id = 'rain-animation-style';
    style.innerHTML = `
      @keyframes rainfall {
        0% { 
          transform: translateY(0);
          opacity: 1;
        }
        100% { 
          transform: translateY(${window.innerHeight + 100}px);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create multiple raindrops (15-25 drops)
  const numberOfDrops = Math.floor(Math.random() * 11) + 15; // 15-25 drops
  
  for (let i = 0; i < numberOfDrops; i++) {
    setTimeout(() => {
      const drop = document.createElement("div");
      drop.innerHTML = '💧';
      drop.className = 'seasonal-effect-element';
      drop.style.position = 'fixed';
      drop.style.top = '-50px';
      drop.style.left = Math.random() * window.innerWidth + 'px';
      drop.style.fontSize = (Math.random() * 10 + 10) + 'px'; // 10-20px
      drop.style.animation = `rainfall ${Math.random() * 2 + 3}s linear forwards`; // 3-5s, faster than snow
      drop.style.animationDelay = Math.random() * 1 + 's'; // 0-1s delay
      drop.style.zIndex = '9999';
      drop.style.pointerEvents = 'none';
      document.body.appendChild(drop);
      
      // Remove drop after animation completes
      setTimeout(() => {
        drop.remove();
      }, (Math.random() * 2 + 3 + 1) * 1000 + 1000);
    }, i * 100); // Stagger creation by 100ms
  }
}
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
      leaf.className = 'seasonal-effect-element';
      leaf.style.position = 'fixed';
      leaf.style.top = '-50px';
      leaf.style.left = Math.random() * window.innerWidth + 'px';
      leaf.style.fontSize = (Math.random() * 15 + 15) + 'px'; // 15-30px
      leaf.style.animation = `fall ${Math.random() * 5 + 8}s linear forwards`; // 8-13s, no loop
      leaf.style.animationDelay = Math.random() * 2 + 's'; // 0-2s delay
      leaf.style.zIndex = '9999';
      leaf.style.pointerEvents = 'none';
      document.body.appendChild(leaf);
      
      // Remove leaf after animation completes
      setTimeout(() => {
        leaf.remove();
      }, (Math.random() * 5 + 8 + 2) * 1000 + 1000);
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
      snowflake.className = 'seasonal-effect-element';
      snowflake.style.position = 'fixed';
      snowflake.style.top = '-50px';
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
      snowflake.style.fontSize = (Math.random() * 15 + 12) + 'px'; // 12-27px
      snowflake.style.animation = `snowfall ${Math.random() * 5 + 10}s linear forwards`; // 10-15s, no loop
      snowflake.style.animationDelay = Math.random() * 2 + 's'; // 0-2s delay
      snowflake.style.zIndex = '9999';
      snowflake.style.pointerEvents = 'none';
      document.body.appendChild(snowflake);
      
      // Remove snowflake after animation completes
      setTimeout(() => {
        snowflake.remove();
      }, (Math.random() * 5 + 10 + 2) * 1000 + 1000);
    }, i * 200); // Stagger creation by 200ms
  }
}

// Spring effects
function injectSpringEffects() {
  console.log("Injecting spring effects...");
  
  // Create a few flowers (3-5 flowers)
  const numberOfFlowers = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < numberOfFlowers; i++) {
    const flower = document.createElement("div");
    flower.innerHTML = '🌸';
    flower.className = 'seasonal-effect-element';
    flower.style.position = 'fixed';
    flower.style.top = Math.random() * window.innerHeight + 'px';
    flower.style.left = Math.random() * window.innerWidth + 'px';
    flower.style.fontSize = '20px';
    flower.style.zIndex = '9999';
    flower.style.pointerEvents = 'none';
    flower.style.opacity = '0.8';
    document.body.appendChild(flower);
    
    // Remove flower after 8-12 seconds
    setTimeout(() => {
      flower.style.transition = 'opacity 2s';
      flower.style.opacity = '0';
      setTimeout(() => flower.remove(), 2000);
    }, Math.random() * 4000 + 8000);
  }
}

// Summer effects
function injectSummerEffects() {
  console.log("Injecting summer effects...");
  const sun = document.createElement("div");
  sun.innerHTML = '☀️';
  sun.className = 'seasonal-effect-element';
  sun.style.position = 'fixed';
  sun.style.top = '20px';
  sun.style.right = '20px';
  sun.style.fontSize = '40px';
  sun.style.zIndex = '9999';
  sun.style.pointerEvents = 'none';
  sun.style.opacity = '0.9';
  document.body.appendChild(sun);
  
  // Remove sun after 10-15 seconds
  setTimeout(() => {
    sun.style.transition = 'opacity 2s';
    sun.style.opacity = '0';
    setTimeout(() => sun.remove(), 2000);
  }, Math.random() * 5000 + 10000);
}

const tips = {
  fall: ["Take a walk in the crisp air 🍂", "Time for cozy socks and warm drinks!"],
  winter: ["Stay warm and hydrated ❄️", "Perfect time for reflection and rest."],
  spring: ["Fresh start — try something new 🌸", "Notice what's blooming around you."],
  summer: ["Don't forget sunscreen ☀️", "Make time for play and rest."],
  rain: ["Rainy day? Perfect time to relax 💧", "Listen to the soothing sound of rain 🌧️"]
};

function showTip(season) {
  const tip = tips[season][Math.floor(Math.random() * tips[season].length)];
  const tipBox = document.createElement("div");
  tipBox.className = "seasonal-tip seasonal-effect-element";
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
  
  // Remove tip after 8 seconds
  setTimeout(() => {
    tipBox.style.transition = 'opacity 1s';
    tipBox.style.opacity = '0';
    setTimeout(() => tipBox.remove(), 1000);
  }, 8000);
}

let effectsInterval = null;

async function startPeriodicEffects() {
  // Get the current season (weather or calendar based)
  const season = await determineCurrentSeason();
  
  // Show effects immediately
  injectSeasonalEffect(season);
  showTip(season);
  
  // Then show effects every 30-60 seconds
  effectsInterval = setInterval(async () => {
    chrome.storage.sync.get('effectsEnabled', async (data) => {
      if (data.effectsEnabled !== false) {
        const currentSeason = await determineCurrentSeason();
        injectSeasonalEffect(currentSeason);
        // Show tip occasionally (30% chance)
        if (Math.random() < 0.3) {
          showTip(currentSeason);
        }
      }
    });
  }, Math.random() * 30000 + 30000); // 30-60 seconds
}

function injectSeasonalEffect(season) {
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
    case 'rain':
      injectRainEffects();
      break;
  }
}

function applySeasonalEffects() {
    chrome.storage.sync.get('effectsEnabled', (data) => {
        if (data.effectsEnabled !== false) { // Default to true
            console.log("Seasonal Spark: Effects enabled");
            
            // Start periodic effects
            startPeriodicEffects();
        } else {
            console.log("Seasonal effects are disabled");
        }
    });
}

// Listen for changes to the storage (when toggle is switched)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.effectsEnabled) {
        if (!changes.effectsEnabled.newValue) {
            // Effects disabled - remove all effects and stop interval
            if (effectsInterval) {
                clearInterval(effectsInterval);
                effectsInterval = null;
            }
            removeAllEffects();
        } else {
            // Effects enabled - reload the page to show effects
            location.reload();
        }
    }
});

// Function to remove all seasonal effects
function removeAllEffects() {
    // Remove all seasonal effect elements
    const effects = document.querySelectorAll('.seasonal-effect-element');
    effects.forEach(el => el.remove());
    
    console.log("Seasonal effects removed");
}

applySeasonalEffects();
