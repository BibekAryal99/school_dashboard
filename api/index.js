import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

export default function handler(req, res) {
  const server = jsonServer.create();

  // Calculate __dirname in ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const router = jsonServer.router(path.join(__dirname, "..", "db.json"));
  const middlewares = jsonServer.defaults();

  server.use(middlewares);
  server.use(router);

  // Pass the request to json-server
  server(req, res);
}
