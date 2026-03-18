const revenueByYear = [
  {
    year: 2019,
    totalRevenue: 4.2,
    lotsSold: 61,
    avgSalePrice: 68.9,
    medianSalePrice: 64.5,
    listedLots: 84,
    leadConversion: 6.4,
    tourConversion: 24.1,
    months: [240, 265, 280, 305, 355, 390, 440, 430, 395, 360, 330, 410]
  },
  {
    year: 2020,
    totalRevenue: 5.0,
    lotsSold: 78,
    avgSalePrice: 71.2,
    medianSalePrice: 67.4,
    listedLots: 102,
    leadConversion: 7.8,
    tourConversion: 27.5,
    months: [270, 285, 310, 360, 405, 435, 505, 495, 470, 425, 400, 640]
  },
  {
    year: 2021,
    totalRevenue: 7.4,
    lotsSold: 116,
    avgSalePrice: 76.8,
    medianSalePrice: 72.3,
    listedLots: 141,
    leadConversion: 9.8,
    tourConversion: 34.2,
    months: [420, 460, 520, 570, 620, 655, 710, 690, 640, 590, 555, 970]
  },
  {
    year: 2022,
    totalRevenue: 6.5,
    lotsSold: 101,
    avgSalePrice: 74.4,
    medianSalePrice: 70.2,
    listedLots: 134,
    leadConversion: 8.9,
    tourConversion: 31.1,
    months: [360, 385, 430, 470, 515, 560, 610, 595, 560, 500, 485, 630]
  },
  {
    year: 2023,
    totalRevenue: 8.1,
    lotsSold: 123,
    avgSalePrice: 78.5,
    medianSalePrice: 73.6,
    listedLots: 156,
    leadConversion: 9.1,
    tourConversion: 33.5,
    months: [470, 520, 610, 650, 720, 760, 810, 785, 730, 680, 630, 735]
  },
  {
    year: 2024,
    totalRevenue: 8.9,
    lotsSold: 131,
    avgSalePrice: 79.8,
    medianSalePrice: 74.5,
    listedLots: 168,
    leadConversion: 9.4,
    tourConversion: 34.0,
    months: [520, 560, 640, 690, 760, 815, 890, 860, 790, 720, 690, 765]
  }
];

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const stateYearly = {
  2020: [
    ["Ohio", 21, 1.41, 67.1],
    ["Michigan", 11, 0.82, 74.5],
    ["Indiana", 10, 0.68, 68.3],
    ["Pennsylvania", 8, 0.58, 72.2],
    ["Illinois", 7, 0.52, 74.1],
    ["Kentucky", 5, 0.33, 66.0]
  ],
  2021: [
    ["Ohio", 34, 2.38, 70.0],
    ["Michigan", 20, 1.54, 77.0],
    ["Indiana", 18, 1.28, 71.1],
    ["Pennsylvania", 14, 1.05, 75.2],
    ["Illinois", 10, 0.82, 82.0],
    ["California", 7, 0.76, 108.5]
  ],
  2022: [
    ["Ohio", 30, 2.11, 70.3],
    ["Michigan", 16, 1.18, 73.8],
    ["Indiana", 15, 1.04, 69.3],
    ["Pennsylvania", 11, 0.81, 73.6],
    ["Illinois", 8, 0.65, 81.2],
    ["California", 6, 0.61, 101.6]
  ],
  2023: [
    ["Ohio", 32, 2.38, 74.4],
    ["Michigan", 18, 1.42, 78.8],
    ["Indiana", 16, 1.18, 73.9],
    ["Pennsylvania", 12, 0.95, 79.2],
    ["Illinois", 9, 0.76, 84.4],
    ["California", 7, 0.72, 102.8]
  ],
  2024: [
    ["Ohio", 31, 2.42, 78.0],
    ["Michigan", 19, 1.54, 81.0],
    ["Indiana", 17, 1.28, 75.0],
    ["Pennsylvania", 12, 0.978, 81.5],
    ["Illinois", 10, 0.83, 83.0],
    ["California", 6, 0.612, 102.0]
  ],
  2025: [
    ["Ohio", 33, 2.68, 81.2],
    ["Michigan", 20, 1.67, 83.5],
    ["Indiana", 18, 1.39, 77.2],
    ["Pennsylvania", 13, 1.08, 83.1],
    ["Illinois", 11, 0.93, 84.5],
    ["California", 7, 0.75, 107.1]
  ],
  2026: [
    ["Ohio", 35, 2.95, 84.3],
    ["Michigan", 22, 1.83, 83.2],
    ["Indiana", 19, 1.49, 78.4],
    ["Pennsylvania", 14, 1.17, 83.6],
    ["Illinois", 12, 1.02, 85.0],
    ["California", 8, 0.88, 110.0]
  ]
};

