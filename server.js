/**
 * Servidor Web Local para el Sistema SIDER
 * Stock por Almacenes, Solicitudes y Monitor TV
 * Cero dependencias externas (Node.js nativo)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rutas Especiales
  if (pathname === '/' || pathname === '/index.html' || pathname === '/operario') {
    serveHtmlWithHash(res, 'operario');
    return;
  }

  if (pathname === '/admin') {
    serveHtmlWithHash(res, 'admin');
    return;
  }

  if (pathname === '/pantalla-stock' || pathname === '/tv') {
    serveHtmlWithHash(res, 'tv');
    return;
  }

  // APIs REST
  if (pathname === '/api/usuarios') {
    serveJsonFile(res, path.join(BASE_DIR, 'usuarios_sider.json'), data => data.usuarios);
    return;
  }

  if (pathname === '/api/materiales') {
    serveJsonFile(res, path.join(BASE_DIR, 'usuarios_sider.json'), data => data.catalogo_materiales);
    return;
  }

  if (pathname === '/api/stock') {
    serveJsonFile(res, path.join(BASE_DIR, 'usuarios_sider.json'), data => data.stock_inicial_almacenes);
    return;
  }

  if (pathname === '/api/info') {
    serveJsonFile(res, path.join(BASE_DIR, 'usuarios_sider.json'), data => ({
      proyecto: data.proyecto,
      total_usuarios: data.total_usuarios,
      almacenes: data.almacenes
    }));
    return;
  }

  // Archivos Estáticos
  const filePath = path.join(BASE_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.md': 'text/markdown; charset=utf-8'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Ruta no encontrada');
});

function serveHtmlWithHash(res, defaultHash) {
  const htmlPath = path.join(BASE_DIR, 'sistema_stock_sider.html');
  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error al leer el archivo HTML: ' + err.message);
      return;
    }
    // Si la ruta solicitada es /admin o /pantalla-stock, inyectamos el script para autoseleccionar la pestaña
    const injected = html.replace('// Check URL route/hash on initial load', `
    if (!window.location.hash) {
      window.location.hash = '${defaultHash}';
    }
    // Check URL route/hash on initial load`);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(injected);
  });
}

function serveJsonFile(res, filePath, extractor) {
  fs.readFile(filePath, 'utf8', (err, raw) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
    try {
      const data = JSON.parse(raw);
      const result = extractor ? extractor(data) : data;
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result, null, 2));
    } catch (parseErr) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: parseErr.message }));
    }
  });
}

server.listen(PORT, () => {
  console.log('================================================================');
  console.log('🚀 SISTEMA SIDER - STOCK POR ALMACENES Y SOLICITUDES');
  console.log('================================================================');
  console.log(`📡 Servidor activo en: http://localhost:${PORT}`);
  console.log('');
  console.log('📍 MÓDULOS DISPONIBLES:');
  console.log(`   1. Portal Operario (Calculadora): http://localhost:${PORT}/`);
  console.log(`   2. Panel Administrador (/admin): http://localhost:${PORT}/admin`);
  console.log(`   3. Pantalla TV en Vivo:          http://localhost:${PORT}/pantalla-stock`);
  console.log('');
  console.log('🔌 APIS REST DISPONIBLES:');
  console.log(`   - Usuarios (1,093 registros):     http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Catálogo Materiales SAP:       http://localhost:${PORT}/api/materiales`);
  console.log(`   - Stock por Almacenes:           http://localhost:${PORT}/api/stock`);
  console.log('================================================================');
});

