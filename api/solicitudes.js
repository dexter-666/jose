// Vercel Serverless Function: Central Cloud Synchronizer for SIDERPERU
// Endpoint: /api/solicitudes (GET, POST, OPTIONS)

const https = require('https');
const CLOUD_DB_ID = 'ff808181a09d98f701a1becf8d5b6c18';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_DB_ID}`;

function fetchFromCloud() {
  return new Promise((resolve, reject) => {
    https.get(CLOUD_URL, { headers: { 'Origin': 'https://localhost' } }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(b);
          resolve(parsed.data || { solicitudes: [], stock: {}, credenciales: {} });
        } catch (e) {
          resolve({ solicitudes: [], stock: {}, credenciales: {} });
        }
      });
    }).on('error', err => reject(err));
  });
}

function saveToCloud(data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      name: 'SIDERPERU_SOLICITUDES_MASTER_V1',
      data: {
        solicitudes: data.solicitudes || [],
        stock: data.stock || {},
        credenciales: data.credenciales || {},
        lastUpdated: new Date().toISOString()
      }
    });

    const req = https.request(CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://localhost',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(true));
    });
    req.on('error', err => reject(err));
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (!res.status) {
    res.status = function(code) { this.statusCode = code; return this; };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = await fetchFromCloud();
      return res.status(200).json({
        success: true,
        solicitudes: data.solicitudes || [],
        stock: data.stock || null,
        credenciales: data.credenciales || null,
        source: 'sider-central-cloud'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error leyendo de la nube central', details: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const incoming = req.body || {};
      const current = await fetchFromCloud();

      // Merge intelligent: nuevas solicitudes se incorporan, existentes se actualizan de estado
      const currentMap = new Map((current.solicitudes || []).map(s => [s.id, s]));
      const incomingList = incoming.solicitudes || [];

      incomingList.forEach(item => {
        if (!currentMap.has(item.id)) {
          currentMap.set(item.id, item);
        } else {
          // Si el estado o datos cambiaron, actualizar
          const existing = currentMap.get(item.id);
          currentMap.set(item.id, Object.assign({}, existing, item));
        }
      });

      const mergedSolicitudes = Array.from(currentMap.values());
      // Ordenar por tiempo o fecha descendente
      mergedSolicitudes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      const mergedData = {
        solicitudes: mergedSolicitudes,
        stock: incoming.stock || current.stock,
        credenciales: Object.assign({}, current.credenciales || {}, incoming.credenciales || {})
      };

      await saveToCloud(mergedData);

      return res.status(200).json({
        success: true,
        total: mergedSolicitudes.length,
        solicitudes: mergedSolicitudes,
        source: 'sider-central-cloud'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error guardando en la nube central', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido. Utilizar GET o POST.' });
};
