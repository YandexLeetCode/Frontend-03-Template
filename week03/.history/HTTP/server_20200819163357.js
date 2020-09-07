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
      body div #myid {
        width: 10px;
        background-color:#fff;
      }
      body div img{
        width: 30px;
        background-color: #ff1111;
      }
      </style>
   </head>
    <body>
    <h1>aaa</h1>
    <img id="myid" />
    </body>
    </html>`);
  });
}).listen(8088)

console.log("server started");