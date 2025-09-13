// server.ts
export type Handler = (
  req: Request,
  res: Response,
) => Response | Promise<Response>;
export type Middleware = (
  req: Request,
  next: () => Promise<Response>,
) => Promise<Response>;

export class App {
  private routes: Map<string, Map<string, Handler>> = new Map();
  private middlewares: Middleware[] = [];

  use(mw: Middleware) {
    this.middlewares.push(mw);
  }

  add(method: string, path: string, handler: Handler) {
    method = method.toUpperCase();
    if (!this.routes.has(path)) this.routes.set(path, new Map());
    this.routes.get(path)!.set(method, handler);
  }

  get(path: string, handler: Handler) {
    this.add("GET", path, handler);
  }
  post(path: string, handler: Handler) {
    this.add("POST", path, handler);
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const route = this.routes.get(url.pathname)?.get(req.method);

    const runner = async (i: number): Promise<Response> => {
      if (i < this.middlewares.length && this.middlewares[i]) {
        return this.middlewares[i](req, () => runner(i + 1));
      }
      if (route) return route(req, new Response()) ?? new Response("OK");
      return new Response("Not Found", { status: 404 });
    };

    return runner(0);
  }

  listen(port: number) {
    return Bun.serve({
      port,
      fetch: (req) => this.handle(req),
    });
  }
}
