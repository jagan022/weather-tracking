const apiKey = "51bdab85678d497fb2e42321262804";

/* ============================= */
/*       LIVE WEATHER API        */
/* ============================= */

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    if (city === "") {
        result.innerHTML = "<p>⚠ Please enter a city name</p>";
        return;
    }

    result.innerHTML = "<p>⏳ Loading weather data...</p>";

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Invalid city check
        if (data.error) {
            result.innerHTML = `
                <div class="weather-card">
                    <h2>❌ City Not Found</h2>
                    <p>Please enter a valid city name.</p>
                </div>
            `;
            return;
        }

        result.innerHTML = `
            <div class="weather-card">
                <h2>📍 ${data.location.name}, ${data.location.country}</h2>
                <p>🌡 Temperature: ${data.current.temp_c} °C</p>
                <p>☁ Condition: ${data.current.condition.text}</p>
                <p>💧 Humidity: ${data.current.humidity}%</p>
                <p>🌬 Wind Speed: ${data.current.wind_kph} km/h</p>
                <p>📊 Pressure: ${data.current.pressure_mb} mb</p>
                <p>🕒 Local Time: ${data.location.localtime}</p>
            </div>
        `;

    } catch (error) {
        result.innerHTML = `
            <div class="weather-card">
                <h2>⚠ Error</h2>
                <p>Unable to fetch weather data.</p>
                <p>Please check your internet connection.</p>
            </div>
        `;
        console.log(error);
    }
}

/* ============================= */
/*     PAST 5 DAYS WEATHER API   */
/* ============================= */

async function getHistory() {
    const city = document.getElementById("historyCity").value.trim();
    const result = document.getElementById("historyResult");

    if (city === "") {
        result.innerHTML = "<p>⚠ Please enter a city name</p>";
        return;
    }

    result.innerHTML = "<p>⏳ Loading past 5 days weather...</p>";

    try {
        let output = "";

        for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toISOString().split("T")[0];

            const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${formattedDate}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                result.innerHTML = `
                    <div class="weather-card">
                        <h2>❌ City Not Found</h2>
                        <p>Please enter a valid city name.</p>
                    </div>
                `;
                return;
            }

            output += `
                <div class="weather-card">
                    <h3>📅 ${formattedDate}</h3>
                    <p>🌡 Avg Temperature: ${data.forecast.forecastday[0].day.avgtemp_c} °C</p>
                    <p>☁ Condition: ${data.forecast.forecastday[0].day.condition.text}</p>
                    <p>💧 Humidity: ${data.forecast.forecastday[0].day.avghumidity}%</p>
                    <p>🌧 Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                </div>
            `;
        }

        result.innerHTML = output;

    } catch (error) {
        result.innerHTML = `
            <div class="weather-card">
                <h2>⚠ Error</h2>
                <p>Unable to fetch historical weather data.</p>
            </div>
        `;
        console.log(error);
    }
}

/* ============================= */
/*       DATE & TIME SYSTEM      */
/* ============================= */

function updateDateTime() {
    const dateTimeBox = document.getElementById("dateTime");

    if (!dateTimeBox) return;

    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    dateTimeBox.innerHTML = `📅 ${date}<br>🕒 ${time}`;
}

function goBack() {
    window.history.back();
}

setInterval(updateDateTime, 1000);
updateDateTime();