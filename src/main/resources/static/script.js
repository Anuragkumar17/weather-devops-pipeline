const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');

const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const errorText = document.getElementById('error-text');

// DOM Elements for Data
const locationName = document.getElementById('location-name');
const currentDate = document.getElementById('current-date');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherIcon = document.getElementById('weather-icon');
const minTemp = document.getElementById('min-temp');
const maxTemp = document.getElementById('max-temp');

// On Load
document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        getWeatherByCity(savedCity);
    } else {
        // Default background
        document.body.style.backgroundImage = "linear-gradient(to bottom, #1e3c72, #2a5298)";
    }
});

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                showError("Geolocation access denied or unavailable.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
});

// Main Functions
async function getWeatherByCity(city) {
    showLoader();
    try {
        // Step 1: Geocoding (Convert city to coordinates)
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const name = `${location.name}${location.country ? ', ' + location.country : ''}`;

        // Step 2: Fetch Weather
        await fetchWeatherData(lat, lon, name);
        
        // Save to local storage
        localStorage.setItem('lastCity', location.name);
        cityInput.value = '';

    } catch (error) {
        showError(error.message);
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        // Try to reverse geocode to get city name
        let locationNameStr = "Unknown Location";
        try {
            const revGeoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const revGeoData = await revGeoRes.json();
            locationNameStr = `${revGeoData.city || revGeoData.locality}, ${revGeoData.countryCode}`;
        } catch (e) {
            // Fallback if reverse geocoding fails
            locationNameStr = "Your Location";
        }

        await fetchWeatherData(lat, lon, locationNameStr);
        
    } catch (error) {
        showError(error.message);
    }
}

async function fetchWeatherData(lat, lon, name) {
    try {
        const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        updateUI(data, name);
    } catch (error) {
        throw error;
    }
}

function updateUI(data, name) {
    hideLoader();
    
    // Parse data
    const currentTemp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const isDay = data.current.is_day === 1;
    const min = Math.round(data.daily.temperature_2m_min[0]);
    const max = Math.round(data.daily.temperature_2m_max[0]);
    
    const weatherInfo = mapWeatherCode(code, isDay);

    // Update DOM
    locationName.textContent = name;
    currentDate.textContent = formatDate(new Date());
    temperature.textContent = currentTemp;
    weatherCondition.textContent = weatherInfo.condition;
    weatherIcon.className = `fa-solid ${weatherInfo.icon}`;
    minTemp.textContent = `${min}°C`;
    maxTemp.textContent = `${max}°C`;

    // Change Background
    changeBackground(weatherInfo.type, isDay);

    // Show Card
    weatherCard.classList.remove('hidden');
    
    // Re-trigger animation
    weatherCard.style.animation = 'none';
    weatherCard.offsetHeight; /* trigger reflow */
    weatherCard.style.animation = null;
}

// Helpers
function showLoader() {
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    weatherCard.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(msg) {
    hideLoader();
    errorText.textContent = msg;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function mapWeatherCode(code, isDay) {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    
    let type = 'clear';
    let condition = 'Clear';
    let icon = isDay ? 'fa-sun' : 'fa-moon';

    if (code === 0) {
        type = 'clear';
        condition = 'Clear sky';
        icon = isDay ? 'fa-sun' : 'fa-moon';
    } else if (code >= 1 && code <= 3) {
        type = 'clouds';
        condition = code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast';
        icon = isDay ? 'fa-cloud-sun' : 'fa-cloud-moon';
        if (code === 3) icon = 'fa-cloud';
    } else if (code === 45 || code === 48) {
        type = 'haze';
        condition = 'Fog / Mist';
        icon = 'fa-smog';
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
        type = 'rain';
        condition = 'Rain';
        icon = 'fa-cloud-rain';
    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        type = 'snow';
        condition = 'Snow';
        icon = 'fa-snowflake';
    } else if (code >= 95 && code <= 99) {
        type = 'thunderstorm';
        condition = 'Thunderstorm';
        icon = 'fa-cloud-bolt';
    }

    return { type, condition, icon };
}

function changeBackground(type, isDay) {
    const timeOfDay = isDay ? 'day' : 'night';
    let bgUrl = '';

    // If actual images are placed in assets/backgrounds/
    // bgUrl = `assets/backgrounds/${type}-${timeOfDay}.jpg`;
    
    // For now, using high-quality Unsplash source URLs for immediate visual impact
    const unsplashQueries = {
        'clear-day': 'clear-sky,sunny,landscape',
        'clear-night': 'starry-sky,night,dark',
        'clouds-day': 'cloudy-sky,overcast',
        'clouds-night': 'cloudy-night,dark-clouds',
        'rain-day': 'rain,rainy-day,wet',
        'rain-night': 'rain-night,dark-rain',
        'snow-day': 'snow,winter-landscape',
        'snow-night': 'snow-night,winter-night',
        'haze-day': 'fog,mist,haze,morning',
        'haze-night': 'fog-night,dark-mist',
        'thunderstorm-day': 'lightning,storm,dark-sky',
        'thunderstorm-night': 'lightning-night,storm'
    };

    const queryKey = `${type}-${timeOfDay}`;
    const query = unsplashQueries[queryKey] || 'weather,landscape';
    
    // Use local images in assets/backgrounds
    bgUrl = `assets/backgrounds/${queryKey}.jpg`;

    // Alternative: gradients if images fail
    const gradients = {
        'clear-day': 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        'clear-night': 'linear-gradient(to top, #09203f 0%, #537895 100%)',
        'clouds-day': 'linear-gradient(to top, #8e9eab 0%, #eef2f3 100%)',
        'clouds-night': 'linear-gradient(to right, #434343 0%, black 100%)',
        'rain-day': 'linear-gradient(to bottom, #757f9a, #d7dde8)',
        'rain-night': 'linear-gradient(to bottom, #232526, #414345)',
        'snow-day': 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
        'snow-night': 'linear-gradient(to top, #141e30, #243b55)',
        'haze-day': 'linear-gradient(to right, #BBD2C5, #536976)',
        'haze-night': 'linear-gradient(to bottom, #3E5151, #DECBA4)',
        'thunderstorm-day': 'linear-gradient(to bottom, #4b6cb7, #182848)',
        'thunderstorm-night': 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'
    };

    // Preload image
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
        document.body.style.backgroundImage = `url('${bgUrl}')`;
    };
    img.onerror = () => {
        document.body.style.backgroundImage = gradients[queryKey] || gradients['clear-day'];
    };
}
