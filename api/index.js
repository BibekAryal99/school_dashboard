import jsonServer from "json-server";
import serverless from "serverless-http";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router(path.resolve("db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use("/api", router);

export default serverless(server);
