/**
 * Servidor Web Local para el Sistema SIDER
 * Stock por Almacenes y Solicitudes
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

  // Rutas de Aplicación
  if (pathname === '/' || pathname === '/index.html' || pathname === '/operario') {
    serveHtmlWithHash(res, 'operario');
    return;
  }

  if (pathname === '/admin') {
    serveHtmlWithHash(res, 'admin');
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

  if (pathname === '/api/send-email') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      const sendEmailHandler = require('./api/send-email');
      sendEmailHandler(req, res);
    });
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
  const htmlPath = path.join(BASE_DIR, 'index.html');
  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error al leer el archivo HTML: ' + err.message);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
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
  console.log('🚀 SISTEMA SIDER - SOLICITUDES Y STOCK');
  console.log('================================================================');
  console.log(`📡 Servidor activo en: http://localhost:${PORT}`);
  console.log('');
  console.log('📍 MÓDULOS DISPONIBLES:');
  console.log(`   1. Portal Operario:              http://localhost:${PORT}/`);
  console.log(`   2. Módulo Administrador Oculto:  http://localhost:${PORT}/admin`);
  console.log('');
  console.log('🔌 APIS REST DISPONIBLES:');
  console.log(`   - Usuarios (1,093 registros):     http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Catálogo Materiales SAP:       http://localhost:${PORT}/api/materiales`);
  console.log(`   - Stock por Almacenes:           http://localhost:${PORT}/api/stock`);
  console.log('================================================================');
});
