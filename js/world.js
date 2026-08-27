let worldGeneralInfo = {
  name: "SKYRIM",
  region: "TAMRIEL",
  info: "SKYRIM IS THE HARSH, MAJESTIC NORTHERN PROVINCE OF TAMRIEL AND HOME TO THE NORDS. FAMOUS FOR ITS SNOWY PEAKS, DENSE FORESTS, AND ANCIENT DRAGON RUINS, IT IS A LEGENDARY LAND OF EPIC ADVENTURE AND RUGGED BEAUTY",
  image: "../images/world/mini/skyrim.webp",
};
let citiesData = {};

const cityTitleElem = document.getElementById("info-name");
const citySubtitleElem = document.getElementById("info-region");
const cityDescElem = document.getElementById("info-desc");
const cityImageFrame = document.getElementById("info-image");

const cityPins = document.querySelectorAll(".city-pin");
const mapWrapper = document.querySelector(".map-image-wrapper");
const headerElem = document.querySelector(".header");

function showSkyrimInfo() {
  if (cityTitleElem) cityTitleElem.textContent = worldGeneralInfo.name;
  if (citySubtitleElem) citySubtitleElem.textContent = worldGeneralInfo.region;
  if (cityDescElem) {
    cityDescElem.textContent =
      worldGeneralInfo.info || worldGeneralInfo.desc || "";
  }
  if (cityImageFrame) {
    cityImageFrame.style.backgroundImage = `url('${worldGeneralInfo.image}')`;
  }
}

showSkyrimInfo();

async function initWorldMap() {
  try {
    const response = await fetch("../data/world.json");
    if (response.ok) {
      const worldJson = await response.json();

      if (worldJson.length > 0 && worldJson[0]) {
        worldGeneralInfo = worldJson[0];
        showSkyrimInfo();
      }

      if (worldJson.length > 1 && worldJson[1].cities) {
        citiesData = worldJson[1].cities;
      }
    }
  } catch (error) {
    console.error("Error loading world.json:", error);
  }
}

function updateCityInfo(cityKey) {
  const data = citiesData[cityKey];
  if (!data) return;

  if (cityTitleElem) cityTitleElem.textContent = data.title;
  if (citySubtitleElem) citySubtitleElem.textContent = data.subtitle;
  if (cityDescElem) cityDescElem.textContent = data.desc;
  if (cityImageFrame) {
    cityImageFrame.style.backgroundImage = `url('${data.image}')`;
  }
}

cityPins.forEach((pin) => {
  pin.addEventListener("click", (e) => {
    e.stopPropagation();
    cityPins.forEach((p) => p.classList.remove("active"));
    pin.classList.add("active");

    const cityKey = pin.getAttribute("data-city");
    updateCityInfo(cityKey);
  });
});

if (mapWrapper) {
  mapWrapper.addEventListener("click", () => {
    cityPins.forEach((p) => p.classList.remove("active"));
    showSkyrimInfo();
  });
}

initWorldMap();

if (headerElem) {
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 50) {
      headerElem.classList.add("header-hidden");
    } else {
      headerElem.classList.remove("header-hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
