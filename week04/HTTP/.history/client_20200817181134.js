
void async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8088,
    path: "/",
    headers:{
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "nuoYan"
    }
  });

  let response = await request.
}