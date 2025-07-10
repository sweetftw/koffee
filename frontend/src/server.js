import express, { json } from "express";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.WEB_SERVER_PORT;

app.use(cors());
app.use(json());

const dirname = import.meta.dirname;

app.use(
  express.static(path.join(dirname), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      } else if (filePath.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      }
    },
  })
);

app.get("/hello", async (req, res) => {
  res.json({ status: "OK", message: "Hello World" });
});

app.get("/", (req, res) => {
  const dirname = import.meta.dirname;
  res.sendFile(path.join(dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Web Server running on port ${port}`);
});
