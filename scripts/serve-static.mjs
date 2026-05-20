import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] || '.output/public')
const port = Number(process.argv[3] || 3000)
const host = process.argv[4] || '127.0.0.1'

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp'
}

function resolveRequest(url = '/') {
  const pathname = decodeURIComponent(url.split('?')[0] || '/')
  const requested = normalize(join(root, pathname))

  if (!requested.startsWith(root + sep) && requested !== root) {
    return null
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested
  }

  if (existsSync(requested) && statSync(requested).isDirectory()) {
    const index = join(requested, 'index.html')
    if (existsSync(index)) return index
  }

  const fallback = join(root, 'index.html')
  return existsSync(fallback) ? fallback : null
}

const server = createServer((req, res) => {
  const file = resolveRequest(req.url)

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Not found')
    return
  }

  res.writeHead(200, {
    'content-type': types[extname(file)] || 'application/octet-stream',
    'cache-control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable'
  })

  createReadStream(file).pipe(res)
})

server.listen(port, host, () => {
  console.log(`Static preview: http://${host}:${port}/`)
  console.log(`Serving: ${root}`)
})
