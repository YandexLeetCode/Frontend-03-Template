const net = require("net")

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.
  }
}
void async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8088,
    path: "/",
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "nuoYan"
    }
  });

  let response = await request.send();
  console.log(response)
}();