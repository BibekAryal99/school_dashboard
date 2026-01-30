import jsonServer from "json-server";
import path from "path";

module.exports = (req, res) => {
  const server = jsonServer.create();
  const router = jsonServer.router(path.join(__dirname, "..", "db.json"));
  const middlewares = jsonServer.defaults();

  server.use(middlewares);
  server.use(router);

  return server(req, res);
};
