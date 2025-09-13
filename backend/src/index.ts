import { sql } from "bun";
import { App } from "./server";

// simple http server
const app = new App();
const db = sql({
  url: process.env.DATABASE_URL!,
});
app.use(async (req, next) => {
  console.log(`${req.method} ${new URL(req.url).pathname}`);
  return next();
});

app.get("/", () => new Response("Hello Bun!"));

app.get("/health", () => new Response("200"));

app.listen(3000);
