// let propertyId = "429693507";
// const analyticsDataClient = new BetaAnalyticsDataClient();

// // ------------------extra below------------
async function runReport() {
  const response = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: "2024-02-01",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "noida",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
      },
    ],
  });

  console.log("Report result:", response);
}

// // runReport();

