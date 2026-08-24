let magicData = {};
let shoutsData = [];
let historySlides = [];
let currentSlideIndex = 0;

const DEFAULT_STATE = {
  title: "schools",
  desc: "skyrim has five magic schools grouped under the mage constellation",
  spellName: "name",
  spellType: "type",
  spellDesc: "the text of the selected spell will appear here",
};

const schoolTitleElem = document.getElementById("schoolTitle");
const schoolDescElem = document.getElementById("schoolDesc");
const spellNameElem = document.getElementById("spellName");
const spellTypeElem = document.getElementById("spellType");
const spellDescElem = document.getElementById("spellDesc");
const spellsListElem = document.getElementById("spellsList");
const schoolBtns = document.querySelectorAll(".school_btn");

const shoutDragonWordElem = document.getElementById("shoutDragonWord");
const shoutTranslationElem = document.getElementById("shoutTranslation");
const shoutDescElem = document.getElementById("shoutDesc");
const shoutsListElem = document.getElementById("shoutsList");

const headerElem = document.querySelector(".header");
const heroElem = document.querySelector(".hero");

const historyTitleElem = document.getElementById("historyTitle");
const historyDescElem = document.getElementById("historyDesc");
const historyImageElem = document.getElementById("historyImage");
const sliderPrevBtn = document.getElementById("sliderPrev");
const sliderNextBtn = document.getElementById("sliderNext");

async function init() {
  setDefaultState();

  try {
    const spellsResponse = await fetch("./data/spells.json");
    if (spellsResponse.ok) {
      magicData = await spellsResponse.json();
    }

    const shoutsResponse = await fetch("./data/shouts.json");
    if (shoutsResponse.ok) {
      const shoutsJson = await shoutsResponse.json();
      shoutsData = shoutsJson.shouts || [];
      renderShouts(shoutsData);
    }

    const historyResponse = await fetch("./data/history.json");
    if (historyResponse.ok) {
      const historyJson = await historyResponse.json();
      historySlides = historyJson.slides || [];
      if (historySlides.length > 0) {
        updateSlide(currentSlideIndex, false);
      }
    }
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

function setDefaultState() {
  if (schoolTitleElem) schoolTitleElem.textContent = DEFAULT_STATE.title;
  if (schoolDescElem) schoolDescElem.textContent = DEFAULT_STATE.desc;

  if (spellNameElem) {
    spellNameElem.textContent = DEFAULT_STATE.spellName;
    spellNameElem.classList.remove("active");
  }
  if (spellTypeElem) spellTypeElem.textContent = DEFAULT_STATE.spellType;
  if (spellDescElem) spellDescElem.textContent = DEFAULT_STATE.spellDesc;

  if (spellsListElem) spellsListElem.innerHTML = "";
  schoolBtns.forEach((btn) => btn.classList.remove("active"));
}

function renderSpells(schoolKey) {
  const school = magicData[schoolKey];
  if (!school || !spellsListElem) return;

  if (schoolTitleElem) schoolTitleElem.textContent = schoolKey.toLowerCase();
  if (schoolDescElem) schoolDescElem.textContent = school.desc.toLowerCase();

  spellsListElem.innerHTML = "";

  school.spells.forEach((spell) => {
    const card = document.createElement("div");
    card.classList.add("spell_card");
    card.innerHTML = `
            <span class="card_name">${spell.name.toLowerCase()}</span>
            <span class="card_type">${spell.type.toLowerCase()}</span>
        `;

    card.addEventListener("click", () => {
      document
        .querySelectorAll("#spellsList .spell_card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      if (spellNameElem) {
        spellNameElem.textContent = spell.name.toLowerCase();
        spellNameElem.classList.add("active");
      }
      if (spellTypeElem) spellTypeElem.textContent = spell.type.toLowerCase();
      if (spellDescElem) spellDescElem.textContent = spell.desc.toLowerCase();
    });

    spellsListElem.appendChild(card);
  });

  spellsListElem.scrollTop = 0;

  if (school.spells.length > 0 && spellsListElem.children[0]) {
    spellsListElem.children[0].click();
  }
}

function renderShouts(shouts) {
  if (!shoutsListElem) return;
  shoutsListElem.innerHTML = "";

  shouts.forEach((shout) => {
    const card = document.createElement("div");
    card.classList.add("spell_card");
    card.innerHTML = `<span class="card_name">${shout.name.toLowerCase()}</span>`;

    card.addEventListener("click", () => {
      document
        .querySelectorAll("#shoutsList .spell_card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      if (shoutDragonWordElem) {
        shoutDragonWordElem.textContent = shout.dragonWord.toLowerCase();
        shoutDragonWordElem.classList.add("dragon-runes");
        shoutDragonWordElem.classList.add("active");
      }
      if (shoutTranslationElem)
        shoutTranslationElem.textContent = shout.translation.toLowerCase();
      if (shoutDescElem) shoutDescElem.textContent = shout.desc.toLowerCase();
    });

    shoutsListElem.appendChild(card);
  });

  if (shoutsListElem.children[0]) {
    shoutsListElem.children[0].click();
  }
}

function updateSlide(index, animate = true) {
  const slide = historySlides[index];
  if (!slide || !historyTitleElem || !historyDescElem || !historyImageElem)
    return;

  if (!animate) {
    historyTitleElem.textContent = slide.title.toLowerCase();
    historyDescElem.textContent = slide.desc.toLowerCase();
    historyImageElem.src = slide.image;
    return;
  }

  historyTitleElem.classList.add("fade-out");
  historyDescElem.classList.add("fade-out");
  historyImageElem.classList.add("fade-out");

  setTimeout(() => {
    historyTitleElem.textContent = slide.title.toLowerCase();
    historyDescElem.textContent = slide.desc.toLowerCase();
    historyImageElem.src = slide.image;

    historyTitleElem.classList.remove("fade-out");
    historyDescElem.classList.remove("fade-out");
    historyImageElem.classList.remove("fade-out");
  }, 300);
}

if (sliderPrevBtn && sliderNextBtn) {
  sliderPrevBtn.addEventListener("click", () => {
    currentSlideIndex =
      (currentSlideIndex - 1 + historySlides.length) % historySlides.length;
    updateSlide(currentSlideIndex, true);
  });

  sliderNextBtn.addEventListener("click", () => {
    currentSlideIndex = (currentSlideIndex + 1) % historySlides.length;
    updateSlide(currentSlideIndex, true);
  });
}

schoolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    schoolBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const schoolKey = btn.getAttribute("data-school");
    renderSpells(schoolKey);
  });
});

if (heroElem && headerElem) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          headerElem.classList.remove("header-hidden");
        } else {
          headerElem.classList.add("header-hidden");
        }
      });
    },
    { threshold: 0.5 },
  );

  heroObserver.observe(heroElem);
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in-element").forEach((elem) => {
  observer.observe(elem);
});

init();


document.addEventListener("DOMContentLoaded", () => {
  const trailerPoster = document.getElementById("trailerPoster");
  const trailerIframe = document.getElementById("trailerIframe");

  if (trailerPoster && trailerIframe) {
    trailerPoster.addEventListener("click", () => {
      trailerIframe.src =
        "https://www.youtube.com/embed/t-_56Ouy8II?autoplay=1&si=Ok0sbYur3LyQyQJq";
      trailerPoster.classList.add("hidden");
    });
  }
});