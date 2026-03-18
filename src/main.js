import { appData } from "./mockData.js";
import { lineChart, miniBars } from "./charts.js";

const app = document.querySelector("#app");

const routes = [
  { id: "overview", label: "Home" },
  { id: "calls", label: "Calls" },
  { id: "satisfaction", label: "Satisfaction" },
  { id: "sales", label: "Sales" },
  { id: "buyers", label: "Buyers" },
  { id: "campaigns", label: "Campaigns" },
  { id: "inventory", label: "Inventory" },
  { id: "team", label: "Team" },
  { id: "data-ops", label: "Data Ops" }
];

const state = {
  range: "30d",
  compare: "prev",
  inventoryView: "year",
  buyersSearch: "",
  focusMetric: null,
  reportPage: "calls",
  reportSection: "summary",
  reportFormat: "csv"
};

const authState = {
  status: "loading",
  user: null,
  error: ""
};

function currentRoute() {
  const route = window.location.hash.replace("#", "") || "overview";
  return routes.some((item) => item.id === route) ? route : "overview";
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

function rangeControls() {
  return `
    <div class="global-controls">
      <label>
        <span>Date range</span>
        <select id="global-range">
          ${appData.ranges.map((item) => `<option value="${item.id}" ${item.id === state.range ? "selected" : ""}>${item.label}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Compare</span>
        <select id="global-compare">
          ${appData.compareOptions
            .map((item) => `<option value="${item.id}" ${item.id === state.compare ? "selected" : ""}>${item.label}</option>`)
            .join("")}
        </select>
      </label>
    </div>
  `;
}

function widgetCard(widget) {
  return `
    <button class="summary-card widget-card ${state.focusMetric === widget.id ? "is-focused" : ""}" data-route="${widget.page}" data-focus="${widget.id}">
      <span>${widget.label}</span>
      <strong>${widget.valueByRange[state.range]}</strong>
      <em class="delta ${String(widget.delta).startsWith("-") ? "delta--down" : "delta--up"}">${widget.delta}</em>
      <p>${widget.note}</p>
    </button>
  `;
}

function summaryCards(items) {
  return items
    .map(
      (item) => `
        <div class="summary-card summary-card--static">
          <span>${item.label}</span>
          <strong>${item.valueByRange ? item.valueByRange[state.range] : item.value}</strong>
          ${item.delta ? `<em class="delta ${String(item.delta).startsWith("-") ? "delta--down" : "delta--up"}">${item.delta}</em>` : ""}
        </div>
      `
    )
    .join("");
}

function exportButton(label = "Export Report", options = {}) {
  const attributes = Object.entries(options)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<button class="ghost-link ghost-link--strong" ${attributes}>${label}</button>`;
}

function authButton(label, options = {}) {
  const attributes = Object.entries(options)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<button class="auth-button" ${attributes}>${label}</button>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvValue(value) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

function tablesToCsv(tables) {
  return tables
    .filter((table) => table.rows.length)
    .map((table) => {
      const headers = Object.keys(table.rows[0]);
      const headerRow = headers.map(csvValue).join(",");
      const body = table.rows.map((row) => headers.map((header) => csvValue(row[header])).join(",")).join("\n");
      return [`"${table.name}"`, headerRow, body].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buyersRows() {
  return appData.buyers.buyerDirectory.filter((buyer) => {
    const query = state.buyersSearch.trim().toLowerCase();
    if (!query) return true;
    return [buyer.name, buyer.state, buyer.city, buyer.notes, buyer.lot].some((field) => String(field).toLowerCase().includes(query));
  });
}

function routeLabel(routeId) {
  return routes.find((route) => route.id === routeId)?.label || routeId;
}

function reportSections(route) {
  const options = {
    calls: [
      { id: "summary", label: "Summary" },
      { id: "received", label: "Calls received trend" },
      { id: "lag", label: "Callback lag trend" },
      { id: "hours", label: "Missed call windows" },
      { id: "reasons", label: "Response causes" },
      { id: "page", label: "Full page bundle" }
    ],
    satisfaction: [
      { id: "summary", label: "Summary" },
      { id: "trend", label: "CSAT trend" },
      { id: "issues", label: "Issue mix" },
      { id: "page", label: "Full page bundle" }
    ],
    sales: [
      { id: "summary", label: "Summary" },
      { id: "revenue", label: "Revenue trend" },
      { id: "pipeline", label: "Pipeline" },
      { id: "page", label: "Full page bundle" }
    ],
    buyers: [
      { id: "summary", label: "Summary" },
      { id: "states", label: "Top states" },
      { id: "directory", label: "Buyer directory" },
      { id: "page", label: "Full page bundle" }
    ],
    campaigns: [
      { id: "summary", label: "Summary" },
      { id: "devices", label: "Device mix" },
      { id: "history", label: "Campaign history" },
      { id: "page", label: "Full page bundle" }
    ],
    inventory: [
      { id: "summary", label: "Summary" },
      { id: "sold", label: "Sold history" },
      { id: "types", label: "Lot types" },
      { id: "page", label: "Full page bundle" }
    ],
    team: [
      { id: "summary", label: "Summary" },
      { id: "reps", label: "Rep table" },
      { id: "page", label: "Full page bundle" }
    ],
    "data-ops": [
      { id: "summary", label: "Summary" },
      { id: "manual-log", label: "Manual logs" },
      { id: "imports", label: "Import queue" },
      { id: "templates", label: "Templates" },
      { id: "page", label: "Full page bundle" }
    ]
  };

  return options[route] || [{ id: "page", label: "Full page bundle" }];
}

function summaryRows(items) {
  return items.map((item) => ({
    Metric: item.label,
    Value: item.valueByRange ? item.valueByRange[state.range] : item.value,
    Compare: item.delta || "",
    Note: item.note || ""
  }));
}

function overviewHighlightRows() {
  return [
    { Highlight: "Callback returns", Change: "-21%", Detail: "Returned call completion trailed the prior period." },
    { Highlight: "Response speed", Change: "+6 minutes", Detail: "Average callback time was slower in the latest window." },
    { Highlight: "CSAT", Change: "+2 points", Detail: "Customer sentiment remains positive." }
  ];
}

function getExportTables(route, section = "page") {
  if (route === "overview") {
    if (section === "widgets") return [{ name: "Overview Widgets", rows: appData.overview.widgets.map((widget) => ({ Widget: widget.label, Value: widget.valueByRange[state.range], Change: widget.delta, Note: widget.note, Page: routeLabel(widget.page) })) }];
    if (section === "calls-trend") return [{ name: "Calls Received Trend", rows: appData.calls.receivedSeries[state.range].map((row) => ({ Period: row.label, Calls: row.value })) }];
    if (section === "highlights") return [{ name: "Highlights", rows: overviewHighlightRows() }];
    return [
      { name: "Overview Widgets", rows: appData.overview.widgets.map((widget) => ({ Widget: widget.label, Value: widget.valueByRange[state.range], Change: widget.delta, Note: widget.note, Page: routeLabel(widget.page) })) },
      { name: "Calls Received Trend", rows: appData.calls.receivedSeries[state.range].map((row) => ({ Period: row.label, Calls: row.value })) },
      { name: "Highlights", rows: overviewHighlightRows() }
    ];
  }

  if (route === "calls") {
    if (section === "summary") return [{ name: "Calls Summary", rows: summaryRows(appData.calls.summary) }];
    if (section === "received") return [{ name: "Calls Received", rows: appData.calls.receivedSeries[state.range].map((row) => ({ Period: row.label, Calls: row.value })) }];
    if (section === "lag") return [{ name: "Callback Lag", rows: appData.calls.callbackLagSeries[state.range].map((row) => ({ Period: row.label, Minutes: row.value })) }];
    if (section === "hours") return [{ name: "Missed Call Windows", rows: appData.calls.hourlyBreakdown.map((row) => ({ Window: row.hour, Calls: row.calls, MissedOrDelayed: row.missed })) }];
    if (section === "reasons") return [{ name: "Response Causes", rows: appData.calls.reasons.map((row) => ({ Cause: row.label, Value: row.value })) }];
    return [
      { name: "Calls Summary", rows: summaryRows(appData.calls.summary) },
      { name: "Calls Received", rows: appData.calls.receivedSeries[state.range].map((row) => ({ Period: row.label, Calls: row.value })) },
      { name: "Callback Lag", rows: appData.calls.callbackLagSeries[state.range].map((row) => ({ Period: row.label, Minutes: row.value })) },
      { name: "Missed Call Windows", rows: appData.calls.hourlyBreakdown.map((row) => ({ Window: row.hour, Calls: row.calls, MissedOrDelayed: row.missed })) },
      { name: "Response Causes", rows: appData.calls.reasons.map((row) => ({ Cause: row.label, Value: row.value })) }
    ];
  }

  if (route === "satisfaction") {
    if (section === "summary") return [{ name: "Satisfaction Summary", rows: summaryRows(appData.satisfaction.summary) }];
    if (section === "trend") return [{ name: "CSAT Trend", rows: appData.satisfaction.csatSeries[state.range].map((row) => ({ Period: row.label, CSAT: row.value })) }];
    if (section === "issues") return [{ name: "Issue Mix", rows: appData.satisfaction.issues.map((row) => ({ Category: row.category, Count: row.count })) }];
    return [
      { name: "Satisfaction Summary", rows: summaryRows(appData.satisfaction.summary) },
      { name: "CSAT Trend", rows: appData.satisfaction.csatSeries[state.range].map((row) => ({ Period: row.label, CSAT: row.value })) },
      { name: "Issue Mix", rows: appData.satisfaction.issues.map((row) => ({ Category: row.category, Count: row.count })) }
    ];
  }

  if (route === "sales") {
    if (section === "summary") return [{ name: "Sales Summary", rows: summaryRows(appData.sales.summary) }];
    if (section === "revenue") return [{ name: "Revenue Trend", rows: appData.sales.revenueSeries[state.range].map((row) => ({ Period: row.label, RevenueThousands: row.value })) }];
    if (section === "pipeline") return [{ name: "Pipeline", rows: appData.sales.pipeline.map((row) => ({ Stage: row.stage, Count: row.count })) }];
    return [
      { name: "Sales Summary", rows: summaryRows(appData.sales.summary) },
      { name: "Revenue Trend", rows: appData.sales.revenueSeries[state.range].map((row) => ({ Period: row.label, RevenueThousands: row.value })) },
      { name: "Pipeline", rows: appData.sales.pipeline.map((row) => ({ Stage: row.stage, Count: row.count })) }
    ];
  }

  if (route === "buyers") {
    if (section === "summary") return [{ name: "Buyer Summary", rows: summaryRows(appData.buyers.summary) }];
    if (section === "states") return [{ name: "Top States", rows: appData.buyers.topStates.map((row) => ({ State: row.state, Buyers: row.buyers, Revenue: row.revenueLabel, AveragePrice: row.avgPriceLabel })) }];
    if (section === "directory") return [{ name: "Buyer Directory", rows: buyersRows().slice(0, 25).map((row) => ({ Name: row.name, State: row.state, City: row.city, Calls: row.calls, Tours: row.tours, DaysToBuy: row.daysToBuy, Lot: row.lot, Notes: row.notes })) }];
    return [
      { name: "Buyer Summary", rows: summaryRows(appData.buyers.summary) },
      { name: "Top States", rows: appData.buyers.topStates.map((row) => ({ State: row.state, Buyers: row.buyers, Revenue: row.revenueLabel, AveragePrice: row.avgPriceLabel })) },
      { name: "Buyer Directory", rows: buyersRows().slice(0, 25).map((row) => ({ Name: row.name, State: row.state, City: row.city, Calls: row.calls, Tours: row.tours, DaysToBuy: row.daysToBuy, Lot: row.lot, Notes: row.notes })) }
    ];
  }

  if (route === "campaigns") {
    if (section === "summary") return [{ name: "Campaign Summary", rows: summaryRows(appData.campaigns.summary) }];
    if (section === "devices") return [{ name: "Device Mix", rows: appData.campaigns.deviceMix.map((row) => ({ Device: row.label, SharePercent: row.value })) }];
    if (section === "history") return [{ name: "Campaign History", rows: appData.campaigns.table.map((row) => ({ Date: row.date, Campaign: row.campaign, Sent: row.sent, Delivered: row.delivered, OpenRate: row.openRate, ClickRate: row.clickRate, Unsubscribes: row.unsubscribes })) }];
    return [
      { name: "Campaign Summary", rows: summaryRows(appData.campaigns.summary) },
      { name: "Device Mix", rows: appData.campaigns.deviceMix.map((row) => ({ Device: row.label, SharePercent: row.value })) },
      { name: "Campaign History", rows: appData.campaigns.table.map((row) => ({ Date: row.date, Campaign: row.campaign, Sent: row.sent, Delivered: row.delivered, OpenRate: row.openRate, ClickRate: row.clickRate, Unsubscribes: row.unsubscribes })) }
    ];
  }

  if (route === "inventory") {
    if (section === "summary") return [{ name: "Inventory Summary", rows: summaryRows(appData.inventory.summary) }];
    if (section === "sold") return [{ name: `Sold Lots ${state.inventoryView}`, rows: appData.inventory.soldHistory[state.inventoryView].map((row) => ({ Period: row.period, Sold: row.sold })) }];
    if (section === "types") return [{ name: "Lot Types", rows: appData.inventory.lotTypes.map((row) => ({ Type: row.type, Total: row.total, ForSale: row.forSale, UnderContract: row.underContract, Sold12Months: row.soldLast12Months, AveragePrice: row.avgPrice })) }];
    return [
      { name: "Inventory Summary", rows: summaryRows(appData.inventory.summary) },
      { name: `Sold Lots ${state.inventoryView}`, rows: appData.inventory.soldHistory[state.inventoryView].map((row) => ({ Period: row.period, Sold: row.sold })) },
      { name: "Lot Types", rows: appData.inventory.lotTypes.map((row) => ({ Type: row.type, Total: row.total, ForSale: row.forSale, UnderContract: row.underContract, Sold12Months: row.soldLast12Months, AveragePrice: row.avgPrice })) }
    ];
  }

  if (route === "team") {
    if (section === "summary") return [{ name: "Team Summary", rows: summaryRows(appData.team.summary) }];
    if (section === "reps") return [{ name: "Team Reps", rows: appData.team.reps.map((row) => ({ Rep: row.name, Calls: row.calls, Callbacks: row.callbacks, Tours: row.tours, Deals: row.deals, AverageResponse: row.response })) }];
    return [
      { name: "Team Summary", rows: summaryRows(appData.team.summary) },
      { name: "Team Reps", rows: appData.team.reps.map((row) => ({ Rep: row.name, Calls: row.calls, Callbacks: row.callbacks, Tours: row.tours, Deals: row.deals, AverageResponse: row.response })) }
    ];
  }

  if (route === "data-ops") {
    if (section === "summary") return [{ name: "Data Ops Summary", rows: summaryRows(appData.dataOps.summary) }];
    if (section === "manual-log") return [{ name: "Recent Manual Entries", rows: appData.dataOps.recentEntries.map((row) => ({ Source: row.source, Owner: row.owner, Type: row.type, Date: row.date, Time: row.time, Duration: row.duration, Contact: row.contact, Impact: row.impact, Notes: row.notes })) }];
    if (section === "imports") return [{ name: "Import Queue", rows: appData.dataOps.importQueue.map((row) => ({ File: row.name, Category: row.category, Status: row.status, Records: row.records, Notes: row.note })) }];
    if (section === "templates") return [{ name: "Report Templates", rows: appData.dataOps.reportTemplates.map((row) => ({ Template: row.name, Format: row.format, Includes: row.includes })) }];
    return [
      { name: "Data Ops Summary", rows: summaryRows(appData.dataOps.summary) },
      { name: "Recent Manual Entries", rows: appData.dataOps.recentEntries.map((row) => ({ Source: row.source, Owner: row.owner, Type: row.type, Date: row.date, Time: row.time, Duration: row.duration, Contact: row.contact, Impact: row.impact, Notes: row.notes })) },
      { name: "Import Queue", rows: appData.dataOps.importQueue.map((row) => ({ File: row.name, Category: row.category, Status: row.status, Records: row.records, Notes: row.note })) },
      { name: "Report Templates", rows: appData.dataOps.reportTemplates.map((row) => ({ Template: row.name, Format: row.format, Includes: row.includes })) }
    ];
  }

  return [];
}

function runExport(route, section, format = "csv") {
  const tables = getExportTables(route, section);
  const filenameBase = `${slugify(appData.property.name)}-${slugify(route)}-${slugify(section)}-${state.range}`;

  if (format === "json") {
    const payload = {
      property: appData.property.name,
      route,
      section,
      range: state.range,
      compare: state.compare,
      exportedAt: new Date().toISOString(),
      tables
    };
    downloadFile(`${filenameBase}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    return;
  }

  const csv = tablesToCsv(tables);
  downloadFile(`${filenameBase}.csv`, csv, "text/csv;charset=utf-8");
}

function shell(route) {
  return `
    <div class="app-shell">
      <header class="top">
        <div class="brand">
          <div class="brand-mark">HG</div>
          <div>
            <p class="eyebrow">Executive Operating Dashboard</p>
            <h1>${appData.property.name}</h1>
          </div>
        </div>
        <div class="top-meta">
          <span>${authState.user?.username || "Authenticated user"}</span>
          <span>${appData.property.location}</span>
          <span>${appData.ranges.find((item) => item.id === state.range).label}</span>
          <span>${appData.compareOptions.find((item) => item.id === state.compare).label}</span>
          ${authButton("Log out", { id: "logout-button" })}
        </div>
      </header>

      <section class="assistant">
        <div class="assistant-bar">
          <input id="assistant-input" type="text" placeholder="${appData.property.assistantLabel}" />
          <button id="assistant-submit">Search</button>
        </div>
        <div class="assistant-results" id="assistant-results"></div>
      </section>

      <nav class="nav">${navMarkup(route)}</nav>
      ${rangeControls()}
      <main class="content">${pageMarkup(route)}</main>
    </div>
  `;
}

function loginShell() {
  const configHint =
    authState.status === "config-error"
      ? `
        <div class="auth-notice auth-notice--warning">
          <strong>Auth is not configured in Vercel yet.</strong>
          <p>Set <code>APP_ADMIN_USERNAME</code>, <code>APP_ADMIN_PASSWORD</code>, and <code>APP_SESSION_SECRET</code> in the project environment variables.</p>
        </div>
      `
      : "";

  const errorMarkup =
    authState.error
      ? `
        <div class="auth-notice auth-notice--error">
          <strong>Sign-in failed</strong>
          <p>${escapeHtml(authState.error)}</p>
        </div>
      `
      : "";

  return `
    <div class="auth-shell">
      <section class="auth-card">
        <div class="brand">
          <div class="brand-mark">HG</div>
          <div>
            <p class="eyebrow">Secure Access</p>
            <h1>${appData.property.name}</h1>
          </div>
        </div>
        <div class="auth-copy">
          <h2>Sign in to view the dashboard</h2>
          <p>This dashboard is restricted to authorized management and reporting users.</p>
        </div>
        ${configHint}
        ${errorMarkup}
        <form id="login-form" class="auth-form">
          <label>
            <span>Username</span>
            <input id="login-username" name="username" type="text" autocomplete="username" required />
          </label>
          <label>
            <span>Password</span>
            <input id="login-password" name="password" type="password" autocomplete="current-password" required />
          </label>
          <button id="login-submit" class="auth-button auth-button--primary" type="submit">
            ${authState.status === "submitting" ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  `;
}

function overviewPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive summary</p>
          <h2>Business performance at a glance</h2>
        </div>
        <p class="section-copy">
          Every widget is tied to a date range. Click any one of them to open the underlying page and inspect the exact history, comparisons,
          and supporting detail.
        </p>
      </div>
      <div class="summary-grid summary-grid--hero">
        ${appData.overview.widgets.map(widgetCard).join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Response pressure</p>
            <h3>Calls received over selected period</h3>
          </div>
          <div class="panel-actions">
            ${exportButton("Export Snapshot", { "data-export-route": "overview", "data-export-section": "calls-trend" })}
            <button class="ghost-link" data-route="calls" data-focus="calls-received">Open calls page</button>
          </div>
        </div>
        <div class="chart-card">${lineChart(appData.calls.receivedSeries[state.range])}</div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Highlights</p>
            <h3>Notable changes</h3>
          </div>
          <div class="panel-actions">
            ${exportButton("Export Highlights", { "data-export-route": "overview", "data-export-section": "highlights" })}
          </div>
        </div>
        <div class="rank-list">
          <div class="rank-row rank-row--static"><span>Callback returns</span><strong>-21%</strong><small>Returned call completion trailed the prior period.</small></div>
          <div class="rank-row rank-row--static"><span>Response speed</span><strong>+6 minutes</strong><small>Average callback time was slower in the latest window.</small></div>
          <div class="rank-row rank-row--static"><span>CSAT</span><strong>+2 points</strong><small>Customer sentiment remains positive.</small></div>
        </div>
      </article>
    </section>
  `;
}

function callsPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">Calls page</p>
          <h2>Call volume, response time, and follow-up accountability</h2>
        </div>
        <p class="section-copy">Use this page to review call volume, returned calls, response timing, missed-call windows, and the operational factors affecting service levels.</p>
      </div>
      <div class="section-actions">${exportButton("Export Calls Report", { "data-export-route": "calls", "data-export-section": "page" })}</div>
      <div class="summary-grid">${summaryCards(appData.calls.summary)}</div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">Volume</p><h3>Calls received</h3></div><div class="panel-actions">${exportButton("Export Trend", { "data-export-route": "calls", "data-export-section": "received" })}</div></div>
        <div class="chart-card">${lineChart(appData.calls.receivedSeries[state.range])}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Lag</p><h3>Average callback time</h3></div><div class="panel-actions">${exportButton("Export Lag", { "data-export-route": "calls", "data-export-section": "lag" })}</div></div>
        <div class="chart-card">${lineChart(appData.calls.callbackLagSeries[state.range])}</div>
      </article>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">By time block</p><h3>When calls are missed</h3></div><div class="panel-actions">${exportButton("Export Time Blocks", { "data-export-route": "calls", "data-export-section": "hours" })}</div></div>
        <div class="rank-list">
          ${appData.calls.hourlyBreakdown
            .map((item) => `<div class="rank-row rank-row--static"><span>${item.hour}</span><strong>${item.calls} calls</strong><small>${item.missed} missed or delayed</small></div>`)
            .join("")}
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">Why</p><h3>Likely causes behind response swings</h3></div><div class="panel-actions">${exportButton("Export Causes", { "data-export-route": "calls", "data-export-section": "reasons" })}</div></div>
        <div class="rank-list">
          ${appData.calls.reasons.map((item) => `<div class="rank-row rank-row--static"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function satisfactionPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Satisfaction page</p><h2>Customer satisfaction and issue handling</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Satisfaction Report", { "data-export-route": "satisfaction", "data-export-section": "page" })}</div>
      <div class="summary-grid">${summaryCards(appData.satisfaction.summary)}</div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">Trend</p><h3>CSAT over selected period</h3></div><div class="panel-actions">${exportButton("Export Trend", { "data-export-route": "satisfaction", "data-export-section": "trend" })}</div></div>
        <div class="chart-card">${lineChart(appData.satisfaction.csatSeries[state.range])}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Issue mix</p><h3>Open issue categories</h3></div><div class="panel-actions">${exportButton("Export Issues", { "data-export-route": "satisfaction", "data-export-section": "issues" })}</div></div>
        ${miniBars(appData.satisfaction.issues, "count")}
      </article>
    </section>
  `;
}

function salesPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Sales page</p><h2>Pending deals, sold lots, and revenue</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Sales Report", { "data-export-route": "sales", "data-export-section": "page" })}</div>
      <div class="summary-grid">${summaryCards(appData.sales.summary)}</div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">Revenue</p><h3>Revenue over selected period</h3></div><div class="panel-actions">${exportButton("Export Revenue", { "data-export-route": "sales", "data-export-section": "revenue" })}</div></div>
        <div class="chart-card">${lineChart(appData.sales.revenueSeries[state.range])}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Pipeline</p><h3>Current stage mix</h3></div><div class="panel-actions">${exportButton("Export Pipeline", { "data-export-route": "sales", "data-export-section": "pipeline" })}</div></div>
        ${miniBars(appData.sales.pipeline, "count")}
      </article>
    </section>
  `;
}

function buyersPage() {
  const buyerRows = buyersRows();

  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Buyers page</p><h2>Buyer metrics</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Buyer Report", { "data-export-route": "buyers", "data-export-section": "page" })}</div>
      <div class="summary-grid">
        ${appData.buyers.summary
          .map((item) => `<div class="summary-card summary-card--static"><span>${item.label}</span><strong>${item.value}</strong><p>${escapeHtml(item.note)}</p></div>`)
          .join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">State leaderboard</p><h3>Top buyer origin states</h3></div><div class="panel-actions">${exportButton("Export States", { "data-export-route": "buyers", "data-export-section": "states" })}</div></div>
        <div class="table-shell">
          <table>
            <thead><tr><th>State</th><th>Buyers</th><th>Revenue</th><th>Avg Price</th></tr></thead>
            <tbody>
              ${appData.buyers.topStates.map((row) => `<tr><td>${row.state}</td><td>${row.buyers}</td><td>${row.revenueLabel}</td><td>${row.avgPriceLabel}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Buyer records</p><h3>Search sample buyers</h3></div><div class="panel-actions">${exportButton("Export Buyer Rows", { "data-export-route": "buyers", "data-export-section": "directory" })}</div></div>
        <div class="buyers-controls buyers-controls--search">
          <label><span>Search buyer</span><input id="buyers-search" type="text" value="${state.buyersSearch}" placeholder="Search name, state, city, lot, or notes" /></label>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Name</th><th>State</th><th>City</th><th>Calls</th><th>Tours</th><th>Days</th><th>Lot</th></tr></thead>
            <tbody>
              ${buyerRows
                .slice(0, 25)
                .map((buyer) => `<tr><td>${buyer.name}</td><td>${buyer.state}</td><td>${buyer.city}</td><td>${buyer.calls}</td><td>${buyer.tours}</td><td>${buyer.daysToBuy}</td><td>${buyer.lot}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function campaignsPage() {
  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Campaigns page</p><h2>Mailchimp campaign metrics</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Campaign Report", { "data-export-route": "campaigns", "data-export-section": "page" })}</div>
      <div class="summary-grid">
        ${appData.campaigns.summary.map((item) => `<div class="summary-card summary-card--static"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Device mix</p><h3>Open behavior</h3></div><div class="panel-actions">${exportButton("Export Device Mix", { "data-export-route": "campaigns", "data-export-section": "devices" })}</div></div>
        ${miniBars(appData.campaigns.deviceMix)}
      </article>
      <article class="panel panel--wide">
        <div class="panel-head"><div><p class="eyebrow">Campaign history</p><h3>Direct Mailchimp reporting</h3></div><div class="panel-actions">${exportButton("Export Campaign Rows", { "data-export-route": "campaigns", "data-export-section": "history" })}</div></div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Date</th><th>Campaign</th><th>Sent</th><th>Delivered</th><th>Open Rate</th><th>Click Rate</th><th>Unsubs</th></tr></thead>
            <tbody>
              ${appData.campaigns.table.map((row) => `<tr><td>${row.date}</td><td>${row.campaign}</td><td>${row.sent.toLocaleString()}</td><td>${row.delivered.toLocaleString()}</td><td>${row.openRate}</td><td>${row.clickRate}</td><td>${row.unsubscribes}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function inventoryPage() {
  const rows = appData.inventory.soldHistory[state.inventoryView];
  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Inventory page</p><h2>Lot inventory</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Inventory Report", { "data-export-route": "inventory", "data-export-section": "page" })}</div>
      <div class="summary-grid">
        ${appData.inventory.summary.map((item) => `<div class="summary-card summary-card--static"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel panel--wide">
        <div class="panel-head">
          <div><p class="eyebrow">Sold lots</p><h3>${state.inventoryView === "type" ? "Sold by lot type" : state.inventoryView === "month" ? "Sold by month" : "Sold by year"}</h3></div>
          <div class="panel-actions">
            <div class="buyers-controls"><label><span>View</span><select id="inventory-view"><option value="year" ${state.inventoryView === "year" ? "selected" : ""}>By year</option><option value="month" ${state.inventoryView === "month" ? "selected" : ""}>By month</option><option value="type" ${state.inventoryView === "type" ? "selected" : ""}>By lot type</option></select></label></div>
            ${exportButton("Export Sold History", { "data-export-route": "inventory", "data-export-section": "sold" })}
          </div>
        </div>
        ${miniBars(rows, "sold")}
      </article>
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Lot types</p><h3>Current inventory by type</h3></div><div class="panel-actions">${exportButton("Export Lot Types", { "data-export-route": "inventory", "data-export-section": "types" })}</div></div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Type</th><th>Total</th><th>For Sale</th><th>Under Contract</th><th>Sold 12M</th><th>Avg Price</th></tr></thead>
            <tbody>
              ${appData.inventory.lotTypes.map((row) => `<tr><td>${row.type}</td><td>${row.total}</td><td>${row.forSale}</td><td>${row.underContract}</td><td>${row.soldLast12Months}</td><td>${row.avgPrice}</td></tr>`).join("")}
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
        <div><p class="eyebrow">Team page</p><h2>Response ownership and follow-up accountability</h2></div>
      </div>
      <div class="section-actions">${exportButton("Export Team Report", { "data-export-route": "team", "data-export-section": "page" })}</div>
      <div class="summary-grid">
        ${appData.team.summary.map((item) => `<div class="summary-card summary-card--static"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
      </div>
    </section>
    <section class="page-section">
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Rep table</p><h3>Who is handling what</h3></div><div class="panel-actions">${exportButton("Export Rep Table", { "data-export-route": "team", "data-export-section": "reps" })}</div></div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Rep</th><th>Calls</th><th>Callbacks</th><th>Tours</th><th>Deals</th><th>Avg Response</th></tr></thead>
            <tbody>
              ${appData.team.reps.map((row) => `<tr><td>${row.name}</td><td>${row.calls}</td><td>${row.callbacks}</td><td>${row.tours}</td><td>${row.deals}</td><td>${row.response}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function dataOpsPage() {
  const sectionOptions = reportSections(state.reportPage);
  const activeSection = sectionOptions.some((option) => option.id === state.reportSection) ? state.reportSection : "summary";

  return `
    <section class="page-section">
      <div class="section-head">
        <div><p class="eyebrow">Data operations</p><h2>Manual entry, historical uploads, and report exports</h2></div>
        <p class="section-copy">Use this page for data that does not come from an API, backlog files from prior years, and formal report exports for management review.</p>
      </div>
      <div class="summary-grid">
        ${appData.dataOps.summary.map((item) => `<div class="summary-card summary-card--static"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
      </div>
    </section>
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Manual entry</p><h3>Add a manual log</h3></div>
          <div class="panel-actions">${exportButton("Export Manual Logs", { "data-export-route": "data-ops", "data-export-section": "manual-log" })}</div>
        </div>
        <div class="form-grid">
          <label><span>Entry type</span><select>${appData.dataOps.manualEntryTypes.map((item) => `<option>${item}</option>`).join("")}</select></label>
          <label><span>Date</span><input type="date" value="2026-03-17" /></label>
          <label><span>Time</span><input type="time" value="09:15" /></label>
          <label><span>Duration</span><input type="text" placeholder="14m" /></label>
          <label><span>Handled by</span><input type="text" placeholder="Derek" /></label>
          <label><span>Contact / buyer</span><input type="text" placeholder="Buyer or caller name" /></label>
          <label class="form-grid__full"><span>Notes</span><textarea rows="4" placeholder="Context, timing, and what happened on the call or interaction."></textarea></label>
        </div>
        <div class="form-actions">
          <button class="ghost-link ghost-link--strong">Save Manual Entry</button>
        </div>
      </article>
      <article class="panel panel--wide">
        <div class="panel-head">
          <div><p class="eyebrow">Recent logs</p><h3>Manual entries and uncaptured interactions</h3></div>
          <div class="panel-actions">${exportButton("Export Recent Logs", { "data-export-route": "data-ops", "data-export-section": "manual-log" })}</div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Source</th><th>Owner</th><th>Type</th><th>Date</th><th>Time</th><th>Duration</th><th>Contact</th><th>Impact</th><th>Notes</th></tr></thead>
            <tbody>
              ${appData.dataOps.recentEntries
                .map(
                  (row) => `
                    <tr>
                      <td>${row.source}</td>
                      <td>${row.owner}</td>
                      <td>${row.type}</td>
                      <td>${row.date}</td>
                      <td>${row.time}</td>
                      <td>${row.duration}</td>
                      <td>${row.contact}</td>
                      <td>${row.impact}</td>
                      <td class="notes-cell">${row.notes}</td>
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
      <article class="panel panel--wide">
        <div class="panel-head">
          <div><p class="eyebrow">Historical backlog</p><h3>Files to upload and normalize</h3></div>
          <div class="panel-actions">${exportButton("Export Import Queue", { "data-export-route": "data-ops", "data-export-section": "imports" })}</div>
        </div>
        <div class="upload-dropzone">
          <strong>Upload backlog files</strong>
          <p>Drop spreadsheets, CSVs, PDFs, or exported reports here once the backend storage pipeline is wired in.</p>
          <button class="ghost-link ghost-link--strong">Choose Files</button>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>File</th><th>Category</th><th>Status</th><th>Records</th><th>Notes</th></tr></thead>
            <tbody>
              ${appData.dataOps.importQueue
                .map(
                  (row) => `
                    <tr>
                      <td>${row.name}</td>
                      <td>${row.category}</td>
                      <td>${row.status}</td>
                      <td>${row.records}</td>
                      <td class="notes-cell">${row.note}</td>
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
          <div><p class="eyebrow">Reports</p><h3>Custom report builder</h3></div>
        </div>
        <div class="form-grid">
          <label>
            <span>Data page</span>
            <select id="report-page">
              <option value="calls" ${state.reportPage === "calls" ? "selected" : ""}>Calls</option>
              <option value="satisfaction" ${state.reportPage === "satisfaction" ? "selected" : ""}>Satisfaction</option>
              <option value="sales" ${state.reportPage === "sales" ? "selected" : ""}>Sales</option>
              <option value="buyers" ${state.reportPage === "buyers" ? "selected" : ""}>Buyers</option>
              <option value="campaigns" ${state.reportPage === "campaigns" ? "selected" : ""}>Campaigns</option>
              <option value="inventory" ${state.reportPage === "inventory" ? "selected" : ""}>Inventory</option>
              <option value="team" ${state.reportPage === "team" ? "selected" : ""}>Team</option>
              <option value="data-ops" ${state.reportPage === "data-ops" ? "selected" : ""}>Data Ops</option>
            </select>
          </label>
          <label>
            <span>Section</span>
            <select id="report-section">
              ${sectionOptions.map((option) => `<option value="${option.id}" ${option.id === activeSection ? "selected" : ""}>${option.label}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Format</span>
            <select id="report-format">
              <option value="csv" ${state.reportFormat === "csv" ? "selected" : ""}>CSV</option>
              <option value="json" ${state.reportFormat === "json" ? "selected" : ""}>JSON</option>
            </select>
          </label>
        </div>
        <div class="form-actions">
          ${exportButton("Export Custom Report", { "data-export-route": "__custom__", "data-export-section": "custom" })}
        </div>
        <div class="rank-list">
          ${appData.dataOps.reportTemplates
            .map(
              (row) => `
                <div class="rank-row rank-row--static">
                  <span>${row.name}</span>
                  <strong>${row.format}</strong>
                  <small>${row.includes}</small>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function pageMarkup(route) {
  if (route === "calls") return callsPage();
  if (route === "satisfaction") return satisfactionPage();
  if (route === "sales") return salesPage();
  if (route === "buyers") return buyersPage();
  if (route === "campaigns") return campaignsPage();
  if (route === "inventory") return inventoryPage();
  if (route === "team") return teamPage();
  if (route === "data-ops") return dataOpsPage();
  return overviewPage();
}

function renderAssistantPlaceholder() {
  const container = document.querySelector("#assistant-results");
  container.innerHTML = `
    <div class="assistant-result-card">
      <strong>Quick search</strong>
      <p>Use this to search calls, buyers, campaigns, lots, and notes once real data is wired in.</p>
    </div>
  `;
  container.classList.add("has-content");
}

function bindApp() {
  document.querySelectorAll("[data-route]").forEach((node) => {
    node.addEventListener("click", () => {
      if (node.dataset.focus) {
        state.focusMetric = node.dataset.focus;
      }
      window.location.hash = node.dataset.route;
    });
  });

  const range = document.querySelector("#global-range");
  const compare = document.querySelector("#global-compare");
  const inventoryView = document.querySelector("#inventory-view");
  const buyersSearch = document.querySelector("#buyers-search");
  const reportPage = document.querySelector("#report-page");
  const reportSection = document.querySelector("#report-section");
  const reportFormat = document.querySelector("#report-format");

  if (range) {
    range.addEventListener("change", () => {
      state.range = range.value;
      render();
    });
  }

  if (compare) {
    compare.addEventListener("change", () => {
      state.compare = compare.value;
      render();
    });
  }

  if (inventoryView) {
    inventoryView.addEventListener("change", () => {
      state.inventoryView = inventoryView.value;
      render();
    });
  }

  if (buyersSearch) {
    buyersSearch.addEventListener("input", () => {
      state.buyersSearch = buyersSearch.value;
      render();
      const input = document.querySelector("#buyers-search");
      if (input) {
        input.focus();
        input.setSelectionRange(state.buyersSearch.length, state.buyersSearch.length);
      }
    });
  }

  if (reportPage) {
    reportPage.addEventListener("change", () => {
      state.reportPage = reportPage.value;
      const nextOptions = reportSections(state.reportPage);
      if (!nextOptions.some((option) => option.id === state.reportSection)) {
        state.reportSection = nextOptions[0].id;
      }
      render();
    });
  }

  if (reportSection) {
    reportSection.addEventListener("change", () => {
      state.reportSection = reportSection.value;
    });
  }

  if (reportFormat) {
    reportFormat.addEventListener("change", () => {
      state.reportFormat = reportFormat.value;
    });
  }

  document.querySelectorAll("[data-export-route]").forEach((node) => {
    node.addEventListener("click", () => {
      if (node.dataset.exportRoute === "__custom__") {
        runExport(state.reportPage, state.reportSection, state.reportFormat);
        return;
      }

      runExport(node.dataset.exportRoute, node.dataset.exportSection || "page", node.dataset.exportFormat || "csv");
    });
  });

  const logoutButton = document.querySelector("#logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await logout();
    });
  }
}

function bindLogin() {
  const loginForm = document.querySelector("#login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    authState.status = "submitting";
    authState.error = "";
    render();

    const username = document.querySelector("#login-username")?.value || "";
    const password = document.querySelector("#login-password")?.value || "";

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ username, password })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        authState.status = response.status === 500 ? "config-error" : "anonymous";
        authState.error = payload.error || "Unable to sign in.";
        render();
        return;
      }

      authState.status = "authenticated";
      authState.user = payload.username ? { username: payload.username } : { username };
      authState.error = "";
      render();
    } catch {
      authState.status = "anonymous";
      authState.error = "The sign-in service is unavailable right now.";
      render();
    }
  });
}

async function checkSession() {
  authState.status = "loading";
  authState.error = "";

  try {
    const response = await fetch("/api/auth/me", {
      credentials: "same-origin"
    });

    if (response.ok) {
      const payload = await response.json();
      authState.status = "authenticated";
      authState.user = payload.user;
      return;
    }

    if (response.status === 401) {
      authState.status = "anonymous";
      authState.user = null;
      return;
    }

    authState.status = "config-error";
    authState.user = null;
    authState.error = "Authentication is not configured yet.";
  } catch {
    authState.status = "anonymous";
    authState.user = null;
    authState.error = "The sign-in service is unavailable right now.";
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } catch {
    // Clear the client view even if the request fails.
  }

  authState.status = "anonymous";
  authState.user = null;
  authState.error = "";
  render();
}

function render() {
  if (authState.status === "loading") {
    app.innerHTML = `
      <div class="auth-shell">
        <section class="auth-card auth-card--loading">
          <div class="brand">
            <div class="brand-mark">HG</div>
            <div>
              <p class="eyebrow">Secure Access</p>
              <h1>${appData.property.name}</h1>
            </div>
          </div>
          <div class="auth-copy">
            <h2>Checking session</h2>
            <p>Loading the secure dashboard.</p>
          </div>
        </section>
      </div>
    `;
    return;
  }

  if (authState.status !== "authenticated") {
    app.innerHTML = loginShell();
    bindLogin();
    return;
  }

  const route = currentRoute();
  app.innerHTML = shell(route);
  renderAssistantPlaceholder();
  bindApp();
}

window.addEventListener("hashchange", render);

checkSession().then(render);