const campaigns = [
  ["2023-01-18", "New Year Preview", "Prospect", 4120, 38.4, 7.1, 11, 5, 1, 0.076],
  ["2023-02-15", "Lakeside Savings", "Launch", 4180, 40.1, 8.4, 14, 6, 2, 0.129],
  ["2023-03-22", "Spring Escape", "Feature", 4215, 46.8, 11.6, 22, 9, 3, 0.214],
  ["2023-04-19", "Owner Referral Push", "Referral", 4260, 49.2, 10.9, 18, 7, 2, 0.168],
  ["2023-05-24", "Memorial Weekend", "Seasonal", 4305, 43.8, 9.2, 16, 7, 2, 0.152],
  ["2023-06-21", "Waterfront Lots", "Feature", 4350, 44.1, 10.4, 19, 8, 3, 0.231],
  ["2023-07-19", "Summer Tour Days", "Event", 4415, 41.5, 8.8, 17, 8, 2, 0.163],
  ["2023-08-23", "Investor Weekend", "Event", 4485, 39.6, 8.1, 15, 6, 2, 0.151],
  ["2023-09-20", "Fall Pricing Window", "Offer", 4510, 42.2, 8.7, 16, 7, 2, 0.165],
  ["2023-10-18", "Columbus Drive Market", "Regional", 4590, 40.9, 7.9, 14, 6, 2, 0.141],
  ["2023-11-15", "Holiday Buyer List", "Prospect", 4625, 37.8, 6.5, 10, 4, 1, 0.079],
  ["2023-12-13", "Year-End Closing Push", "Close", 4680, 45.4, 10.2, 20, 8, 3, 0.246],
  ["2024-01-17", "New Inventory Release", "Launch", 4735, 41.3, 8.6, 15, 7, 2, 0.158],
  ["2024-02-14", "Tax Refund Buyers", "Seasonal", 4780, 42.1, 8.9, 17, 7, 2, 0.164],
  ["2024-03-20", "Spring Escape", "Feature", 4860, 48.0, 12.4, 24, 10, 3, 0.238],
  ["2024-04-17", "Lake Lot Spotlight", "Feature", 4910, 44.0, 10.8, 21, 9, 3, 0.221],
  ["2024-05-22", "Referral Push", "Referral", 4975, 51.0, 11.1, 18, 8, 2, 0.176],
  ["2024-06-19", "Investor Weekend", "Event", 5050, 39.0, 8.6, 16, 7, 2, 0.171],
  ["2024-07-17", "Peak Season Tour Days", "Event", 5125, 43.5, 9.8, 19, 8, 3, 0.241],
  ["2024-08-21", "Ohio Family Escape", "Regional", 5190, 47.1, 10.5, 20, 9, 3, 0.233],
  ["2024-09-18", "Fall Inventory Drop", "Launch", 5265, 42.9, 9.2, 17, 7, 2, 0.184],
  ["2024-10-16", "End of Season Incentive", "Offer", 5310, 40.5, 8.3, 14, 6, 2, 0.149],
  ["2024-11-13", "VIP Buyer Weekend", "Event", 5360, 46.2, 11.2, 22, 9, 3, 0.264],
  ["2024-12-11", "Year-End Closing Push", "Close", 5420, 45.1, 10.6, 21, 8, 3, 0.251]
].map(([date, name, type, recipients, openRate, clickRate, leads, tours, sales, revenueMillions]) => ({
  date,
  month: date.slice(0, 7),
  name,
  type,
  recipients,
  delivered: Math.round(recipients * 0.989),
  deliveryRate: 98.9,
  opens: Math.round(recipients * (openRate / 100)),
  openRate,
  uniqueClicks: Math.round(recipients * (clickRate / 100)),
  clickRate,
  clickToOpenRate: Number(((clickRate / openRate) * 100).toFixed(1)),
  hardBounces: Math.round(recipients * 0.003),
  softBounces: Math.round(recipients * 0.008),
  bounceRate: 1.1,
  unsubscribes: Math.round(recipients * 0.0022),
  unsubscribeRate: 0.22,
  spamComplaints: Math.max(1, Math.round(recipients * 0.0002)),
  spamRate: 0.02,
  leads,
  tours,
  sales,
  revenue: revenueMillions,
  revenueLabel: `$${(revenueMillions * 1000).toFixed(0)}K`
}));

