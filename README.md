# What Should I Wear?

CCT360 Project 2 - Data as Experience
by Layla & Hannah

live site: https://laylajazairy24.github.io/what-should-i-wear/
repo: https://github.com/laylajazairy24/what-should-i-wear

## about

Our website picks an outfit for you based on the live weather. You choose a city (Toronto, Paris, Dubai, or search any city) and the page changes depending on the temperature, the sky and the wind.

We wanted the weather data to actually change the design instead of just showing numbers, like a weather app would.

## what the data changes

- **temperature** -> background colour (blue under 10°C, pink 10-19°C, peach 20°C+) and which outfit shows up
- **weather code** -> the accessory (sunglasses, bag, umbrella or scarf) and the message
- **wind speed** -> how far the hearts move + how loud the wind chimes are (volume = wind / 50)

## things you can do

- click a city or search for one
- shuffle the outfit
- switch between °C and °F
- refresh the weather
- play/pause the wind chimes
- keyboard shortcuts: ← → shuffle, F = unit, S = sound, R = refresh

## files

```
index.html
style.css
script.js
images/   (6 outfits + 4 accessories)
audio/    wind-chimes.wav
```

## how it works (quick version)

We use `fetch()` inside an `async` function to get the JSON from the Open-Meteo API, then we read `data.current.temperature_2m`, `weather_code` and `wind_speed_10m`. If/else statements decide the colour, outfit and accessory. A for loop moves the hearts with `style.transform`. The search box uses the Open-Meteo geocoding API to get the coordinates of a city.

If the fetch fails the page shows a message instead of breaking.

## who did what

- Layla: main website (HTML, CSS, JS, API fetch, data -> design logic), GitHub Pages
- Hannah: city search, keyboard shortcuts, cursor glow + outfit fade, outfit pictures, slide deck
- both: video + testing

## limitations

- the weather only updates when you click refresh or pick a city, not by itself
- only 2 outfits for each temperature range
- the search just takes the first result (so "Paris" could end up being Paris, Texas lol)
- the outfit pictures arent our own drawings
- the wind chime sound is a simple placeholder tone

## credits

- weather data: [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0)
- fonts: Pacifico & Quicksand from Google Fonts
- outfit + accessory images (found on Pinterest):
  - outfit-cold-1: [(https://share.google/iqxfFcDqeqvkiyVSD)]
  - outfit-cold-2: [https://www.instagram.com/p/DUm-yitjXTh/?utm_source=ig_web_button_share_sheet]
  - outfit-mild-1: [https://pin.it/6fTicNpzQ]
  - outfit-mild-2: [https://ava-be.com/en-world/products/gilet-suzanne-rouge]
  - outfit-warm-1: [https://www.instagram.com/p/DXPYqPvDRxC/]
  - outfit-warm-2: [https://www.tiktok.com/@jennywalshhh/video/7664670606142508290]
  - accessories: [https://ca.pinterest.com/pin/4606971429635803392/]
- wind chime sound: generated tone 
- slide illustrations: Canva template



