const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function makeSeries(values) {
  return monthLabels.map((label, index) => ({ label, value: values[index] }));
}

export const appData = {
  property: {
    name: "Hearthside Grove Motorcoach Resort",
    location: "Michigan",
    assistantLabel: "Quick search. Think of it like Google for your business."
  },
  ranges: [
    { id: "14d", label: "Last 14 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
    { id: "ytd", label: "Year to Date" },
    { id: "2y", label: "Last 2 Years" }
  ],
  compareOptions: [
    { id: "prev", label: "vs previous period" },
    { id: "lastYear", label: "vs same period last year" }
  ],
  dataOps: {
    summary: [
      { label: "Manual Entries Today", value: "6" },
      { label: "Files Pending Import", value: "4" },
      { label: "Historical Coverage", value: "5 Years" },
      { label: "Last Data Refresh", value: "8:12 AM" }
    ],
    manualEntryTypes: [
      "Phone Call",
      "Walk-In Lead",
      "Manual Sale Update",
      "Customer Satisfaction Follow-Up",
      "Issue / Complaint",
      "Owner Note"
    ],
    recentEntries: [
      { source: "Personal Phone", owner: "Derek", type: "Phone Call", date: "2026-03-17", time: "9:12 AM", duration: "14m", contact: "Greg Harlow", impact: "Lead follow-up", notes: "Buyer asked about premium plus inventory and availability timeline." },
      { source: "Front Desk", owner: "Alyssa M.", type: "Issue / Complaint", date: "2026-03-17", time: "10:04 AM", duration: "8m", contact: "Tom Becker", impact: "Service recovery", notes: "Clarified annual fee misunderstanding and documented follow-up." },
      { source: "Sales Office", owner: "Marcus R.", type: "Manual Sale Update", date: "2026-03-16", time: "4:28 PM", duration: "11m", contact: "Jan Flynn", impact: "Deal stage moved", notes: "Deposit confirmed and contract status advanced to signed." },
      { source: "Personal Phone", owner: "Derek", type: "Phone Call", date: "2026-03-15", time: "7:42 PM", duration: "21m", contact: "Robert Flynn", impact: "High intent buyer", notes: "Late-evening call not captured in phone system; discussed travel plans and lot type fit." },
      { source: "Admin", owner: "Priya S.", type: "Customer Satisfaction Follow-Up", date: "2026-03-15", time: "1:18 PM", duration: "6m", contact: "Martha Clark", impact: "CSAT logged", notes: "Follow-up completed after check-in concern; resolved positively." }
    ],
    importQueue: [
      { name: "2021 buyer-export.xlsx", category: "Buyer history", status: "Ready to import", records: 418, note: "Historical buyer records from legacy spreadsheet." },
      { name: "2022 call-log.csv", category: "Call logs", status: "Needs mapping", records: 2287, note: "Phone export requires source field mapping." },
      { name: "mailchimp-archive-2023.csv", category: "Campaign archive", status: "Ready to import", records: 24, note: "Year of campaign results for engagement history." },
      { name: "quickbooks-sales-2019-2024.xlsx", category: "Finance history", status: "Pending review", records: 612, note: "Needs normalization by lot number and close date." }
    ],
    reportTemplates: [
      { name: "Executive Weekly Snapshot", format: "PDF", includes: "Top KPIs, response trend, pending deals, service alerts" },
      { name: "Calls and Response Report", format: "CSV", includes: "Call logs, missed windows, callback timing, owner notes" },
      { name: "Buyer Origin Summary", format: "CSV", includes: "Buyer records, state totals, days to close, notes" },
      { name: "Inventory by Lot Type", format: "PDF", includes: "For-sale count, under contract, sold trend, pricing" }
    ]
  },
  overview: {
    widgets: [
      {
        id: "calls-received",
        label: "Calls Received",
        page: "calls",
        valueByRange: { "14d": 128, "30d": 274, "90d": 826, ytd: 2418, "2y": 6250 },
        delta: "-4.2%",
        note: "Lower than prior period, but weekend volume was lighter than normal."
      },
      {
        id: "callbacks-completed",
        label: "Callbacks Completed",
        page: "calls",
        valueByRange: { "14d": 101, "30d": 214, "90d": 659, ytd: 1942, "2y": 5030 },
        delta: "-21.0%",
        note: "Completion rate is softer than the prior period and should be reviewed in context."
      },
      {
        id: "avg-response-time",
        label: "Average Response Time",
        page: "calls",
        valueByRange: { "14d": "28m", "30d": "34m", "90d": "39m", ytd: "36m", "2y": "41m" },
        delta: "+6m",
        note: "Response times worsened in the most recent two-week window."
      },
      {
        id: "csat",
        label: "Customer Satisfaction",
        page: "satisfaction",
        valueByRange: { "14d": "92%", "30d": "90%", "90d": "89%", ytd: "90%", "2y": "88%" },
        delta: "+2.0 pts",
        note: "Text and phone follow-up satisfaction remains strong."
      },
      {
        id: "deals-pending",
        label: "Deals Pending",
        page: "sales",
        valueByRange: { "14d": 9, "30d": 12, "90d": 14, ytd: 11, "2y": 13 },
        delta: "+3",
        note: "Pending contracts and underwriting items."
      },
      {
        id: "lots-for-sale",
        label: "Lots For Sale",
        page: "inventory",
        valueByRange: { "14d": 41, "30d": 41, "90d": 44, ytd: 41, "2y": 48 },
        delta: "-3",
        note: "Current active inventory across all lot types."
      }
    ]
  },
  calls: {
    summary: [
      { label: "Calls Received", valueByRange: { "14d": 128, "30d": 274, "90d": 826, ytd: 2418, "2y": 6250 }, delta: "-4.2%" },
      { label: "Callbacks Completed", valueByRange: { "14d": 101, "30d": 214, "90d": 659, ytd: 1942, "2y": 5030 }, delta: "-21.0%" },
      { label: "Calls Waiting", valueByRange: { "14d": 17, "30d": 22, "90d": 29, ytd: 24, "2y": 27 }, delta: "+7" },
      { label: "Avg Response Time", valueByRange: { "14d": "28m", "30d": "34m", "90d": "39m", ytd: "36m", "2y": "41m" }, delta: "+6m" }
    ],
    receivedSeries: {
      "14d": [
        { label: "Wk 1", value: 61 },
        { label: "Wk 2", value: 67 }
      ],
      "30d": [
        { label: "Wk 1", value: 61 },
        { label: "Wk 2", value: 67 },
        { label: "Wk 3", value: 72 },
        { label: "Wk 4", value: 74 }
      ],
      "90d": [
        { label: "Jan", value: 258 },
        { label: "Feb", value: 271 },
        { label: "Mar", value: 297 }
      ],
      ytd: makeSeries([248, 261, 274, 292, 307, 318, 252, 0, 0, 0, 0, 0]),
      "2y": [
        { label: "2025", value: 3120 },
        { label: "2026", value: 3130 }
      ]
    },
    callbackLagSeries: {
      "14d": [
        { label: "Wk 1", value: 22 },
        { label: "Wk 2", value: 34 }
      ],
      "30d": [
        { label: "Wk 1", value: 22 },
        { label: "Wk 2", value: 34 },
        { label: "Wk 3", value: 31 },
        { label: "Wk 4", value: 28 }
      ],
      "90d": [
        { label: "Jan", value: 31 },
        { label: "Feb", value: 37 },
        { label: "Mar", value: 42 }
      ],
      ytd: makeSeries([34, 39, 36, 33, 31, 34, 28, 0, 0, 0, 0, 0]),
      "2y": [
        { label: "2025", value: 43 },
        { label: "2026", value: 36 }
      ]
    },
    hourlyBreakdown: [
      { hour: "8a-10a", calls: 18, missed: 4 },
      { hour: "10a-12p", calls: 31, missed: 6 },
      { hour: "12p-2p", calls: 25, missed: 5 },
      { hour: "2p-4p", calls: 29, missed: 7 },
      { hour: "4p-6p", calls: 17, missed: 5 }
    ],
    reasons: [
      { label: "Staff on tours", value: "7 missed call windows" },
      { label: "Lunch / break overlap", value: "4 missed coverage gaps" },
      { label: "After-hours voicemails", value: "6 next-day returns required" }
    ]
  },
  satisfaction: {
    summary: [
      { label: "CSAT", valueByRange: { "14d": "92%", "30d": "90%", "90d": "89%", ytd: "90%", "2y": "88%" }, delta: "+2.0 pts" },
      { label: "Open Issues", valueByRange: { "14d": 4, "30d": 6, "90d": 8, ytd: 7, "2y": 9 }, delta: "-2" },
      { label: "Resolved < 48h", valueByRange: { "14d": "83%", "30d": "80%", "90d": "78%", ytd: "79%", "2y": "76%" }, delta: "+4 pts" }
    ],
    csatSeries: {
      "14d": [
        { label: "Wk 1", value: 89 },
        { label: "Wk 2", value: 92 }
      ],
      "30d": [
        { label: "Wk 1", value: 88 },
        { label: "Wk 2", value: 89 },
        { label: "Wk 3", value: 91 },
        { label: "Wk 4", value: 90 }
      ],
      "90d": [
        { label: "Jan", value: 87 },
        { label: "Feb", value: 89 },
        { label: "Mar", value: 91 }
      ],
      ytd: makeSeries([87, 89, 91, 90, 88, 90, 92, 0, 0, 0, 0, 0]),
      "2y": [
        { label: "2025", value: 88 },
        { label: "2026", value: 90 }
      ]
    },
    issues: [
      { category: "Response delay", count: 6 },
      { category: "Billing confusion", count: 3 },
      { category: "Check-in questions", count: 2 }
    ]
  },
  sales: {
    summary: [
      { label: "Deals Pending", valueByRange: { "14d": 9, "30d": 12, "90d": 14, ytd: 11, "2y": 13 }, delta: "+3" },
      { label: "Lots Sold", valueByRange: { "14d": 4, "30d": 7, "90d": 18, ytd: 34, "2y": 71 }, delta: "+2" },
      { label: "Revenue", valueByRange: { "14d": "$412K", "30d": "$728K", "90d": "$1.84M", ytd: "$3.92M", "2y": "$8.11M" }, delta: "+8.1%" }
    ],
    revenueSeries: {
      "14d": [
        { label: "Wk 1", value: 182 },
        { label: "Wk 2", value: 230 }
      ],
      "30d": [
        { label: "Wk 1", value: 182 },
        { label: "Wk 2", value: 230 },
        { label: "Wk 3", value: 144 },
        { label: "Wk 4", value: 172 }
      ],
      "90d": [
        { label: "Jan", value: 560 },
        { label: "Feb", value: 602 },
        { label: "Mar", value: 678 }
      ],
      ytd: makeSeries([520, 560, 640, 690, 760, 815, 890, 0, 0, 0, 0, 0]),
      "2y": [
        { label: "2025", value: 4010 },
        { label: "2026", value: 4100 }
      ]
    },
    pipeline: [
      { stage: "New Lead", count: 38 },
      { stage: "Tour Scheduled", count: 21 },
      { stage: "Follow-up", count: 16 },
      { stage: "Under Contract", count: 12 }
    ]
  },
  buyers: {
    summary: [
      { label: "Top Origin State", value: "Ohio", note: "31 buyers in current year" },
      { label: "Best Avg Deal Size", value: "$102K", note: "California buyers" },
      { label: "Average Calls to Close", value: "6.1", note: "Across buyer sample" },
      { label: "Average Days to Buy", value: "46", note: "Lead to signed deal" }
    ],
    topStates: [
      { state: "Ohio", buyers: 31, revenueLabel: "$2.42M", avgPriceLabel: "$78K" },
      { state: "Michigan", buyers: 19, revenueLabel: "$1.54M", avgPriceLabel: "$81K" },
      { state: "Indiana", buyers: 17, revenueLabel: "$1.28M", avgPriceLabel: "$75K" },
      { state: "Florida", buyers: 14, revenueLabel: "$1.17M", avgPriceLabel: "$84K" },
      { state: "Pennsylvania", buyers: 12, revenueLabel: "$978K", avgPriceLabel: "$81K" }
    ],
    buyerDirectory: Array.from({ length: 25 }, (_, index) => ({
      name: [
        "Mark Ellison", "Susan Ellison", "Greg Harlow", "Dana Harlow", "James Porter",
        "Lynn Porter", "Michael Reeves", "Carol Reeves", "Brian Kessler", "Tina Kessler",
        "Ronald Pierce", "Elaine Pierce", "Kevin Matson", "Patricia Matson", "David Moreno",
        "Alicia Moreno", "Steven Clark", "Martha Clark", "Anthony Walsh", "Lisa Walsh",
        "Robert Flynn", "Jan Flynn", "Tom Becker", "Nancy Becker", "Jeff Harmon"
      ][index],
      state: ["Ohio", "Ohio", "Michigan", "Michigan", "Indiana", "Indiana", "Ohio", "Ohio", "Pennsylvania", "Pennsylvania", "Illinois", "Illinois", "Ohio", "Ohio", "California", "California", "Michigan", "Michigan", "Indiana", "Indiana", "Ohio", "Ohio", "Florida", "Florida", "Illinois"][index],
      city: ["Columbus", "Columbus", "Detroit", "Detroit", "Indianapolis", "Indianapolis", "Cleveland", "Cleveland", "Pittsburgh", "Pittsburgh", "Chicago", "Chicago", "Cincinnati", "Cincinnati", "Los Angeles", "Los Angeles", "Grand Rapids", "Grand Rapids", "Fort Wayne", "Fort Wayne", "Toledo", "Toledo", "Naples", "Naples", "Peoria"][index],
      calls: [6, 4, 5, 3, 8, 7, 4, 3, 9, 7, 6, 5, 5, 4, 10, 8, 4, 3, 6, 5, 7, 5, 8, 7, 4][index],
      tours: [2, 1, 2, 1, 3, 2, 1, 1, 3, 2, 2, 1, 2, 1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1][index],
      daysToBuy: [41, 39, 28, 25, 54, 52, 31, 31, 63, 60, 44, 42, 35, 34, 74, 71, 26, 24, 38, 37, 47, 45, 66, 64, 29][index],
      lot: String(11 + index * 9),
      notes: "Tracked closely with notes, callback count, and timing to close."
    }))
  },
  campaigns: {
    summary: [
      { label: "Campaigns Sent", value: "12" },
      { label: "Emails Delivered", value: "60.3K" },
      { label: "Open Rate", value: "44.2%" },
      { label: "Click Rate", value: "9.8%" }
    ],
    table: [
      { date: "2026-01-12", campaign: "January Inventory", sent: 5120, delivered: 5062, openRate: "42.1%", clickRate: "9.4%", unsubscribes: 9 },
      { date: "2026-02-16", campaign: "Tax Season Offer", sent: 5185, delivered: 5128, openRate: "43.8%", clickRate: "9.7%", unsubscribes: 8 },
      { date: "2026-03-14", campaign: "Spring Escape", sent: 5240, delivered: 5182, openRate: "48.4%", clickRate: "11.2%", unsubscribes: 10 }
    ],
    deviceMix: [
      { label: "Mobile", value: 58 },
      { label: "Desktop", value: 34 },
      { label: "Tablet", value: 8 }
    ]
  },
  inventory: {
    summary: [
      { label: "Total Lots", value: "263" },
      { label: "For Sale", value: "41" },
      { label: "Under Contract", value: "12" },
      { label: "Sold in Last 12 Months", value: "36" }
    ],
    soldHistory: {
      year: [
        { period: "2023", sold: 29 },
        { period: "2024", sold: 36 },
        { period: "2025", sold: 34 },
        { period: "2026", sold: 18 }
      ],
      month: [
        { period: "Jan", sold: 2 },
        { period: "Feb", sold: 1 },
        { period: "Mar", sold: 3 },
        { period: "Apr", sold: 2 },
        { period: "May", sold: 1 },
        { period: "Jun", sold: 2 },
        { period: "Jul", sold: 2 },
        { period: "Aug", sold: 1 },
        { period: "Sep", sold: 2 },
        { period: "Oct", sold: 1 },
        { period: "Nov", sold: 1 },
        { period: "Dec", sold: 0 }
      ],
      type: [
        { period: "Standard", sold: 9 },
        { period: "Deluxe", sold: 8 },
        { period: "Premium", sold: 7 },
        { period: "Premium Plus", sold: 6 },
        { period: "Luxury", sold: 6 }
      ]
    },
    lotTypes: [
      { type: "Standard", total: 62, forSale: 14, underContract: 3, soldLast12Months: 9, avgPrice: "$64K" },
      { type: "Deluxe", total: 58, forSale: 10, underContract: 3, soldLast12Months: 8, avgPrice: "$76K" },
      { type: "Premium", total: 54, forSale: 8, underContract: 2, soldLast12Months: 7, avgPrice: "$92K" },
      { type: "Premium Plus", total: 46, forSale: 6, underContract: 2, soldLast12Months: 6, avgPrice: "$108K" },
      { type: "Luxury", total: 43, forSale: 3, underContract: 2, soldLast12Months: 6, avgPrice: "$134K" }
    ]
  },
  team: {
    summary: [
      { label: "Active Reps", value: "4" },
      { label: "Overdue Follow-ups", value: "4" },
      { label: "Tours This Week", value: "18" },
      { label: "Deals Closed", value: "12" }
    ],
    reps: [
      { name: "Alyssa M.", calls: 86, callbacks: 31, tours: 9, deals: 4, response: "24m" },
      { name: "Marcus R.", calls: 72, callbacks: 28, tours: 7, deals: 3, response: "31m" },
      { name: "Devon L.", calls: 64, callbacks: 24, tours: 6, deals: 3, response: "34m" },
      { name: "Priya S.", calls: 58, callbacks: 21, tours: 5, deals: 2, response: "38m" }
    ]
  }
};