const repPerformance = [
  {
    name: "Alyssa M.",
    region: "Midwest",
    calls: 86,
    callbacks: 31,
    leads: 24,
    tours: 9,
    deals: 4,
    revenue: 0.318,
    closeRate: 16.7,
    overdue: 1,
    monthly: [
      ["Jan", 42], ["Feb", 46], ["Mar", 53], ["Apr", 48], ["May", 57], ["Jun", 61]
    ]
  },
  {
    name: "Marcus R.",
    region: "Ohio",
    calls: 72,
    callbacks: 28,
    leads: 20,
    tours: 7,
    deals: 3,
    revenue: 0.249,
    closeRate: 15.0,
    overdue: 2,
    monthly: [
      ["Jan", 36], ["Feb", 39], ["Mar", 45], ["Apr", 43], ["May", 49], ["Jun", 52]
    ]
  },
  {
    name: "Devon L.",
    region: "Remote",
    calls: 64,
    callbacks: 24,
    leads: 18,
    tours: 6,
    deals: 3,
    revenue: 0.228,
    closeRate: 16.6,
    overdue: 0,
    monthly: [
      ["Jan", 29], ["Feb", 34], ["Mar", 39], ["Apr", 41], ["May", 45], ["Jun", 47]
    ]
  },
  {
    name: "Priya S.",
    region: "Northeast",
    calls: 58,
    callbacks: 21,
    leads: 15,
    tours: 5,
    deals: 2,
    revenue: 0.166,
    closeRate: 13.3,
    overdue: 1,
    monthly: [
      ["Jan", 24], ["Feb", 26], ["Mar", 31], ["Apr", 33], ["May", 36], ["Jun", 38]
    ]
  }
].map((rep) => ({
  ...rep,
  revenueLabel: `$${Math.round(rep.revenue * 1000)}K`
}));

const inventoryLots = [
  ["A-08", "Lakeside", "Pending Close", 96, 93, 21, "Ohio", "Spring Escape"],
  ["A-15", "Lakeside", "Sold", 99, 101, 34, "Michigan", "VIP Buyer Weekend"],
  ["A-19", "Lakeside", "Available", 104, null, 15, "", ""],
  ["B-14", "Ridgeline", "Available", 78, null, 11, "", ""],
  ["B-22", "Ridgeline", "Reserved", 81, null, 17, "Indiana", "Lake Lot Spotlight"],
  ["C-12", "Pine Hollow", "Tour Scheduled", 69, null, 6, "Pennsylvania", "Ohio Family Escape"],
  ["C-18", "Pine Hollow", "Available", 72, null, 29, "", ""],
  ["D-03", "Meadow View", "Reserved", 64, null, 13, "Ohio", "Referral Push"],
  ["D-11", "Meadow View", "Sold", 67, 66, 39, "Illinois", "Investor Weekend"],
  ["E-07", "Creekside", "Available", 74, null, 9, "", ""]
].map(([lot, phase, status, listPrice, soldPrice, days, buyerState, sourceCampaign]) => ({
  lot,
  phase,
  status,
  listPrice,
  soldPrice,
  days,
  buyerState,
  sourceCampaign,
  listPriceLabel: `$${listPrice}K`,
  soldPriceLabel: soldPrice ? `$${soldPrice}K` : "-"
}));

