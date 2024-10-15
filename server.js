const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const urlClusters = [
  {
    name: "Cluster 1",
    urls: [
      "https://ubiquitous-zebra-jx9r5p57rwjhqr6p-8080.app.github.dev/",
      "https://6eecd872-89da-4348-9599-982c7f19249c-00-1f70zw35zvnq6.janeway.replit.dev/",
      "https://6eecd872-89da-4348-9599-982c7f19249c-00-1f70zw35zvnq6.janeway.replit.dev:3000/",
    ],
  },
];

let statusList = {};

const fetchData = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 }); // 5 seconds timeout
    const status = response.status;
    return status;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    return error.message;
  }
};

const keepReplAlive = async () => {
  // Fetch data for each URL cluster in parallel
  statusList = {};

  // Fetch data for each URL cluster in parallel
  await Promise.all(
    urlClusters.map(async (cluster) => {
      const clusterName = cluster.name;
      const clusterStatus = {};
      const promises = cluster.urls.map(async (url) => {
        try {
          const status = await fetchData(url);
          clusterStatus[url] = status;
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error.message);
          clusterStatus[url] = "Error"; // Handle the error case
        }
      });
      await Promise.race([Promise.all(promises), new Promise(resolve => setTimeout(resolve, 25000))]);
      statusList[clusterName] = clusterStatus;
    })
  );
};

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/status", async (req, res) => {
  await keepReplAlive(); // Fetch the latest status before responding to /status
  console.log(statusList);
  res.json(statusList);
});

app.get("/keepalive", (req, res) => {
  res.send("Keep-alive is working!");
});

module.exports = app;