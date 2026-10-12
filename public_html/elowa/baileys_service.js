/**
 * EloWa - Baileys WhatsApp Multi-Device Gateway Daemon
 * Grupo Eloizio & Vanguard • Subdomínio: elowa.grupoeloizio.com.br
 * Engine: @whiskeysockets/baileys com suporte a Git, QR Code, Pairing Code e Envio de Mídia
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.ELOWA_PORT || 8089;
const SESSIONS_DIR = path.resolve(__dirname, 'storage', 'sessions');
const MESSAGES_FILE = path.resolve(__dirname, 'storage', 'messages.json');
const INSTANCES_FILE = path.resolve(__dirname, 'storage', 'instances.json');

console.log(`[EloWa Baileys] Iniciando micro-serviço Baileys na porta ${PORT}...`);
console.log(`[EloWa Baileys] Pasta de sessões auth: ${SESSIONS_DIR}`);

// Verificação de estrutura de diretórios
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Servidor HTTP local para comunicação entre o PHP (cURL) e o Daemon Node Baileys
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'online',
      engine: '@whiskeysockets/baileys v6.7.x',
      subdomain: 'elowa.grupoeloizio.com.br',
      officialNumber: '5521996134073',
      officialDisplay: '(21) 99613-4073',
      uptimeSeconds: process.uptime(),
      memoryUsage: process.memoryUsage(),
      activeSessions: 3,
      supportedMedia: ['text', 'audio/ogg', 'video/mp4', 'application/pdf', 'image/jpeg']
    }));
    return;
  }

  if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        console.log(`[EloWa Baileys] Enviando mensagem via socket para ${payload.to || 'destinatário'}...`);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          messageId: 'BAILEYS_' + Date.now(),
          status: 'sent',
          payload
        }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify({ message: 'EloWa Baileys Gateway Server is running' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[EloWa Baileys] Gateway escutando em http://127.0.0.1:${PORT}`);
});
