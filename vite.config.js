import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function offlineTilesPlugin() {
  const rootDir = process.cwd()
  const tilesRoot = path.join(rootDir, 'offline_maps')
  async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true })
  }
  async function saveTile(filePath, buffer) {
    const dir = path.dirname(filePath)
    await ensureDir(dir)
    await fs.promises.writeFile(filePath, buffer)
  }
  function mountMiddlewares(server) {
    const app = server.middlewares
    app.use(async (req, res, next) => {
      try {
        if (!req.url) return next()
        // Serve offline tiles
        if (req.url.startsWith('/offline-tiles/')) {
          const rel = req.url.replace('/offline-tiles/', '')
          const file = path.join(tilesRoot, rel)
          fs.promises.readFile(file)
            .then((buf) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'image/png')
              res.end(buf)
            })
            .catch(() => {
              res.statusCode = 404
              res.end('Not found')
            })
          return
        }
        // Proxy and capture tiles
        if (req.url.startsWith('/tile-proxy/')) {
          const rel = req.url.replace('/tile-proxy/', '')
          const m = rel.match(/^(\d+)\/(\d+)\/(\d+)\.png$/)
          if (!m) {
            res.statusCode = 400
            res.end('Bad tile path')
            return
          }
          const [_, z, x, y] = m
          const remote = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
          const r = await fetch(remote)
          if (!r.ok) {
            res.statusCode = r.status
            res.end('Upstream error')
            return
          }
          const arrayBuf = await r.arrayBuffer()
          const buf = Buffer.from(arrayBuf)
          const file = path.join(tilesRoot, `${z}/${x}/${y}.png`)
          try { await saveTile(file, buf) } catch {}
          res.statusCode = 200
          res.setHeader('Content-Type', 'image/png')
          res.end(buf)
          return
        }
      } catch (e) {
        // fallthrough
      }
      next()
    })
  }
  return {
    name: 'offline-tiles-plugin',
    configureServer(server) {
      mountMiddlewares(server)
    },
    configurePreviewServer(server) {
      mountMiddlewares(server)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), offlineTilesPlugin()],
})
