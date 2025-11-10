document.addEventListener('DOMContentLoaded', () => {
  const effectsToggle = document.getElementById('effects-toggle');

  // Load the saved setting and update the toggle switch
  chrome.storage.sync.get('effectsEnabled', (data) => {
    effectsToggle.checked = data.effectsEnabled !== false; // Default to true
  });

  // When the toggle is changed, save the new setting
  effectsToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ effectsEnabled: effectsToggle.checked });
  });
});

