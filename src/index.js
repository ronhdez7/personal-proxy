const http = require("http");
const performance = require("perf_hooks").performance;

const PORT = process.env.PORT;

const server = http.createServer(async (req, res) => {
  const startTime = performance.now();
  try {
    console.log("HIT -", req.method, req.url);

    if (req.url === "/") {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url);

    if (req.method.toUpperCase() === "GET" && url.pathname === "/hello") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello World!");
      return;
    }

    console.log("Proxying...");

    const proxyReq = http.request(
      {
        headers: req.headers,
        method: req.method,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
        hash: url.hash,
        search: url.search,
        searchParams: url.searchParams,
        href: url.href,
        origin: url.origin,
        password: url.password,
        username: url.username,
        pathname: url.pathname,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);

        proxyRes.on("data", (chunk) => {
          res.write(chunk);
        });

        proxyRes.on("end", () => {
          const endTime = performance.now();
          const duration = Math.floor(endTime - startTime);
          console.log(`Returning (${duration}) - `, res.statusCode, req.url);

          res.end();
        });
      }
    );

    req.on("data", (chunk) => {
      proxyReq.write(chunk);
    });

    req.on("end", () => {
      proxyReq.end();
    });
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, undefined, () => console.log(`Listening on port ${PORT}`));
