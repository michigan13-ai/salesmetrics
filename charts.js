const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function createSvg(width, height, inner) {
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">${inner}</svg>`;
}

export function lineChart(data) {
  const width = 620;
  const height = 240;
  const padding = 26;
  const max = Math.max(...data.map((item) => item.value));
  const min = Math.min(...data.map((item) => item.value));
  const range = Math.max(max - min, 1);

  const points = data
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - ((item.value - min) / range) * (height - padding * 2);
      return { ...item, x, y };
    });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const guides = Array.from({ length: 4 }, (_, index) => {
    const y = padding + index * ((height - padding * 2) / 3);
    return `<line x1="${padding}" x2="${width - padding}" y1="${y}" y2="${y}" class="chart-grid" />`;
  }).join("");

  const labels = points
    .map(
      (point) =>
        `<g><text x="${point.x}" y="${height - 8}" text-anchor="middle" class="chart-label">${point.label}</text></g>`
    )
    .join("");

  const dots = points
    .map(
      (point) =>
        `<g><circle cx="${point.x}" cy="${point.y}" r="4.5" class="chart-dot" /><title>${point.label}: ${currencyFormat.format(
          point.value * 1000
        )}</title></g>`
    )
    .join("");

  return createSvg(
    width,
    height,
    `${guides}<path d="${area}" class="chart-area" /><path d="${path}" class="chart-line" />${dots}${labels}`
  );
}

export function groupedBars(data, leftKey, rightKey) {
  const max = Math.max(...data.flatMap((item) => [item[leftKey], item[rightKey]]));

  return `
    <div class="grouped-bars">
      ${data
        .map(
          (item) => `
            <div class="group-row">
              <div class="group-row__label">${item.label}</div>
              <div class="group-row__bars">
                <div class="group-row__bar group-row__bar--left" style="width:${(item[leftKey] / max) * 100}%">
                  <span>${item[leftKey]}</span>
                </div>
                <div class="group-row__bar group-row__bar--right" style="width:${(item[rightKey] / max) * 100}%">
                  <span>${item[rightKey]}</span>
                </div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export function donutChart(data) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = data
    .map((item) => {
      const length = (item.value / total) * circumference;
      const segment = `
        <circle
          class="donut-segment"
          cx="100"
          cy="100"
          r="${radius}"
          stroke="${item.color}"
          stroke-dasharray="${length} ${circumference - length}"
          stroke-dashoffset="${-offset}"
        >
          <title>${item.label}: ${item.value}</title>
        </circle>
      `;
      offset += length;
      return segment;
    })
    .join("");

  return `
    <div class="donut">
      <svg viewBox="0 0 200 200">
        <circle class="donut-base" cx="100" cy="100" r="${radius}"></circle>
        ${segments}
      </svg>
      <div class="donut-center">
        <strong>${total}</strong>
        <span>Total lots</span>
      </div>
    </div>
  `;
}

export function miniBars(data, valueKey = "value") {
  const max = Math.max(...data.map((item) => item[valueKey]));
  return `
    <div class="mini-bars">
      ${data
        .map(
          (item) => `
            <div class="mini-bars__item">
              <div class="mini-bars__meta">
                <span>${item.label}</span>
                <strong>${item[valueKey]}${valueKey === "value" ? "%" : ""}</strong>
              </div>
              <div class="mini-bars__track">
                <div class="mini-bars__fill" style="width:${(item[valueKey] / max) * 100}%"></div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export function dualTrend(data) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const maxEngagement = Math.max(...data.map((item) => item.engagement));

  return `
    <div class="dual-trend">
      ${data
        .map(
          (item) => `
            <div class="dual-trend__row">
              <span class="dual-trend__label">${item.label}</span>
              <div class="dual-trend__bars">
                <div class="dual-trend__bar dual-trend__bar--engagement" style="width:${(item.engagement / maxEngagement) * 100}%">
                  ${item.engagement}%
                </div>
                <div class="dual-trend__bar dual-trend__bar--revenue" style="width:${(item.revenue / maxRevenue) * 100}%">
                  $${item.revenue}K
                </div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}
