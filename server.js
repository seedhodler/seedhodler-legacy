const fs = require('fs')
const http = require('http')
const path = require('path')
const port = process.env.PORT || 4000
const staticFilesRoot = path.join(__dirname, 'dist')

process.on('SIGINT', () => {
  console.info('\nInterrupted....killing server')
  process.exit(0)
})

http.createServer(function (req, res) {
  if (req.url === '/') {
    req.url = '/index.html'
  }

  console.log(req.url)

  fs.readFile(staticFilesRoot + req.url, function (err, data) {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return
    }
    res.writeHead(200)
    res.end(data)
  })
}).listen(port, () => {
  console.log('Static server listening on ' + port)
})
