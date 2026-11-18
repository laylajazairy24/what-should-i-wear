// ===============================
// WHAT SHOULD I WEAR? — script.js
// Live weather (Open-Meteo API) dresses the page.
// ===============================


// ---------- 1. CITIES (arrays) ----------
// same index = same city (0 = Toronto, 1 = Paris, 2 = Dubai, 3 = last searched)
let cityNames  = ["Toronto", "Paris", "Dubai", "Search"];
let latitudes  = [43.65, 48.85, 25.20, 0];
let longitudes = [-79.38, 2.35, 55.27, 0];


// ---------- 2. OUTFIT IMAGES (arrays) ----------
// 2 outfits for each temperature mood. "shuffle" switches between them.
let coldOutfits = ["images/outfit-cold-1.png", "images/outfit-cold-2.png"];
let mildOutfits = ["images/outfit-mild-1.png", "images/outfit-mild-2.png"];
let warmOutfits = ["images/outfit-warm-1.png", "images/outfit-warm-2.png"];


// ---------- 3. VARIABLES THAT REMEMBER THE CURRENT STATE ----------
let currentCity = 0;        // which city is picked
let outfitIndex = 0;        // which outfit in the list is showing
let currentOutfits = mildOutfits;
let temperature = 0;        // in °C, straight from the API
let wind = 0;               // in km/h, straight from the API
let showFahrenheit = false; // °C / °F toggle


// ---------- 4. GRAB THE HTML ELEMENTS ----------
let outfitImg    = document.getElementById("outfit");
let accessoryImg = document.getElementById("accessory");
let hearts       = document.getElementsByClassName("heart");
let cityButtons  = document.getElementsByClassName("city-btn");
let player       = document.getElementById("player");

let shuffleBtn = document.getElementById("shuffleBtn");
let unitBtn    = document.getElementById("unitBtn");
let refreshBtn = document.getElementById("refreshBtn");
let soundBtn   = document.getElementById("soundBtn");

shuffleBtn.addEventListener("click", shuffleOutfit);
unitBtn.addEventListener("click", switchUnit);
refreshBtn.addEventListener("click", getWeather);
soundBtn.addEventListener("click", toggleSound);


// ---------- 5. FETCH THE LIVE WEATHER (async/await) ----------
async function getWeather() {
  let apiURL = "https://api.open-meteo.com/v1/forecast?latitude=" + latitudes[currentCity] +
               "&longitude=" + longitudes[currentCity] +
               "&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto";

  document.querySelector("#message").textContent = "Checking the sky... ☁️";

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();

    // the 3 values we use from the JSON
    temperature = data.current.temperature_2m;
    let weatherCode = data.current.weather_code;
    wind = data.current.wind_speed_10m;

    // use the data to change the page
    showTemperature();
    pickOutfit();
    pickAccessory(weatherCode);
    moveHearts();
    setSoundVolume();

    document.querySelector("#wind").textContent = "wind: " + wind + " km/h";
    document.querySelector("#updated").textContent = "last updated: " + data.current.time + " (local time)";

  } catch (error) {
    console.error("Error:", error);
    document.querySelector("#message").textContent = "The sky is shy right now ☁️ try refresh!";
  }
}


// ---------- 6. DATA → TEXT: temperature (°C or °F) ----------
function showTemperature() {
  if (showFahrenheit === true) {
    let fahrenheit = Math.round(temperature * 9 / 5 + 32);
    document.querySelector("#temperature").textContent = fahrenheit + "°F";
  } else {
    document.querySelector("#temperature").textContent = Math.round(temperature) + "°C";
  }
}


// ---------- 7. DATA → COLOUR + IMAGE: temperature picks the outfit + background ----------
function pickOutfit() {
  if (temperature < 10) {
    document.body.className = "cold";
    currentOutfits = coldOutfits;
  } else if (temperature < 20) {
    document.body.className = "mild";
    currentOutfits = mildOutfits;
  } else {
    document.body.className = "warm";
    currentOutfits = warmOutfits;
  }

  outfitIndex = 0;
  swapOutfitImage(currentOutfits[outfitIndex]);
}


// ---------- 8. DATA → IMAGE + TEXT: weather type picks the accessory ----------
// Open-Meteo weather codes: 0 = clear, 1-3 = cloudy, 45-48 = fog,
// 51-67 = drizzle/rain, 71-77 = snow, 80-82 = showers, 85-86 = snow showers, 95+ = storm
function pickAccessory(code) {
  let type = "";
  let message = "";

  if (code === 0) {
    type = "sunny";
    accessoryImg.src = "images/accessory-sunny.png";
    message = "Sunnies on, main character energy 🕶️";
  } else if (code <= 48) {
    type = "cloudy";
    accessoryImg.src = "images/accessory-cloudy.png";
    message = "Soft grey sky, grab your cutest bag 👜";
  } else if (code <= 67 || (code >= 80 && code <= 82) || code >= 95) {
    type = "rainy";
    accessoryImg.src = "images/accessory-rainy.png";
    message = "Rain alert! Don't forget your umbrella ☂️";
  } else {
    type = "snowy";
    accessoryImg.src = "images/accessory-snowy.png";
    message = "It's snowing, scarf & beanie time ❄️";
  }

  document.querySelector("#weather-type").textContent = "the sky is " + type;
  document.querySelector("#message").textContent = message;
}


