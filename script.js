const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const unitToggle = document.createElement('button');

let isCelsius = true;
const api_key = "dc7c301e2e2a07264a82901d7e089ecf";

// Add unit toggle button
tempUnitToggle();

function tempUnitToggle() {
    unitToggle.textContent = "°F";
    unitToggle.id = "unitToggle";
    unitToggle.style.marginTop = "10px";
    unitToggle.style.cursor = "pointer";
    unitToggle.addEventListener("click", () => {
        isCelsius = !isCelsius;
        unitToggle.textContent = isCelsius ? "°F" : "°C";
        const tempValue = parseFloat(temperature.textContent);
        if (!isNaN(tempValue)) {
            temperature.innerHTML = isCelsius 
                ? `${Math.round((tempValue - 32) * (5 / 9))}°C`
                : `${Math.round((tempValue * 9/5) + 32)}°F`;
        }
    });
    document.body.appendChild(unitToggle);
}

function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const weather_data = JSON.parse(xhr.responseText);
            
            location_not_found.style.display = "none";
            weather_body.style.display = "flex";
            
            let tempCelsius = Math.round(weather_data.main.temp - 273.15);
            temperature.innerHTML = `${tempCelsius}°C`;
            description.innerHTML = `${weather_data.weather[0].description}`;
            humidity.innerHTML = `${weather_data.main.humidity}%`;
            wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

            switch(weather_data.weather[0].main){
                case 'Clouds':
                    weather_img.src = "/assets/cloud.png";
                    break;
                case 'Clear':
                    weather_img.src = "/assets/clear.png";
                    break;
                case 'Rain':
                    weather_img.src = "/assets/rain.png";
                    break;
                case 'Mist':
                    weather_img.src = "/assets/mist.png";
                    break;
                case 'Snow':
                    weather_img.src = "/assets/snow.png";
                    break;
            }
        } else {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
        }
    };
    
    xhr.send();
}

// Fetch weather using Geolocation API
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
            
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const weather_data = JSON.parse(xhr.responseText);
                    checkWeather(weather_data.name);
                }
            };
            
            xhr.send();
        }, () => {
            alert("Location access denied. Please enter a city manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Load default weather on page load
window.onload = fetchWeatherByLocation;

searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});
