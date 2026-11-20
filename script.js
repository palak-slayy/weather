
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const statusText = document.getElementById("status");
const weatherCard = document.getElementById("weather");

// Search city
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        statusText.textContent = "Please enter a city name!";
        weatherCard.hidden = true;
        return;
    }

    statusText.textContent = "Loading weather...";
    weatherCard.hidden = true;

    try {

        // Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find city");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        // Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Display information
        document.getElementById("cityName").textContent =
            location.name + ", " + location.country;

        document.getElementById("temperature").textContent =
            current.temperature_2m + "°C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        document.getElementById("condition").textContent =
            getCondition(current.weather_code);

        document.getElementById("weatherIcon").textContent =
            getIcon(current.weather_code, current.is_day);

        statusText.textContent = "";
        weatherCard.hidden = false;

    } catch (error) {

        statusText.textContent = error.message;
        weatherCard.hidden = true;

    }
}

// Weather condition
function getCondition(code) {

    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown Weather";
}

// Weather icon
function getIcon(code, isDay) {

    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";

    return "🌍";
}

// Button click
searchBtn.addEventListener("click", getWeather);

// Enter key
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
