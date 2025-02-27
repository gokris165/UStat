import express from "express";
import cors from "cors";
import * as winston from "winston";
import dotenv from "dotenv";
import "winston-daily-rotate-file";
import * as fs from "fs";

dotenv.config({ path: ".env.local" });
const app = express();
const port = process.env.VITE_BACKEND_PORT;
const token = process.env.VITE_TOKEN;

const logger = winston.createLogger({
  level: "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp}[${info.level}] ${info.message}`
    )
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "server/logs/log-%DATE%.txt",
      handleExceptions: true,
      datePattern: "YYYY-MM-DD",
    }),
  ],
});

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

// app.get("/", (req, res) => {
//   logger.info("hello world reached");
//   res.json("Hello world!");
// });

app.get("/data/playerNames", auth, (req, res) => {
  logger.info("requesting player names");
  try {
    const data = fs
      .readFileSync("server/playerNames.txt", "utf-8")
      .trim()
      .split("\r\n")
      .sort();
    res.json({ error: 0, message: data });
    logger.info("successfully sent player names");
  } catch (error) {
    logger.error(`error while reading player names: ${error.message}`);
    res.json({
      error: 1,
      message: `error while reading player names: ${error.message}`,
    });
  }
});

app.post("/data/sendStats", auth, express.json(), (req, res) => {
  // return if reporter name isn't provided
  if (!req.query.name) {
    logger.error("Name of stat reporter not provided!");
    return res.json({
      error: 1,
      message: "Name of stat reporter not provided!",
    });
  }
  let reporter = req.query.name;
  reporter = reporter.split(" ").join("_");
  logger.info(`${req.query.name} reported stats and history`);

  // process stats to writable file content
  let fileContent = "Name\tT\tA\tG\tW\tL\tD\n";
  for (let player of Object.keys(req.body.stats).sort()) {
    let turns = req.body.stats[player].turns;
    let assists = req.body.stats[player].assists;
    let goals = req.body.stats[player].goals;
    let wins = req.body.stats[player].wins;
    let losses = req.body.stats[player].losses;
    let defense = req.body.stats[player].defense;
    fileContent += `${player}\t${turns}\t${assists}\t${goals}\t${wins}\t${losses}\t${defense}\n`;
  }

  // create filename
  const now = new Date();
  const filename = `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}_${reporter}.txt`;

  // write stats to file
  try {
    // create data dir if it doesn't exist
    if (!fs.existsSync("server/data")) {
      fs.mkdirSync("server/data");
    }
    fs.writeFileSync(`server/data/${filename}`, fileContent);
    logger.info(`Successfully saved stats from ${reporter} to file`);
  } catch (error) {
    logger.error(`Stats from ${reporter} couldn't be saved to file:`, error);
    return res.json({
      error: 1,
      message: `Stats couldn't be saved to file: ${error.message}`,
    });
  }

  // write history to file
  try {
    // create history dir if it doesn't exist
    if (!fs.existsSync("server/history")) {
      fs.mkdirSync("server/history");
    }
    fs.writeFileSync(
      `server/history/${filename}`,
      JSON.stringify(req.body.history)
    );
    logger.info(`Successfully saved history from ${reporter} to file`);
  } catch (error) {
    logger.error(`History from ${reporter} couldn't be saved to file:`, error);
    return res.json({
      error: 1,
      message: `History couldn't be saved to file: ${error.message}`,
    });
  }

  res.json({ error: 0, message: "Successfully received stats" });
});

app.listen(port, () => {
  console.log("App listening on port: ", port);
});
