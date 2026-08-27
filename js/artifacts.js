document.addEventListener("DOMContentLoaded", async () => {
  const daedricGrid = document.getElementById("daedricGrid");
  const priestGrid = document.getElementById("priestGrid");

  try {
    const response = await fetch("../data/artifacts.json");
    const data = await response.json();

    if (data.daedric && daedricGrid) {
      renderCards(data.daedric, daedricGrid);
    }

    if (data.priestMasks && priestGrid) {
      renderCards(data.priestMasks, priestGrid);
    }
  } catch (error) {
    console.error("Ошибка загрузки артефактов из JSON:", error);
  }

  function renderCards(items, container) {
    container.innerHTML = items
      .map(
        (item) => `
            <div class="artifact-card">
                <div class="artifact-card__img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="artifact-card__img">
                </div>
                <h3 class="artifact-card__title">${item.name}</h3>
                <div class="artifact-card__meta">
                    <span>by: ${item.by}</span>
                    <span>type: ${item.type}</span>
                </div>
            </div>
        `,
      )
      .join("");
  }
});
