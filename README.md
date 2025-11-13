# 🌟 Seasonal Spark

A browser extension that enhances your browsing experience with seasonal visual effects and uplifting tips. Seasonal Spark automatically adapts to the current season, bringing a cozy, playful, or mindful vibe to your web browsing.

## ✨ Features

- **🍂 Seasonal Visual Effects**: Beautiful animated effects that change with the seasons
  - **Fall**: Falling leaves drifting across your screen
  - **Winter**: Gentle snowflakes falling
  - **Spring**: Blooming flowers
  - **Summer**: Bright sunshine
  - **Rain**: Raindrops (when weather mode detects rain) �
- **�💡 Uplifting Tips**: Seasonal reminders and mindful messages
- **⚙️ Customizable**: Toggle effects on/off with a simple popup menu
- **🌍 Hemisphere Detection**: Automatically adapts seasons for Southern Hemisphere
- **☁️ Weather Mode** (Optional): Use real-time weather instead of calendar
  - Requires free API key from OpenWeatherMap
  - Shows rain effects when it's actually raining
  - Temperature-based season detection
- **🎨 Non-intrusive**: Effects don't interfere with page interaction
- **💾 Remembers Preferences**: Your settings are saved automatically

## 🚀 Installation

### For Development/Testing

1. Clone this repository or download the ZIP file
   ```bash
   git clone https://github.com/joseph-kwk/Seasonal-Spark.git
   ```

2. Open your browser's extension page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`

3. Enable **"Developer mode"** (toggle in the top-right corner)

4. Click **"Load unpacked"**

5. Navigate to and select the `Seasonal-Spark` folder

6. The extension is now installed! 🎉

## 📖 How to Use

### Basic Mode (Calendar-Based)
1. **Automatic Effects**: Once installed, the extension automatically detects the current season based on your calendar and displays appropriate effects on any webpage you visit.

2. **Toggle Effects**: Click the Seasonal Spark icon in your browser toolbar to open the popup menu. Use the toggle switch to turn effects on or off.

### Weather Mode (Optional)
Enable real-time weather-based effects:

1. **Get API Key**: 
   - Sign up for free at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key (1000 calls/day included)

2. **Enable Weather Mode**:
   - Click the extension icon
   - Toggle "Use Real Weather" ON
   - Enter your API key
   - Click "Get My Location" to allow location access
   
3. **Enjoy**: Now effects match your actual weather! See rain effects when it's raining, snow when it's snowing, etc.

### Hemisphere Settings
- **Auto-detect**: Automatically determines your hemisphere from timezone
- **Manual Override**: Choose Northern or Southern hemisphere manually

## 🛠️ Project Structure

```
Seasonal-Spark/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content/
│   ├── contentScript.js   # Main content script with all effects
│   └── effects/           # Original modular effect files
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styling
│   └── popup.js           # Popup functionality
├── assets/
│   ├── icons/             # Extension icons (placeholder)
│   └── visuals/           # Visual assets
├── styles/
│   └── seasonal.css       # Seasonal styling
└── utils/
    └── seasonDetector.js  # Season detection logic
```

## 🎯 Current Season Detection

The extension automatically detects seasons based on the following months:
- **Spring**: March, April, May
- **Summer**: June, July, August
- **Fall**: September, October, November
- **Winter**: December, January, February

## 🔮 Future Enhancements

- Weather API integration for real-time effects
- More customization options (intensity, specific effects)
- Additional seasonal themes and variations
- User journaling and seasonal reflections
- Community-contributed seasonal packs
- Actual icon designs

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

**Joseph Kasongo**
- GitHub: [@joseph-kwk](https://github.com/joseph-kwk)

---

*Made with ❤️ to bring seasonal joy to your browsing experience*
