import express from "express";
import cors from "cors";
import * as fs from "fs";
const app = express();
const port = 7170;
const token = "temporary978234";

app.use(
  cors({
    origin: "*",
  })
);

// check for token in request
function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token in authorization header:", authHeader);
      return res.status(401).json({ error: 1, message: "Unauthorized" });
    }
    const authToken = authHeader.split(" ")[1];
    if (authToken === token) next();
    else {
      console.log("token mismatch, token: ", authToken);
      res
        .status(401)
        .json({ error: 1, message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 1, message: "Unauthorized" });
  }
}

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.get("/data/playerNames", auth, (req, res) => {
  const data = fs
    .readFileSync("server\\playerNames.txt", "utf-8")
    .trim()
    .split("\r\n")
    .sort();

  res.json(data);
});

app.post("/data/sendStats", auth, (req, res) => {
  if (!req.query.name) {
    return res.json({
      error: 1,
      message: "Name of score reporter not provided!",
    });
  }
});

app.listen(port, () => {
  console.log("App listening on port: ", port);
});
