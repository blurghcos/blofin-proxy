const express = require("express");
const app = express();
const crypto = require("crypto");

app.use(express.json());

app.post("*", async (req, res) => {
  const { method, url, body } = req.body;
  const apiKey = req.header("X-BLOFIN-KEY");
  const secretKey = req.header("X-BLOFIN-SECRET");
  const passphrase = req.header("X-BLOFIN-PASSPHRASE");

  if (!apiKey || !secretKey || !passphrase) {
    return res.status(401).json({ error: "Missing API credentials" });
  }

  const timestamp = Date.now().toString();
  const requestPath = url;
  const prehash = timestamp + method.toUpperCase() + requestPath + (body ? JSON.stringify(body) : "");
  const signature = crypto.createHmac("sha256", secretKey).update(prehash).digest("base64");

  try {
    const response = await fetch(`https://api.blofin.com${requestPath}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "ACCESS-KEY": apiKey,
        "ACCESS-SIGN": signature,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-PASSPHRASE": passphrase
      },
      body: method === "GET" ? null : JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
});

module.exports = app;
