const http = require('http')

http.createServer((request, response) => {
  let body = {}
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk.toString())
  })
})