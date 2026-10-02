const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 8000;
const publicDirectory = __dirname;
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function getFilePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(publicDirectory, requestedPath);
  return filePath.startsWith(`${publicDirectory}${path.sep}`) ? filePath : null;
}

const server = http.createServer(async (request, response) => {
  const filePath = getFilePath(request.url);
  if (!filePath) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const contents = await readFile(filePath);
    const contentType = contentTypes[path.extname(filePath)] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'EISDIR') console.error(error);
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Fant ikke siden');
  }
});

server.listen(port, host, () => {
  console.log(`Porteføljen er tilgjengelig på http://${host}:${port}`);
});
