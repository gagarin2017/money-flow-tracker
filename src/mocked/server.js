// server.js
// const jsonServer = require("json-server");
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(router);
// server.listen(3005, () => {
//   console.log("JSON Server is running");
// });

// hello.js
module.exports = (req, res, next) => {
  //   console.log("Request URL: ", req.url);
  //   console.log("Request method: ", req.method);
  //   if (req.method === "GET" && req.url.includes("transactions")) {
  //     console.log("Response");
  //     console.log(res);
  //     // console.log("response body: ", res.body);
  //   }
  //   //     url: '/transactions?account=2',
  //   //   method: 'GET',
  //   //   console.log("Response ", res);
  //   res.header("X-Hello", "World");
  //   next();
};
