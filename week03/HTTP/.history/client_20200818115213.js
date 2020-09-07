const net = require("net")

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key} = ${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }
  send (connection) {
    return new Promise((resolve, rejects) => {
     const parser = new ResponseParser;
     if (connection) {
       connection.write(this.toString());
     } else {
       connection = net.createConnection({
         host: this.host,
         port: this.port
       }, () => {
         connection.write(this.toString)h
       })
     }
    })
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

class ResponseParser {

}