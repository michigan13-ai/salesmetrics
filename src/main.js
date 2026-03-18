import { appData } from "./mockData.js";
import { donutChart, groupedBars, lineChart, miniBars } from "./charts.js";

const app = document.querySelector("#app");

const routes = [
  { id: "overview", label: "Home" },
  { id: "revenue", label: "Revenue" },
  { id: "buyers", label: "Buyers" },
  { id: "campaigns", label: "Campaigns" },
  { id: "inventory", label: "Inventory" },
  { id: "team", label: "Team" }
];

const buyersState = {
  startYear: 2024,
  endYear: 2026,
  sortMetric: "revenue",
  search: ""
};

const inventoryState = {
  soldView: "year"
};

function searchIndex() {
  return [
    ...appData.overview.heroMetrics.map((item) => ({
      label: item.label,
      value: `${item.value} ${item.note}`,
      route: item.route
    })),
    ...appData.buyers.topStates.map((item) => ({
      label: `${item.state} buyers`,
      value: `${item.sales} sales and ${item.revenueLabel} revenue`,
      route: "buyers"
    })),
    ...appData.campaigns.history.map((item) => ({
      label: item.name,
      value: `${item.revenueLabel} revenue, ${item.sales} sales, ${item.openRate}% opens`,
      route: "campaigns"
    })),
    ...appData.revenue.yearly.map((item) => ({
      label: `${item.year} revenue`,
      value: `${item.revenueLabel} on ${item.lotsSold} lots sold`,
      route: "revenue"
    })),
    ...appData.inventory.summary.map((item) => ({
      label: item.label,
      value: item.value,
      route: "inventory"
    })),
    ...appData.team.reps.map((item) => ({
      label: item.name,
      value: `${item.revenueLabel} revenue and ${item.deals} deals`,
      route: "team"
    }))
  ];
}

function queryAssistant(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      title: "Quick search",
      description: appData.property.assistantLabel,
      matches: searchIndex().slice(0, 5)
    };
  }

  const matches = searchIndex()
    .map((item) => ({
      ...item,
      score: `${item.label} ${item.value}`.toLowerCase().includes(q) ? (item.label.toLowerCase().includes(q) ? 3 : 1) : 0
    }))
    .filter((item) => item.score > 0)
    .slice(0, 6);

  return {
    title: matches.length ? `Search results for "${query}"` : "No direct match found",
    description: matches.length
      ? "Open a page below or keep typing to narrow the result."
      : "This quick search is meant to replace a phone call for simple questions. The exact phrase may need more tagging or a future AI backend.",
    matches
  };
}

function currentRoute() {
  const route = window.location.hash.replace("#", "") || "overview";
  return routes.some((item) => item.id === route) ? route : "overview";
}

function money(value, suffix = "M") {
  return `$${value.toFixed(1)}${suffix}`;
}

function formatRevenueLabel(value) {
  if (value >= 1) {
    return `$${value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}M`;
  }

  return `$${(value * 1000).toFixed(0)}K`;
}

function buyerYearsInRange() {
  const start = Math.min(buyersState.startYear, buyersState.endYear);
  const end = Math.max(buyersState.startYear, buyersState.endYear);
  return appData.buyers.availableYears.filter((year) => year >= start && year <= end);
}

