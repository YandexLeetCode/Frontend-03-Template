const http = require('http')

http.createServer((request, response) => {
  let body = []
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(Buffer.from(chunk));
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log("body:", body);
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(
   `<html maaa=a >
   <head>
      <style>
      </style>
   </head>
    <body>
    <h1>aaa</h1>
    </body>
    </html>`);
  });
}).listen(8088)

console.log("server started");