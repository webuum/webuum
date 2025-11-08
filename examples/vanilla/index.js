import http from 'node:http'
import fs from 'node:fs'

const server = http.createServer((req, res) => {
  const html = fs.readFileSync('./index.html', 'utf8')

  res.writeHead(200, { 'Content-Type': 'text/html' })

  res.end(html.toString())
})

const PORT = 5173
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
