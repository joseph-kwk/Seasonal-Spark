document.addEventListener('DOMContentLoaded', () => {
  const effectsToggle = document.getElementById('effects-toggle');
  const weatherMode = document.getElementById('weather-mode');
  const weatherSetup = document.getElementById('weather-setup');
  const apiKeyInput = document.getElementById('api-key');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const getLocationBtn = document.getElementById('get-location');
  const locationStatus = document.getElementById('location-status');
  const hemisphereSelect = document.getElementById('hemisphere');
  const seasonDisplay = document.getElementById('season-display');

  // Load saved settings
  chrome.storage.sync.get([
    'effectsEnabled', 
    'weatherMode', 
    'weatherApiKey', 
    'userLocation',
    'hemisphere'
  ], (data) => {
    effectsToggle.checked = data.effectsEnabled !== false;
    weatherMode.checked = data.weatherMode || false;
    apiKeyInput.value = data.weatherApiKey || '';
    hemisphereSelect.value = data.hemisphere || 'auto';
    
    if (data.weatherMode) {
      weatherSetup.style.display = 'block';
    }
    
    if (data.userLocation) {
      locationStatus.textContent = `✓ Location saved: ${data.userLocation.city || 'Unknown'}`;
      locationStatus.style.color = '#4caf50';
    }
    
    updateSeasonDisplay(data);
  });

  // Toggle effects
  effectsToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ effectsEnabled: effectsToggle.checked });
  });

  // Toggle weather mode
  weatherMode.addEventListener('change', () => {
    const enabled = weatherMode.checked;
    chrome.storage.sync.set({ weatherMode: enabled });
    weatherSetup.style.display = enabled ? 'block' : 'none';
    
    if (!enabled) {
      // Reload tabs to switch back to calendar mode
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
      });
    }
  });

  // Save API key
  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ weatherApiKey: apiKey }, () => {
        const btn = saveApiKeyBtn;
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.style.backgroundColor = '#4caf50';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
        }, 2000);
      });
    } else {
      alert('Please enter an API key');
    }
  });

  // Get user location
  getLocationBtn.addEventListener('click', () => {
    locationStatus.textContent = 'Getting location...';
    locationStatus.style.color = '#666';
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Try to get city name
        try {
          const apiKey = apiKeyInput.value.trim();
          if (apiKey) {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            const data = await response.json();
            const city = data.name;
            
            chrome.storage.sync.set({ 
              userLocation: { lat, lon, city } 
            }, () => {
              locationStatus.textContent = `✓ Location saved: ${city}`;
              locationStatus.style.color = '#4caf50';
              
              // Reload tabs to apply weather mode
              chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => chrome.tabs.reload(tab.id));
              });
            });
          } else {
            chrome.storage.sync.set({ 
              userLocation: { lat, lon, city: 'Unknown' } 
            }, () => {
              locationStatus.textContent = `✓ Location saved`;
              locationStatus.style.color = '#4caf50';
            });
          }
        } catch (error) {
          chrome.storage.sync.set({ 
            userLocation: { lat, lon, city: 'Unknown' } 
          });
          locationStatus.textContent = `✓ Location saved`;
          locationStatus.style.color = '#4caf50';
        }
      },
      (error) => {
        locationStatus.textContent = `✗ Location denied. Please allow location access.`;
        locationStatus.style.color = '#f44336';
      }
    );
  });

  // Hemisphere selection
  hemisphereSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ hemisphere: hemisphereSelect.value }, () => {
        // Reload tabs to apply hemisphere change
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => chrome.tabs.reload(tab.id));
        });
    });
  });

  // Update season display
  function updateSeasonDisplay(data) {
    if (data.weatherMode && data.weatherApiKey && data.userLocation) {
      seasonDisplay.textContent = '☁️ Weather Mode';
    } else {
      seasonDisplay.textContent = '📅 Calendar Mode';
    }
  }
});

