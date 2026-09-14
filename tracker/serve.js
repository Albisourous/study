// Zero-dependency static server. Run: node serve.js  →  http://localhost:8000
// (Opening index.html directly in a browser also works — no server required.)
const http = require("http");
const fs = require("fs");
const path = require("path");

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

http
  .createServer((req, res) => {
    const file = path.join(__dirname, req.url === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0]));
    fs.readFile(file, (err, data) => {
      if (err) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "text/plain" });
      res.end(data);
    });
  })
  .listen(8000, () => console.log("http://localhost:8000"));
