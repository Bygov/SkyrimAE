document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("timelineContainer");
  const svg = document.getElementById("timelineSvg");
  const nodesContainer = document.getElementById("timelineNodes");
  const headerElem = document.querySelector(".header");

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

  const xPattern = [
    38, 62, 45, 55, 33, 67, 40, 60, 48, 52, 35, 65, 42, 58, 37, 63, 46, 54, 39,
    61,
  ];

  let cachedEvents = [];

  try {
    const response = await fetch("../data/lore.json");
    if (!response.ok) throw new Error("Network response was not ok");
    cachedEvents = await response.json();
    renderTimeline(cachedEvents);
  } catch (error) {
    console.error("Ошибка при загрузке событий:", error);
  }

  function renderTimeline(events) {
    if (!container || !svg || !nodesContainer) return;

    const containerWidth = container.clientWidth;
    const totalEvents = events.length;
    const verticalStep = 100;
    const startY = 120;
    const totalHeight = totalEvents * verticalStep + 200;

    container.style.height = `${totalHeight}px`;

    let pathD = "";
    nodesContainer.innerHTML = "";

    let prevX = 0;
    let prevY = 0;

    events.forEach((event, index) => {
      const xPercent = xPattern[index % xPattern.length];
      const xPx = (containerWidth * xPercent) / 100;
      const yPx = startY + index * verticalStep;

      if (index === 0) {
        pathD += `M ${xPx} ${yPx}`;
      } else {
        const direction = index % 2 === 0 ? 1 : -1;

        const uniqueScale = 0.18 + (index % 4) * 0.08;2
        const loopOffset = containerWidth * uniqueScale;

        const cp1x = prevX + direction * loopOffset * 0.9;
        const cp1y = prevY + (yPx - prevY) * (0.25 + (index % 3) * 0.1);

        const cp2x = xPx + direction * loopOffset * 1.1;
        const cp2y = yPx - (yPx - prevY) * (0.25 + ((index + 1) % 3) * 0.1);

        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xPx} ${yPx}`;
      }

      prevX = xPx;
      prevY = yPx;

      const sideClass =
        xPercent > 50 ? "timeline-popover--left" : "timeline-popover--right";

      const pointEl = document.createElement("div");
      pointEl.className = "timeline-point";
      pointEl.style.left = `${xPercent}%`;
      pointEl.style.top = `${yPx}px`;

      pointEl.innerHTML = `
        <div class="timeline-popover ${sideClass}">
            <div class="timeline-popover__date">${event.date}</div>
            <div class="timeline-popover__title">${event.title}</div>
            <div class="timeline-popover__desc">${event.desc}</div>
        </div>
      `;

      nodesContainer.appendChild(pointEl);
    });

    svg.innerHTML = `<path class="timeline-line" d="${pathD}" />`;
  }

  window.addEventListener("resize", () => {
    if (cachedEvents.length > 0) {
      renderTimeline(cachedEvents);
    }
  });
});