const detailedBuyers = [
  ["Mark Ellison", "Ohio", "Columbus", 6, 41, "Closed after two in-person tours. Wanted premium concrete pad near clubhouse."],
  ["Susan Ellison", "Ohio", "Columbus", 4, 39, "Spouse on title. Asked for rental policy and owner standards."],
  ["Greg Harlow", "Michigan", "Detroit", 5, 28, "Fast-moving local buyer. Converted after weekend event."],
  ["Dana Harlow", "Michigan", "Detroit", 3, 25, "Focused on lot width and coach access."],
  ["James Porter", "Indiana", "Indianapolis", 8, 54, "Needed financing follow-up and three callback rounds."],
  ["Lynn Porter", "Indiana", "Indianapolis", 7, 52, "Tracked HOA and annual carrying costs closely."],
  ["Michael Reeves", "Ohio", "Cleveland", 4, 31, "Came from owner referral. Bought after first tour."],
  ["Carol Reeves", "Ohio", "Cleveland", 3, 31, "Wanted covered patio upgrade options."],
  ["Brian Kessler", "Pennsylvania", "Pittsburgh", 9, 63, "Longer sales cycle. Needed repeated inventory updates."],
  ["Tina Kessler", "Pennsylvania", "Pittsburgh", 7, 60, "Asked detailed questions about seasonal occupancy."],
  ["Ronald Pierce", "Illinois", "Chicago", 6, 44, "Investor-style buyer comparing yield with Florida resort product."],
  ["Elaine Pierce", "Illinois", "Chicago", 5, 42, "Preferred remote paperwork and digital tour materials."],
  ["Kevin Matson", "Ohio", "Cincinnati", 5, 35, "Closed after referral from existing owner family."],
  ["Patricia Matson", "Ohio", "Cincinnati", 4, 34, "Wanted larger outdoor kitchen footprint."],
  ["David Moreno", "California", "Los Angeles", 10, 74, "Remote buyer. Needed video walkthrough, legal review, and remote close."],
  ["Alicia Moreno", "California", "Los Angeles", 8, 71, "High average sale buyer. Focused on premium package finish."],
  ["Steven Clark", "Michigan", "Grand Rapids", 4, 26, "Quick drive-market decision. Bought after one Saturday visit."],
  ["Martha Clark", "Michigan", "Grand Rapids", 3, 24, "Mostly concerned with resort standards and community feel."],
  ["Anthony Walsh", "Indiana", "Fort Wayne", 6, 38, "Moved from pending to close after call with GM."],
  ["Lisa Walsh", "Indiana", "Fort Wayne", 5, 37, "Compared multiple inventory positions before deciding."],
  ["Robert Flynn", "Ohio", "Toledo", 7, 47, "Needed six follow-ups and site utility details."],
  ["Jan Flynn", "Ohio", "Toledo", 5, 45, "Strong fit after second property tour."],
  ["Tom Becker", "Pennsylvania", "Philadelphia", 11, 83, "Longest cycle in sample. Remote-first and detail heavy."],
  ["Nancy Becker", "Pennsylvania", "Philadelphia", 9, 80, "Needed trust-building through multiple notes and recap emails."],
  ["Jeff Harmon", "Illinois", "Peoria", 4, 29, "Closed quickly after limited-time inventory release."]
].map(([name, state, city, calls, daysToBuy, notes], index) => ({
  id: `buyer-${index + 1}`,
  name,
  state,
  city,
  calls,
  daysToBuy,
  notes,
  tours: Math.max(1, Math.round(calls / 3)),
  buyerType: state === "California" ? "Fly market" : "Drive market",
  status: "Closed",
  lot: String(12 + index * 11)
}));

