// content/contentScript.js

// Detect hemisphere from timezone
function getHemisphere() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const southernZones = ['Australia', 'Auckland', 'Argentina', 'Chile', 
                         'South_Africa', 'Brazil', 'Paraguay', 'Uruguay',
                         'Antarctica', 'Bolivia', 'Peru', 'Namibia'];
  return southernZones.some(zone => timezone.includes(zone)) ? 'southern' : 'northern';
}

// Helper to calculate Easter date (Meeus/Jones/Butcher's algorithm)
function getEasterDate(year) {
    const f = Math.floor,
        G = year % 19,
        C = f(year / 100),
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        L = I - J,
        month = 3 + f((L + 40) / 44),
        day = L + 28 - 31 * f(month / 4);

    return { month: month - 1, day: day }; // Month is 0-indexed
}

// Helper to calculate Thanksgiving date (4th Thursday in Nov)
function getThanksgivingDate(year) {
    const nov1 = new Date(year, 10, 1);
    const day = nov1.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = (4 - day + 7) % 7; // Days to next Thursday
    const firstThursday = 1 + diff;
    return firstThursday + 21; // 4th Thursday
}

// Check for holidays
function getHoliday(date = new Date()) {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    // Christmas: Dec 1 - Dec 31
    if (month === 11) return 'christmas';

    // Thanksgiving: Week of Thanksgiving (Mon-Sun)
    const thanksgivingDay = getThanksgivingDate(year);
    // Thanksgiving "season" is the week leading up to it + the day
    if (month === 10 && day >= thanksgivingDay - 7 && day <= thanksgivingDay) return 'thanksgiving';

    // Easter: Week of Easter
    const easter = getEasterDate(year);
    const currentTs = new Date(year, month, day).getTime();
    const easterTs = new Date(year, easter.month, easter.day).getTime();
    const diffDays = (currentTs - easterTs) / (1000 * 60 * 60 * 24);
    
    if (Math.abs(diffDays) <= 4) return 'easter'; // 4 days around Easter

    return null;
}

// Season detection function
function getSeason(date = new Date(), hemisphere = 'northern') {
  // Check for holiday first
  const holiday = getHoliday(date);
  if (holiday) return holiday;

  const month = date.getMonth(); // 0-11
  
  let season;
  
  if (hemisphere === 'southern') {
    // Southern Hemisphere Seasons
    if (month >= 2 && month <= 4) season = "fall";      // Mar, Apr, May
    else if (month >= 5 && month <= 7) season = "winter"; // Jun, Jul, Aug
    else if (month >= 8 && month <= 10) season = "spring"; // Sep, Oct, Nov
    else season = "summer"; // Dec, Jan, Feb
  } else {
    // Northern Hemisphere Seasons (Default)
    if (month >= 2 && month <= 4) season = "spring";    // Mar, Apr, May
    else if (month >= 5 && month <= 7) season = "summer"; // Jun, Jul, Aug
    else if (month >= 8 && month <= 10) season = "fall";  // Sep, Oct, Nov
    else season = "winter"; // Dec, Jan, Feb
  }
  
  return season;
}

// Get weather-based season (when weather mode is enabled)
async function getWeatherSeason(lat, lon, apiKey) {
  try {
    if (!apiKey) throw new Error('No API key provided');

    // Use background script to fetch weather to avoid CORS issues
    const response = await chrome.runtime.sendMessage({
      action: 'fetchWeather',
      lat, lon, apiKey
    });

    if (!response.success) throw new Error(response.error);
    
    const data = response.data;
    const weatherMain = data.weather[0].main;
    const temp = data.main.temp;
    const month = new Date().getMonth();
    
    console.log(`Weather: ${weatherMain}, Temp: ${temp}°C`);
    
    // Map weather conditions to seasons/effects
    if (weatherMain === 'Snow') return 'winter';
    if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') return 'rain';
    
    // Temperature based overrides
    if (temp > 28) return 'summer'; // Very Hot
    if (temp < 5) return 'winter';  // Very Cold
    
    // Fallback to calendar season if weather is mild/ambiguous
    if (temp >= 15 && temp <= 28) {
        if (month >= 2 && month <= 5) return 'spring';
        if (month >= 8 && month <= 11) return 'fall';
        return 'summer';
    }
    
    return 'spring'; // Default mild
  } catch (error) {
    console.log('Weather mode failed, falling back to calendar:', error);
    return 'fall'; // Safe default
  }
}

// Determine which season to use (weather mode or calendar)
async function determineCurrentSeason() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['weatherMode', 'weatherApiKey', 'userLocation', 'hemisphere', 'blockedSites'], async (data) => {
      // Check if current site is blocked
      const hostname = window.location.hostname;
      if (data.blockedSites && data.blockedSites.includes(hostname)) {
        console.log('Seasonal Spark: Effects disabled on this site.');
        resolve(null); // Return null to indicate no effects
        return;
      }

      // Determine hemisphere first
      const hemisphere = data.hemisphere === 'auto' || !data.hemisphere ? getHemisphere() : data.hemisphere;

      if (data.weatherMode && data.weatherApiKey && data.userLocation) {
        // Weather mode enabled
        const { lat, lon } = data.userLocation;
        const season = await getWeatherSeason(lat, lon, data.weatherApiKey);
        resolve(season);
      } else {
        // Calendar mode (default)
        resolve(getSeason(new Date(), hemisphere));
      }
    });
  });
}

// ...existing code...

async function startPeriodicEffects() {
  // Get the current season (weather or calendar based)
  const season = await determineCurrentSeason();
  
  if (!season) return; // Exit if site is blocked or error

  // Show effects immediately
  injectSeasonalEffect(season);
  showTip(season);
  
  // Then show effects every 30-60 seconds
  effectsInterval = setInterval(async () => {
    chrome.storage.sync.get(['effectsEnabled', 'blockedSites'], async (data) => {
      // Re-check blocked sites in case it changed
      const hostname = window.location.hostname;
      if (data.blockedSites && data.blockedSites.includes(hostname)) {
        return;
      }

      if (data.effectsEnabled !== false) {
        const currentSeason = await determineCurrentSeason();
        if (currentSeason) {
            injectSeasonalEffect(currentSeason);
            // Show tip occasionally (30% chance)
            if (Math.random() < 0.3) {
            showTip(currentSeason);
            }
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
    case 'christmas':
      injectChristmasEffects();
      break;
    case 'thanksgiving':
      injectThanksgivingEffects();
      break;
    case 'easter':
      injectEasterEffects();
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