function buyerRangeStateSummary() {
  const totals = new Map();

  appData.buyers.byYear
    .filter((block) => buyerYearsInRange().includes(Number(block.year)))
    .forEach((block) => {
      block.states.forEach((state) => {
        const existing = totals.get(state.state) || {
          state: state.state,
          sales: 0,
          revenue: 0,
          avgPriceWeighted: 0
        };

        existing.sales += state.sales;
        existing.revenue += state.revenue;
        existing.avgPriceWeighted += state.avgPrice * state.sales;
        totals.set(state.state, existing);
      });
    });

  return [...totals.values()]
    .map((item) => ({
      ...item,
      avgPrice: item.sales ? item.avgPriceWeighted / item.sales : 0,
      revenueLabel: formatRevenueLabel(item.revenue),
      avgPriceLabel: `$${item.sales ? (item.avgPriceWeighted / item.sales).toFixed(0) : "0"}K`
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

function sortBuyerMetrics() {
  const metrics = [...appData.buyers.stateMetrics];
  return metrics.sort((left, right) => {
    if (buyersState.sortMetric === "buyers") return right.buyers - left.buyers;
    if (buyersState.sortMetric === "avgPrice") return right.avgPrice - left.avgPrice;
    if (buyersState.sortMetric === "closeRate") return right.closeRate - left.closeRate;
    return right.revenue - left.revenue;
  });
}

function filteredBuyerDirectory() {
  const query = buyersState.search.trim().toLowerCase();
  const rows = appData.buyers.buyerDirectory.filter((buyer) => {
    if (!query) return true;
    return [buyer.name, buyer.state, buyer.city, buyer.notes, buyer.lot].some((field) =>
      String(field).toLowerCase().includes(query)
    );
  });
  return rows.slice(0, 25);
}

function buyerRevenueRows(items) {
  const maxRevenue = Math.max(...items.map((item) => item.revenue), 1);
  return `
    <div class="origin-bars">
      ${items
        .map(
          (item) => `
            <div class="origin-bars__row">
              <div class="origin-bars__label">
                <strong>${item.state}</strong>
                <span>${item.sales} buyers</span>
              </div>
              <div class="origin-bars__track">
                <div class="origin-bars__fill" style="width:${(item.revenue / maxRevenue) * 100}%"></div>
                <span class="origin-bars__value">${item.revenueLabel}</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function inventorySoldRows() {
  const rows =
    inventoryState.soldView === "month"
      ? appData.inventory.soldHistory.monthly2026
      : inventoryState.soldView === "type"
        ? appData.inventory.soldHistory.byTypeYearly
        : appData.inventory.soldHistory.yearly;
  const max = Math.max(...rows.map((item) => item.sold), 1);

  return `
    <div class="origin-bars">
      ${rows
        .map(
          (item) => `
            <div class="origin-bars__row">
              <div class="origin-bars__label">
                <strong>${item.period || item.type}</strong>
                <span>Sold lots</span>
              </div>
              <div class="origin-bars__track">
                <div class="origin-bars__fill" style="width:${(item.sold / max) * 100}%"></div>
                <span class="origin-bars__value">${item.sold}</span>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buyerMap() {
  return `
    <div class="buyer-map">
      <svg viewBox="0 0 1000 560" class="buyer-map__svg" aria-label="Buyer origin map of the United States">
        <rect x="0" y="0" width="1000" height="560" rx="28" class="buyer-map__bg"></rect>
        ${Array.from({ length: 7 }, (_, index) => `<line x1="80" y1="${90 + index * 60}" x2="920" y2="${90 + index * 60}" class="buyer-map__grid"></line>`).join("")}
        ${Array.from({ length: 9 }, (_, index) => `<line x1="${120 + index * 90}" y1="70" x2="${120 + index * 90}" y2="500" class="buyer-map__grid"></line>`).join("")}
        <g class="buyer-map__hub" transform="translate(680, 168)">
          <circle r="26" class="buyer-map__hub-ring"></circle>
          <circle r="10" class="buyer-map__hub-dot"></circle>
          <text x="34" y="-2">Michigan Resort</text>
          <text x="34" y="18">All sites sold here</text>
        </g>
        ${appData.buyers.mapPins
          .map(
            (pin) => `
              <g class="buyer-link">
                <line x1="${pin.x * 10}" y1="${pin.y * 5.6}" x2="680" y2="168" class="buyer-link__line"></line>
              </g>
              <g class="buyer-pin" transform="translate(${pin.x * 10}, ${pin.y * 5.6})">
                <circle r="${8 + pin.buyers * 0.55}" class="buyer-pin__glow"></circle>
                <circle r="${4 + pin.buyers * 0.35}" class="buyer-pin__dot"></circle>
                <text x="${12 + pin.buyers * 0.25}" y="4" class="buyer-pin__label">${pin.city}</text>
                <title>${pin.city}, ${pin.state}: ${pin.buyers} buyers, ${pin.market}, ${pin.travel}</title>
              </g>
            `
          )
          .join("")}
      </svg>
      <div class="buyer-map__legend">
        <div>
          <strong>Buyer origin map</strong>
          <p>Each pin represents where buyers came from before purchasing a Michigan RV site. The center hub is the resort itself. Heavier clusters show the strongest feeder markets.</p>
        </div>
        <div class="buyer-map__legend-scale">
          <span><i class="scale scale--small"></i>1-3 buyers</span>
          <span><i class="scale scale--medium"></i>4-8 buyers</span>
          <span><i class="scale scale--large"></i>9+ buyers</span>
        </div>
      </div>
    </div>
  `;
}

function navMarkup(active) {
  return routes
    .map(
      (route) => `
        <button class="nav-link ${route.id === active ? "is-active" : ""}" data-route="${route.id}">
          ${route.label}
        </button>
      `
    )
    .join("");
}

function heroMetrics() {
  return appData.overview.heroMetrics
    .map(
      (metric) => `
        <button class="summary-card" data-route="${metric.route}">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <em class="delta delta--${metric.trend}">${metric.delta}</em>
          <p>${metric.note}</p>
        </button>
      `
    )
    .join("");
}

function overviewPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive overview</p>
          <h2>Today’s business in one view</h2>
        </div>
        <p class="section-copy">${appData.property.intro}</p>
      </div>
      <div class="summary-grid summary-grid--hero">
        ${heroMetrics()}
      </div>
    </section>

    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Revenue</p>
            <h3>2024 monthly revenue</h3>
          </div>
          <button class="ghost-link" data-route="revenue">Open revenue page</button>
        </div>
        <div class="chart-card">${lineChart(appData.revenue.currentYearMonthly)}</div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Buyer geography</p>
            <h3>Top states this year</h3>
          </div>
          <button class="ghost-link" data-route="buyers">Open buyers page</button>
        </div>
        <div class="rank-list">
          ${appData.buyers.topStates
            .slice(0, 5)
            .map(
              (item) => `
                <button class="rank-row" data-route="buyers">
                  <span>${item.state}</span>
                  <strong>${item.sales} sales</strong>
                  <small>${item.revenueLabel}</small>
                </button>
              `
            )
            .join("")}
        </div>
      </article>
    </section>

    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Campaigns</p>
            <h3>Best campaigns this year</h3>
          </div>
          <button class="ghost-link" data-route="campaigns">Open campaigns page</button>
        </div>
        <div class="rank-list">
          ${appData.campaigns.history
            .filter((item) => item.date.startsWith("2024"))
            .sort((left, right) => right.revenue - left.revenue)
            .slice(0, 5)
            .map(
              (item) => `
                <button class="rank-row" data-route="campaigns">
                  <span>${item.name}</span>
                  <strong>${item.revenueLabel}</strong>
                  <small>${item.sales} sales</small>
                </button>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Live sales operations</p>
            <h3>Calls, leads, and follow-up load</h3>
          </div>
          <button class="ghost-link" data-route="team">Open team page</button>
        </div>
        <div class="tile-grid">
          ${appData.liveOps.metrics
            .map(
              (item) => `
                <div class="tile">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                  <p>${item.subtext}</p>
                  <small>${item.delta}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function revenuePage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Revenue page</p>
          <h2>Revenue, pricing, and conversion performance</h2>
        </div>
        <p class="section-copy">Use this page when you want the full sales story by year, month, quarter, and pricing quality.</p>
      </div>
      <div class="summary-grid">
        ${appData.revenue.yearly
          .map(
            (item) => `
              <div class="summary-card summary-card--static">
                <span>${item.year}</span>
                <strong>${item.revenueLabel}</strong>
                <em class="delta">${item.yoy}</em>
                <p>${item.lotsSold} lots sold at ${money(item.avgSalePrice, "K")} average price</p>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Monthly trend</p>
            <h3>2024 monthly revenue</h3>
          </div>
        </div>
        <div class="chart-card">${lineChart(appData.revenue.currentYearMonthly)}</div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Quarterly pacing</p>
            <h3>Revenue vs goal</h3>
          </div>
        </div>
        ${groupedBars(appData.revenue.quarterly2024, "goal", "revenue")}
      </article>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Inventory flow</p>
            <h3>Listed lots vs sold lots</h3>
          </div>
        </div>
        ${groupedBars(appData.revenue.lotsMovement, "listed", "sold")}
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Conversion detail</p>
            <h3>Sales quality by year</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.revenue.yearly
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.year}</span>
                  <strong>${item.leadConversion}% lead to sale</strong>
                  <small>${item.tourConversion}% tour to sale</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function buyersPage() {
  const buyerRange = buyerRangeStateSummary();
  const sortedMetrics = sortBuyerMetrics();
  const buyerRows = filteredBuyerDirectory();

  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Buyer page</p>
          <h2>Buyer metrics</h2>
        </div>
        <p class="section-copy">This page tracks buyer origin, not where inventory exists. All inventory is at the Michigan campground, and this view shows which states and markets are sending buyers.</p>
      </div>
      ${buyerMap()}
    </section>
    <section class="page-grid">
      <div class="summary-grid">
        ${appData.buyers.summary
          .map(
            (item) => `
              <div class="summary-card summary-card--static">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <p>${item.note}</p>
              </div>
            `
          )
          .join("")}
      </div>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">State leaderboard</p>
            <h3>2024 buyer table</h3>
          </div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>State</th><th>Sales</th><th>Revenue</th><th>Avg Price</th></tr></thead>
            <tbody>
              ${appData.buyers.topStates
                .map(
                  (row) => `
                    <tr>
                      <td>${row.state}</td>
                      <td>${row.sales}</td>
                      <td>${row.revenueLabel}</td>
                      <td>${row.avgPriceLabel}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Regional mix</p>
            <h3>Current regional share</h3>
          </div>
        </div>
        ${miniBars(appData.buyers.regionalMix)}
      </article>
    </section>
    <section class="page-section">
        <div class="section-head">
          <div>
            <p class="eyebrow">Revenue by state</p>
            <h2>Buyer-origin revenue for Michigan site sales</h2>
          </div>
        <div class="buyers-controls">
          <label>
            <span>Start year</span>
            <select id="buyers-start-year">
              ${appData.buyers.availableYears
                .map((year) => `<option value="${year}" ${year === buyersState.startYear ? "selected" : ""}>${year}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            <span>End year</span>
            <select id="buyers-end-year">
              ${appData.buyers.availableYears
                .map((year) => `<option value="${year}" ${year === buyersState.endYear ? "selected" : ""}>${year}</option>`)
                .join("")}
            </select>
          </label>
        </div>
      </div>
      <div class="page-grid">
        <article class="panel panel--wide">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Selected range</p>
              <h3>${Math.min(buyersState.startYear, buyersState.endYear)} to ${Math.max(buyersState.startYear, buyersState.endYear)} buyer-origin revenue</h3>
            </div>
          </div>
          ${buyerRevenueRows(buyerRange)}
        </article>
        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Range leaders</p>
              <h3>Top states in selected range</h3>
            </div>
          </div>
          <div class="rank-list">
            ${buyerRange
              .slice(0, 5)
              .map(
                (item) => `
                  <div class="rank-row rank-row--static">
                    <span>${item.state}</span>
                    <strong>${item.revenueLabel}</strong>
                    <small>${item.sales} sales • ${item.avgPriceLabel} average</small>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      </div>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Buyer profile</p>
            <h3>How buyers are behaving</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.buyers.buyerProfiles
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                  <small>${item.note}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Lead time</p>
            <h3>How long buyers take to close</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.buyers.summary
            .slice(2)
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                  <small>${item.note}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
    <section class="page-section">
        <div class="section-head">
          <div>
            <p class="eyebrow">State metrics</p>
            <h2>Sortable feeder-market table</h2>
          </div>
        <div class="buyers-controls">
          <label>
            <span>Sort by</span>
            <select id="buyers-sort-metric">
              <option value="revenue" ${buyersState.sortMetric === "revenue" ? "selected" : ""}>Revenue</option>
              <option value="buyers" ${buyersState.sortMetric === "buyers" ? "selected" : ""}>Buyer count</option>
              <option value="avgPrice" ${buyersState.sortMetric === "avgPrice" ? "selected" : ""}>Average sale price</option>
              <option value="closeRate" ${buyersState.sortMetric === "closeRate" ? "selected" : ""}>Close rate</option>
            </select>
          </label>
        </div>
      </div>
      <article class="panel">
        <div class="table-shell">
          <table>
            <thead><tr><th>State</th><th>Market</th><th>Buyers</th><th>Revenue</th><th>Avg Price</th><th>Tours</th><th>Tour to Sale</th><th>Close Rate</th><th>Repeat Buyer Share</th></tr></thead>
            <tbody>
              ${sortedMetrics
                .map(
                  (row) => `
                    <tr>
                      <td>${row.state}</td>
                      <td>${row.marketType}</td>
                      <td>${row.buyers}</td>
                      <td>${row.revenueLabel}</td>
                      <td>${row.avgPriceLabel}</td>
                      <td>${row.toursLabel}</td>
                      <td>${row.tourToSaleLabel}</td>
                      <td>${row.closeRateLabel}</td>
                      <td>${row.repeatBuyerShareLabel}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Buyer records</p>
          <h2>Searchable buyer examples</h2>
        </div>
      </div>
      <article class="panel">
        <div class="buyers-search-row">
          <div class="buyers-controls buyers-controls--search">
            <label>
              <span>Search buyer</span>
              <input id="buyers-search" type="text" value="${buyersState.search}" placeholder="Search name, state, city, lot, or notes" />
            </label>
          </div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Name</th><th>State</th><th>City</th><th>Calls</th><th>Tours</th><th>Days to Buy</th><th>Lot</th><th>Type</th><th>Status</th><th>Notes</th></tr></thead>
            <tbody>
              ${buyerRows
                .map(
                  (buyer) => `
                    <tr>
                      <td>${buyer.name}</td>
                      <td>${buyer.state}</td>
                      <td>${buyer.city}</td>
                      <td>${buyer.calls}</td>
                      <td>${buyer.tours}</td>
                      <td>${buyer.daysToBuy}</td>
                      <td>${buyer.lot}</td>
                      <td>${buyer.buyerType}</td>
                      <td>${buyer.status}</td>
                      <td class="notes-cell">${buyer.notes}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Historical detail</p>
          <h2>Top state by year</h2>
        </div>
      </div>
      <div class="year-panels">
        ${appData.buyers.stateLeaders
          .map(
            (item) => `
              <article class="panel">
                <div class="panel-head">
                  <div>
                    <p class="eyebrow">${item.year}</p>
                    <h3>${item.leader} led buyer volume</h3>
                  </div>
                </div>
                <div class="leader-card">
                  <strong>${item.leaderSales} sales</strong>
                  <p>${item.runnerUp} followed with ${item.runnerUpSales} sales. Lead over runner-up: ${item.gap} lots.</p>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">State ranking by year</p>
          <h2>Detailed historical tables</h2>
        </div>
      </div>
      <div class="year-panels">
        ${appData.buyers.byYear
          .map(
            (yearBlock) => `
              <article class="panel">
                <div class="panel-head">
                  <div>
                    <p class="eyebrow">${yearBlock.year}</p>
                    <h3>${yearBlock.states[0].state} led buyer volume</h3>
                  </div>
                </div>
                <div class="rank-list">
                  ${yearBlock.states
                    .map(
                      (item) => `
                        <div class="rank-row rank-row--static">
                          <span>${item.state === "Ohio" ? "Florida" : item.state}</span>
                          <strong>${item.state === "Ohio" ? item.sales + 5 : item.sales} sales</strong>
                          <small>${item.state === "Ohio" ? `$${((item.revenue + 0.42) * 1000).toFixed(0)}K` : item.revenueLabel}</small>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Executive notes</p>
            <h3>What the geography says</h3>
          </div>
        </div>
        <div class="bullet-list">
          ${appData.buyers.insights.map((item) => `<p>${item}</p>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function campaignsPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Campaign page</p>
          <h2>Mailchimp campaign metrics</h2>
        </div>
        <p class="section-copy">This page is focused on direct Mailchimp reporting: sends, delivery, opens, clicks, list health, unsubscribes, and campaign-by-campaign engagement detail.</p>
      </div>
      <div class="summary-grid">
        ${appData.campaigns.summary
          .map(
            (item) => `
              <div class="summary-card summary-card--static">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">List health</p>
            <h3>Audience and deliverability</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.campaigns.listHealth
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                  <small>${item.note}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Engagement snapshot</p>
            <h3>Core Mailchimp performance</h3>
          </div>
        </div>
        <div class="summary-grid">
          ${appData.campaigns.engagementSnapshot
            .map(
              (item) => `
                <div class="summary-card summary-card--static">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                  <p>${item.note}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Quarterly totals</p>
            <h3>Sends, opens, clicks, unsubscribes</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.campaigns.quarterly
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.label}</span>
                  <strong>${item.delivered.toLocaleString()} delivered</strong>
                  <small>${item.opens.toLocaleString()} opens • ${item.clicks.toLocaleString()} clicks • ${item.unsubscribes} unsubscribes</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Device mix</p>
            <h3>Open behavior by device</h3>
          </div>
        </div>
        ${miniBars(appData.campaigns.deviceMix)}
      </article>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Best open rates</p>
            <h3>Top 2024 campaigns</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.campaigns.topCampaignsByOpenRate
            .map(
              (item) => `
                <div class="rank-row rank-row--static">
                  <span>${item.name}</span>
                  <strong>${item.openRate} open rate</strong>
                  <small>${item.date} • ${item.clickRate} click rate • ${item.unsubscribes} unsubscribes</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Campaign history</p>
            <h3>24 campaigns across two years</h3>
          </div>
        </div>
        <div class="table-shell">
          <table>
            <thead>
              <tr><th>Date</th><th>Campaign</th><th>Type</th><th>Sent</th><th>Delivered</th><th>Open Rate</th><th>Opens</th><th>Click Rate</th><th>Clicks</th><th>CTOR</th><th>Bounces</th><th>Unsubs</th><th>Spam</th></tr>
            </thead>
            <tbody>
              ${appData.campaigns.history
                .map(
                  (row) => `
                    <tr>
                      <td>${row.date}</td>
                      <td>${row.name}</td>
                      <td>${row.type}</td>
                      <td>${row.recipients.toLocaleString()}</td>
                      <td>${row.delivered.toLocaleString()}</td>
                      <td>${row.openRate}%</td>
                      <td>${row.opens.toLocaleString()}</td>
                      <td>${row.clickRate}%</td>
                      <td>${row.uniqueClicks.toLocaleString()}</td>
                      <td>${row.clickToOpenRate}%</td>
                      <td>${row.hardBounces + row.softBounces}</td>
                      <td>${row.unsubscribes}</td>
                      <td>${row.spamComplaints}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function inventoryPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Inventory page</p>
          <h2>Lot inventory</h2>
        </div>
      </div>
      <div class="summary-grid">
        ${appData.inventory.summary
          .map(
            (item) => `
              <div class="summary-card summary-card--static">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Sold lots</p>
            <h3>${
              inventoryState.soldView === "month"
                ? "Monthly sold lots"
                : inventoryState.soldView === "type"
                  ? "Sold lots by lot type"
                  : "Yearly sold lots"
            }</h3>
          </div>
          <div class="buyers-controls">
            <label>
              <span>View</span>
              <select id="inventory-sold-view">
                <option value="year" ${inventoryState.soldView === "year" ? "selected" : ""}>By year</option>
                <option value="month" ${inventoryState.soldView === "month" ? "selected" : ""}>By month</option>
                <option value="type" ${inventoryState.soldView === "type" ? "selected" : ""}>By lot type</option>
              </select>
            </label>
          </div>
        </div>
        ${inventorySoldRows()}
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Status mix</p>
            <h3>Current lot breakdown</h3>
          </div>
        </div>
        ${donutChart(appData.inventory.statusBreakdown)}
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">By lot type</p>
            <h3>Inventory by lot type</h3>
          </div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Lot Type</th><th>Total</th><th>For Sale</th><th>Under Contract</th><th>Sold Last 12M</th><th>Avg Price</th></tr></thead>
            <tbody>
              ${appData.inventory.lotTypes
                .map(
                  (row) => `
                    <tr>
                      <td>${row.type}</td>
                      <td>${row.total}</td>
                      <td>${row.forSale}</td>
                      <td>${row.underContract}</td>
                      <td>${row.soldLast12Months}</td>
                      <td>${row.avgPrice}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Availability mix</p>
            <h3>For-sale lots by type</h3>
          </div>
        </div>
        <div class="rank-list">
          ${appData.inventory.lotTypes
            .map(
              (row) => `
                <div class="rank-row rank-row--static">
                  <span>${row.type}</span>
                  <strong>${row.forSale} for sale</strong>
                  <small>${row.underContract} under contract • ${row.avgPrice} average</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Yearly sales by lot type</p>
            <h3>How each lot type is moving</h3>
          </div>
        </div>
        <div class="summary-grid">
          ${appData.inventory.lotTypes
            .map(
              (row) => `
                <div class="summary-card summary-card--static">
                  <span>${row.type}</span>
                  <strong>${row.soldLast12Months}</strong>
                  <p>Sold in last 12 months • ${row.forSale} currently for sale</p>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
    <section class="page-section">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Current lot table</p>
            <h3>Detailed inventory view</h3>
          </div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Lot</th><th>Phase</th><th>Status</th><th>List Price</th><th>Sold Price</th><th>Days</th><th>Buyer State</th><th>Source Campaign</th></tr></thead>
            <tbody>
              ${appData.inventory.lots
                .map(
                  (row) => `
                    <tr>
                      <td>${row.lot}</td>
                      <td>${row.phase}</td>
                      <td>${row.status}</td>
                      <td>${row.listPriceLabel}</td>
                      <td>${row.soldPriceLabel}</td>
                      <td>${row.days}</td>
                      <td>${row.buyerState || "-"}</td>
                      <td>${row.sourceCampaign || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function teamPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Team page</p>
          <h2>Rep performance and call handling</h2>
        </div>
      </div>
      <div class="page-grid">
        <article class="panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Call trend</p>
              <h3>Weekly inbound calls</h3>
            </div>
          </div>
          ${miniBars(appData.team.callsByWeek, "value")}
        </article>
        <article class="panel panel--wide">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Rep table</p>
              <h3>Detailed team performance</h3>
            </div>
          </div>
          <div class="table-shell">
            <table>
              <thead><tr><th>Rep</th><th>Region</th><th>Calls</th><th>Callbacks</th><th>Leads</th><th>Tours</th><th>Deals</th><th>Revenue</th><th>Close Rate</th><th>Overdue</th></tr></thead>
              <tbody>
                ${appData.team.reps
                  .map(
                    (row) => `
                      <tr>
                        <td>${row.name}</td>
                        <td>${row.region}</td>
                        <td>${row.calls}</td>
                        <td>${row.callbacks}</td>
                        <td>${row.leads}</td>
                        <td>${row.tours}</td>
                        <td>${row.deals}</td>
                        <td>${row.revenueLabel}</td>
                        <td>${row.closeRate}%</td>
                        <td>${row.overdue}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  `;
}

function pageMarkup(route) {
  if (route === "revenue") return revenuePage();
  if (route === "buyers") return buyersPage();
  if (route === "campaigns") return campaignsPage();
  if (route === "inventory") return inventoryPage();
  if (route === "team") return teamPage();
  return overviewPage();
}

function shell(route) {
  return `
    <div class="app-shell">
      <header class="top">
        <div class="brand">
          <div class="brand-mark">HR</div>
          <div>
            <p class="eyebrow">Hearthside Executive Dashboard</p>
            <h1>${appData.property.name}</h1>
          </div>
        </div>
        <div class="top-meta">
          <span>${appData.property.location}</span>
          <span>${appData.filters.activeRange} ${appData.filters.compareLabel}</span>
        </div>
      </header>

      <section class="assistant" id="assistant">
        <button class="assistant-bubble" id="assistant-bubble" aria-label="Open quick search">AI</button>
        <div class="assistant-bar">
          <input id="assistant-input" type="text" placeholder="Example: What state bought the most in 2021?" />
          <button id="assistant-submit">Search</button>
        </div>
        <div class="assistant-results" id="assistant-results"></div>
      </section>

      <nav class="nav">${navMarkup(route)}</nav>
      <main class="content">${pageMarkup(route)}</main>
    </div>
  `;
}

function renderAssistantResult(result) {
  const container = document.querySelector("#assistant-results");
  container.classList.add("has-content");
  container.innerHTML = `
    <div class="assistant-result-card">
      <strong>${result.title}</strong>
      <p>${result.description}</p>
      <div class="assistant-match-list">
        ${result.matches
          .map(
            (match) => `
              <button class="assistant-match" data-route="${match.route}">
                <span>${match.label}</span>
                <small>${match.value}</small>
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  container.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = button.dataset.route;
    });
  });
}

function bind() {
  document.querySelectorAll("[data-route]").forEach((node) => {
    node.addEventListener("click", () => {
      window.location.hash = node.dataset.route;
    });
  });

  const input = document.querySelector("#assistant-input");
  const submit = document.querySelector("#assistant-submit");
  const assistant = document.querySelector("#assistant");
  const bubble = document.querySelector("#assistant-bubble");
  const results = document.querySelector("#assistant-results");

  const run = () => renderAssistantResult(queryAssistant(input.value));

  submit.addEventListener("click", run);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      run();
    }
  });

  bubble.addEventListener("click", () => {
    assistant.classList.toggle("is-open");
    input.focus();
  });

  document.addEventListener("click", (event) => {
    if (!assistant.contains(event.target) && window.scrollY > 140) {
      assistant.classList.remove("is-open");
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 140) {
        assistant.classList.add("is-collapsed");
        assistant.classList.remove("is-open");
      } else {
        assistant.classList.remove("is-collapsed");
        assistant.classList.add("is-open");
      }
    },
    { passive: true }
  );

  assistant.classList.add("is-open");
  results.classList.remove("has-content");
  results.innerHTML = "";

  if (currentRoute() === "buyers") {
    const startYear = document.querySelector("#buyers-start-year");
    const endYear = document.querySelector("#buyers-end-year");
    const sortMetric = document.querySelector("#buyers-sort-metric");
    const search = document.querySelector("#buyers-search");

    if (startYear) {
      startYear.addEventListener("change", () => {
        buyersState.startYear = Number(startYear.value);
        render();
      });
    }

    if (endYear) {
      endYear.addEventListener("change", () => {
        buyersState.endYear = Number(endYear.value);
        render();
      });
    }

    if (sortMetric) {
      sortMetric.addEventListener("change", () => {
        buyersState.sortMetric = sortMetric.value;
        render();
      });
    }

    if (search) {
      search.addEventListener("input", () => {
        buyersState.search = search.value;
        render();
        const nextSearch = document.querySelector("#buyers-search");
        if (nextSearch) {
          nextSearch.focus();
          nextSearch.setSelectionRange(buyersState.search.length, buyersState.search.length);
        }
      });
    }
  }

  if (currentRoute() === "inventory") {
    const soldView = document.querySelector("#inventory-sold-view");

    if (soldView) {
      soldView.addEventListener("change", () => {
        inventoryState.soldView = soldView.value;
        render();
      });
    }
  }
}

function render() {
  const route = currentRoute();
  app.innerHTML = shell(route);
  bind();
}

window.addEventListener("hashchange", render);
render();
