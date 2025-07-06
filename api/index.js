import crypto from 'crypto';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const apiKey = '9720547f8c2f4629a04e7522c2d49f03';
  const secret = '85ef05d6669c460fa73154a479de4a39';
  const passphrase = 'ZaidArslan';

  const method = 'GET';
  const requestPath = '/api/futures/v3/orders?status=1&limit=10';
  const timestamp = (Date.now() / 1000).toFixed(0); // format detik string integer

  const prehash = timestamp + method.toUpperCase() + requestPath;
  const hmac = crypto.createHmac('sha256', secret);
  const signature = hmac.update(prehash).digest('base64');

  const headers = {
    'ACCESS-KEY': apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': passphrase
  };

  try {
    const response = await fetch('https://api.blofin.com' + requestPath, {
      method,
      headers
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON response', raw: text });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server failed', details: error.message });
  }
}
