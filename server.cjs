const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on ${port}`));
