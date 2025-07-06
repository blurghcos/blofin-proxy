// index.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/", (req, res) => {
  res.send("🚀 Blofin Proxy Aktif");
});

app.get("/api", async (req, res) => {
  try {
    const blofinUrl = "https://api.blofin.com" + req.query.endpoint;
    const headers = {
      "BF-ACCESS-KEY": req.query.key,
      "BF-ACCESS-SIGN": req.query.sign,
      "BF-ACCESS-TIMESTAMP": req.query.ts,
      "BF-ACCESS-PASSPHRASE": req.query.pass
    };
    const response = await fetch(blofinUrl, { method: "GET", headers });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
});

module.exports = app;