// ---------- 9. DATA → MOTION: wind speed moves the hearts ----------
function moveHearts() {
  let distance = Math.min(wind * 5, 120);    // wind 20 km/h → 100px, max 120px so the hearts stay in the box
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.transform = "translateX(" + distance + "px) rotate(" + (wind * 10) + "deg)";
  }
}


// ---------- 10. DATA → SOUND: wind speed sets the chime volume ----------
function setSoundVolume() {
  let volume = wind / 50;              // 20 km/h → 0.4
  player.volume = Math.min(volume, 1); // volume must stay between 0 and 1
}


// ---------- 11. INTERACTION: change city ----------
function changeCity(index) {
  currentCity = index;
  document.querySelector("#city-name").textContent = cityNames[currentCity];

  // clear the highlight on every button
  for (let i = 0; i < cityButtons.length; i++) {
    cityButtons[i].className = "city-btn";
  }
  // searched cities (slot 3) have no button, so only highlight if one exists
  if (cityButtons[currentCity]) {
    cityButtons[currentCity].className = "city-btn active";
  }

  getWeather();
}


// ---------- 12. INTERACTION: shuffle outfit ----------
// OUTFIT SWAP ANIMATION: fade + slide out, change the image while hidden,
// then the CSS transition brings it back in (see #outfit.fade-out in style.css)
let swapTimer = null;

function swapOutfitImage(newSrc) {
  if (outfitImg.getAttribute("src") === newSrc) return;   // already showing it

  clearTimeout(swapTimer);                 // a quick second click restarts the swap
  outfitImg.classList.add("fade-out");

  swapTimer = setTimeout(() => {
    outfitImg.src = newSrc;
    outfitImg.classList.remove("fade-out");   // fades back in
  }, 400);                                    // matches the 0.4s CSS transition
}

function shuffleOutfit() {
  outfitIndex = outfitIndex + 1;
  if (outfitIndex >= currentOutfits.length) {
    outfitIndex = 0;
  }
  swapOutfitImage(currentOutfits[outfitIndex]);
}

// go back one outfit (used by the left arrow key)
function prevOutfit() {
  outfitIndex = (outfitIndex - 1 + currentOutfits.length) % currentOutfits.length;
  swapOutfitImage(currentOutfits[outfitIndex]);
}


// ---------- 13. INTERACTION: °C / °F ----------
function switchUnit() {
  if (showFahrenheit === true) {
    showFahrenheit = false;
    unitBtn.textContent = "switch to °F";
  } else {
    showFahrenheit = true;
    unitBtn.textContent = "switch to °C";
  }
  showTemperature();
}


// ---------- 14. INTERACTION: play / pause the wind chimes ----------
// (browsers block sound until the user clicks, so we need a button)
function toggleSound() {
  if (player.paused === true) {
    player.play();
    soundBtn.textContent = "pause wind chimes 🎐";
  } else {
    player.pause();
    soundBtn.textContent = "play wind chimes 🎐";
  }
}


// ---------- 15. LOCATION SEARCH (Open-Meteo geocoding) ----------
// slot 3 in the city arrays holds the last searched place
const CUSTOM_CITY = 3;

async function searchCity(query) {
  const status = document.querySelector("#searchStatus");
  status.textContent = "looking for " + query + "...";

  try {
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(query) + "&count=1&language=en&format=json"
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      status.textContent = "couldn't find that place, try another name";
      return;
    }

    const place = data.results[0];
    cityNames[CUSTOM_CITY] = place.name + (place.country ? ", " + place.country : "");
    latitudes[CUSTOM_CITY] = place.latitude;
    longitudes[CUSTOM_CITY] = place.longitude;

    changeCity(CUSTOM_CITY);
    status.textContent = "showing " + place.name;

  } catch (error) {
    console.error("Search error:", error);
    status.textContent = "search didn't work, try again";
  }
}


// ---------- 16. KEYBOARD SHORTCUTS ----------
document.addEventListener("keydown", (e) => {
  // don't hijack typing in the search box
  if (e.target.tagName === "INPUT") return;

  if (e.key === "ArrowRight")               shuffleOutfit();
  else if (e.key === "ArrowLeft")           prevOutfit();
  else if (e.key === "f" || e.key === "F")  switchUnit();
  else if (e.key === "s" || e.key === "S")  toggleSound();
  else if (e.key === "r" || e.key === "R")  getWeather();
  else return;   // other keys: do nothing and don't block them

  e.preventDefault();   // stops the arrow keys from scrolling the page
});


// ---------- 17. SEARCH FORM ----------
const searchForm  = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();   // stop the page from reloading
  const query = searchInput.value.trim();
  if (query !== "") {
    searchCity(query);
  }
});


// ---------- 18. CURSOR-FOLLOWING GRADIENT ----------
// pointermove covers both mouse and touch
document.addEventListener("pointermove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.body.style.setProperty("--mx", x + "%");
  document.body.style.setProperty("--my", y + "%");
});


// ---------- START: load Toronto when the page opens ----------
changeCity(0);