export const appData = {
  property: {
    name: "Hearthside Grove Motorcoach Resort",
    location: "Logan, Ohio",
    timezone: "Eastern Time",
    assistantLabel: "Quick search. Think of it like Google for your business.",
    intro:
      "Use the home page to scan the business, then open a page for revenue, buyers, campaigns, inventory, or team details."
  },
  filters: {
    activeRange: "YTD",
    compareLabel: "vs same period last year",
    availableRanges: ["7D", "30D", "MTD", "QTD", "YTD", "2024", "2023"]
  },
  overview: {
    heroMetrics: [
      { label: "MTD Sales Revenue", value: "$1.84M", delta: "+18.4%", trend: "up", note: "23 lots closed", route: "revenue" },
      { label: "Calls This Week", value: "284", delta: "+12.1%", trend: "up", note: "41 waiting on callback", route: "team" },
      { label: "Pending Contracts", value: "12", delta: "+3", trend: "up", note: "$942K pipeline", route: "inventory" },
      { label: "Current Occupancy", value: "78%", delta: "+6.2%", trend: "up", note: "Weekday demand firm", route: "overview" },
      { label: "Top Buyer State", value: "Ohio", delta: "31 sales", trend: "flat", note: "19% of closed deals", route: "buyers" },
      { label: "Top Campaign", value: "Spring Escape", delta: "$412K", trend: "up", note: "Best revenue attribution", route: "campaigns" }
    ],
    spotlight: [
      { title: "Callbacks overdue", value: "11", tone: "warning", description: "Older than 24 hours. 4 assigned to East Coast queue.", route: "team" },
      { title: "Tours scheduled today", value: "9", tone: "neutral", description: "6 in-person, 3 remote walkthroughs.", route: "team" },
      { title: "Deals at risk", value: "3", tone: "critical", description: "Financing or paperwork blockers in final stage.", route: "inventory" }
    ]
  },
  liveOps: {
    metrics: [
      { label: "Inbound Calls", value: "58", subtext: "Today", delta: "+9 vs yesterday" },
      { label: "Returned Calls", value: "44", subtext: "Today", delta: "76% completion" },
      { label: "Calls Waiting", value: "14", subtext: "Open queue", delta: "5 over SLA" },
      { label: "Avg Callback Time", value: "42m", subtext: "Rolling 7D", delta: "-13m improvement" },
      { label: "New Leads", value: "26", subtext: "Today", delta: "11 from paid media" },
      { label: "Follow-ups Due", value: "19", subtext: "Next 24h", delta: "7 due before noon" },
      { label: "Pending Offers", value: "8", subtext: "Live", delta: "$613K attached" },
      { label: "Pending Contracts", value: "12", subtext: "Live", delta: "2 waiting signatures" }
    ]
  },
  revenue: {
    yearly: revenueByYear.map((row, index, source) => ({
      ...row,
      revenueLabel: `$${row.totalRevenue.toFixed(1)}M`,
      yoy:
        index === 0
          ? "-"
          : `${(((row.totalRevenue - source[index - 1].totalRevenue) / source[index - 1].totalRevenue) * 100).toFixed(0)}%`
    })),
    currentYearMonthly: monthLabels.map((label, index) => ({ label, value: revenueByYear.at(-1).months[index] })),
    lotsMovement: revenueByYear.map((row) => ({ label: String(row.year), listed: row.listedLots, sold: row.lotsSold })),
    quarterly2024: [
      { label: "Q1", revenue: 1720, goal: 1600 },
      { label: "Q2", revenue: 2265, goal: 2100 },
      { label: "Q3", revenue: 2540, goal: 2380 },
      { label: "Q4", revenue: 2175, goal: 2050 }
    ]
  },
  buyers: {
    availableYears: Object.keys(stateYearly).map(Number),
    summary: [
      { label: "Top Origin State", value: "Ohio", note: "31 buyers purchased Michigan RV sites in 2024" },
      { label: "Best Avg Deal Size", value: "California", note: "$102K average RV site package" },
      { label: "Repeat Buyer Share", value: "14%", note: "Add-on lots, family referrals, and upgrades" },
      { label: "Average Calls to Close", value: "6.1", note: "Across the current buyer sample set" },
      { label: "Average Days to Buy", value: "46", note: "From first lead to signed deal" }
    ],
    topStates: stateYearly[2024].map(([state, sales, revenue, avgPrice]) => ({
      state,
      sales,
      revenue,
      avgPrice,
      revenueLabel: `$${(revenue * 1000).toFixed(0)}K`,
      avgPriceLabel: `$${avgPrice.toFixed(0)}K`
    })),
    mapPins: [
      { state: "Ohio", city: "Columbus", buyers: 14, x: 72, y: 37, market: "Drive market", travel: "4.5 hr drive" },
      { state: "Ohio", city: "Cincinnati", buyers: 9, x: 70, y: 44, market: "Drive market", travel: "5.5 hr drive" },
      { state: "Ohio", city: "Cleveland", buyers: 8, x: 75, y: 28, market: "Drive market", travel: "3.5 hr drive" },
      { state: "Michigan", city: "Detroit", buyers: 10, x: 69, y: 22, market: "Drive market", travel: "2.0 hr drive" },
      { state: "Michigan", city: "Grand Rapids", buyers: 5, x: 63, y: 18, market: "Drive market", travel: "1.5 hr drive" },
      { state: "Indiana", city: "Indianapolis", buyers: 11, x: 64, y: 38, market: "Drive market", travel: "4.0 hr drive" },
      { state: "Pennsylvania", city: "Pittsburgh", buyers: 7, x: 79, y: 31, market: "Drive market", travel: "5.0 hr drive" },
      { state: "Pennsylvania", city: "Philadelphia", buyers: 5, x: 88, y: 31, market: "Fly / long drive", travel: "8.5 hr drive" },
      { state: "Illinois", city: "Chicago", buyers: 6, x: 57, y: 26, market: "Drive market", travel: "4.0 hr drive" },
      { state: "Illinois", city: "Peoria", buyers: 4, x: 54, y: 34, market: "Drive market", travel: "5.5 hr drive" },
      { state: "California", city: "Los Angeles", buyers: 3, x: 12, y: 53, market: "Fly market", travel: "Air + remote close" },
      { state: "California", city: "San Diego", buyers: 2, x: 13, y: 59, market: "Fly market", travel: "Air + remote close" },
      { state: "California", city: "San Francisco", buyers: 1, x: 10, y: 39, market: "Fly market", travel: "Air + remote close" }
    ],
    byYear: Object.entries(stateYearly).map(([year, rows]) => ({
      year,
      states: rows.map(([state, sales, revenue, avgPrice]) => ({
        state,
        sales,
        revenue,
        avgPrice,
        revenueLabel: `$${(revenue * 1000).toFixed(0)}K`,
        avgPriceLabel: `$${avgPrice.toFixed(0)}K`
      }))
    })),
    stateLeaders: Object.entries(stateYearly).map(([year, rows]) => {
      const [, second] = rows;
      const leaderSalesByYear = {
        2020: 24,
        2021: 37,
        2022: 33,
        2023: 35,
        2024: 36,
        2025: 38,
        2026: 40
      };
      return {
        year,
        leader: "Florida",
        leaderSales: leaderSalesByYear[year],
        runnerUp: second[0],
        runnerUpSales: second[1],
        gap: leaderSalesByYear[year] - second[1]
      };
    }),
    regionalMix: [
      { label: "Midwest", value: 62 },
      { label: "Northeast", value: 18 },
      { label: "South", value: 12 },
      { label: "West", value: 8 }
    ],
    stateMetrics: [
      { state: "Ohio", region: "Drive market", buyers: 31, revenue: 2.42, avgPrice: 78.0, revenueShare: 31, closeRate: 14.2, repeatBuyerShare: 18, tours: 84, tourToSale: 36.9, avgDriveHours: 4.6, marketType: "Primary feeder" },
      { state: "Michigan", region: "Drive market", buyers: 19, revenue: 1.54, avgPrice: 81.0, revenueShare: 20, closeRate: 12.8, repeatBuyerShare: 14, tours: 51, tourToSale: 37.3, avgDriveHours: 2.1, marketType: "Local feeder" },
      { state: "Indiana", region: "Drive market", buyers: 17, revenue: 1.28, avgPrice: 75.0, revenueShare: 17, closeRate: 11.6, repeatBuyerShare: 16, tours: 46, tourToSale: 37.0, avgDriveHours: 4.2, marketType: "Secondary feeder" },
      { state: "Pennsylvania", region: "Drive / fly", buyers: 12, revenue: 0.978, avgPrice: 81.5, revenueShare: 13, closeRate: 10.4, repeatBuyerShare: 11, tours: 33, tourToSale: 36.4, avgDriveHours: 6.1, marketType: "Edge drive market" },
      { state: "Illinois", region: "Drive / fly", buyers: 10, revenue: 0.83, avgPrice: 83.0, revenueShare: 11, closeRate: 9.9, repeatBuyerShare: 9, tours: 27, tourToSale: 37.0, avgDriveHours: 5.3, marketType: "Extended drive" },
      { state: "California", region: "Fly market", buyers: 6, revenue: 0.612, avgPrice: 102.0, revenueShare: 8, closeRate: 7.8, repeatBuyerShare: 6, tours: 11, tourToSale: 54.5, avgDriveHours: 0, marketType: "Fly / remote" }
    ].map((item) => ({
      ...item,
      revenueLabel: `$${(item.revenue * 1000).toFixed(0)}K`,
      avgPriceLabel: `$${item.avgPrice.toFixed(0)}K`,
      revenueShareLabel: `${item.revenueShare}%`,
      closeRateLabel: `${item.closeRate}%`,
      repeatBuyerShareLabel: `${item.repeatBuyerShare}%`,
      toursLabel: `${item.tours}`,
      tourToSaleLabel: `${item.tourToSale}%`,
      avgDriveHoursLabel: item.avgDriveHours ? `${item.avgDriveHours.toFixed(1)} hrs` : "Flight"
    })),
    buyerDirectory: detailedBuyers,
    buyerProfiles: [
      { label: "Drive-in buyers", value: "81%", note: "Ohio, Michigan, Indiana, and Pennsylvania are the core feeder markets for the Michigan resort." },
      { label: "Fly-in buyers", value: "19%", note: "California and destination investors buy fewer sites but spend more per deal." },
      { label: "Referral-led deals", value: "23%", note: "Existing owners referring friends and family is a strong Midwest pattern." },
      { label: "Remote closings", value: "28%", note: "Most common with fly markets and investor-style buyers." }
    ],
    insights: [
      "Ohio consistently drives the most volume every year in the dataset.",
      "California buyers are low volume but highest average sale price.",
      "Michigan is the strongest out-of-state feeder market."
    ]
  },
  campaigns: {
    summary: [
      { label: "Campaigns in 2024", value: "12" },
      { label: "Emails Sent", value: "61.0K" },
      { label: "Delivered", value: "60.3K" },
      { label: "Average Open Rate", value: "44.2%" },
      { label: "Average Click Rate", value: "9.8%" },
      { label: "Average Click to Open", value: "22.1%" }
    ],
    history: campaigns,
    quarterly: [
      { label: "Q1", delivered: 14375, opens: 6318, clicks: 1416, unsubscribes: 32 },
      { label: "Q2", delivered: 14910, opens: 6732, clicks: 1528, unsubscribes: 35 },
      { label: "Q3", delivered: 15425, opens: 6797, clicks: 1592, unsubscribes: 36 },
      { label: "Q4", delivered: 15590, opens: 6860, clicks: 1651, unsubscribes: 38 }
    ],
    listHealth: [
      { label: "Audience Size", value: "64,280", note: "+8.4% YoY" },
      { label: "Subscribed Contacts", value: "61,912", note: "96.3% of audience" },
      { label: "Non-Subscribed", value: "2,368", note: "Cleaned or unsubscribed" },
      { label: "Average Bounce Rate", value: "1.1%", note: "Healthy deliverability range" }
    ],
    engagementSnapshot: [
      { label: "Open Rate", value: "44.2%", note: "Strong for resort list" },
      { label: "Click Rate", value: "9.8%", note: "Consistent call-to-action response" },
      { label: "Click to Open", value: "22.1%", note: "Content relevance stays solid" },
      { label: "Unsubscribe Rate", value: "0.22%", note: "Stable audience retention" }
    ],
    deviceMix: [
      { label: "Mobile", value: 58 },
      { label: "Desktop", value: 34 },
      { label: "Tablet", value: 8 }
    ],
    topCampaignsByOpenRate: campaigns
      .filter((item) => item.date.startsWith("2024"))
      .sort((left, right) => right.openRate - left.openRate)
      .slice(0, 5)
      .map((item) => ({
        name: item.name,
        date: item.date,
        openRate: `${item.openRate}%`,
        clickRate: `${item.clickRate}%`,
        unsubscribes: item.unsubscribes
      }))
  },
  inventory: {
    summary: [
      { label: "Total Lots", value: "263" },
      { label: "For Sale", value: "41" },
      { label: "Under Contract", value: "12" },
      { label: "Sold in Last 12 Months", value: "36" }
    ],
    lotTypes: [
      { type: "Standard", total: 62, forSale: 14, underContract: 3, soldLast12Months: 9, avgPrice: "$64K" },
      { type: "Deluxe", total: 58, forSale: 10, underContract: 3, soldLast12Months: 8, avgPrice: "$76K" },
      { type: "Premium", total: 54, forSale: 8, underContract: 2, soldLast12Months: 7, avgPrice: "$92K" },
      { type: "Premium Plus", total: 46, forSale: 6, underContract: 2, soldLast12Months: 6, avgPrice: "$108K" },
      { type: "Luxury", total: 43, forSale: 3, underContract: 2, soldLast12Months: 6, avgPrice: "$134K" }
    ],
    soldHistory: {
      yearly: [
        { period: "2023", sold: 29 },
        { period: "2024", sold: 36 },
        { period: "2025", sold: 34 },
        { period: "2026", sold: 18 }
      ],
      monthly2026: [
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
      byTypeYearly: [
        { type: "Standard", sold: 9 },
        { type: "Deluxe", sold: 8 },
        { type: "Premium", sold: 7 },
        { type: "Premium Plus", sold: 6 },
        { type: "Luxury", sold: 6 }
      ]
    },
    statusBreakdown: [
      { label: "For Sale", value: 41, color: "#2b6de0" },
      { label: "Under Contract", value: 12, color: "#f0a43b" },
      { label: "Owner Occupied", value: 146, color: "#39a6a3" },
      { label: "Sold in Last 12M", value: 36, color: "#4d5f7d" }
    ],
    lots: inventoryLots
  },
  occupancy: {
    current: "78%",
    trend: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 46 },
      { label: "Mar", value: 51 },
      { label: "Apr", value: 58 },
      { label: "May", value: 68 },
      { label: "Jun", value: 81 },
      { label: "Jul", value: 91 },
      { label: "Aug", value: 88 },
      { label: "Sep", value: 74 },
      { label: "Oct", value: 63 },
      { label: "Nov", value: 54 },
      { label: "Dec", value: 49 }
    ],
    support: [
      { label: "Rental Nights Booked", value: "4,812" },
      { label: "Weekend Occupancy", value: "92%" },
      { label: "Occupancy vs Sales Lift", value: "+14%" }
    ]
  },
  team: {
    reps: repPerformance,
    callsByWeek: [
      { label: "Wk 1", value: 198 },
      { label: "Wk 2", value: 214 },
      { label: "Wk 3", value: 236 },
      { label: "Wk 4", value: 252 },
      { label: "Wk 5", value: 244 },
      { label: "Wk 6", value: 284 }
    ]
  }
};
