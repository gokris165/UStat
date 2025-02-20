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
  const reporter = req.query.name;
  logger.info(`${req.query.name} reported stats`);

  // process stats to writable file content
  let fileContent = "Name\tT\tA\tG\tW\tL\n";
  for (let player of Object.keys(req.body).sort()) {
    let turns = req.body[player].turns;
    let assists = req.body[player].assists;
    let goals = req.body[player].goals;
    let wins = req.body[player].wins;
    let losses = req.body[player].losses;
    fileContent += `${player}\t${turns}\t${assists}\t${goals}\t${wins}\t${losses}\n`;
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

  // update stats.txt
  try {
    logger.info("updating stats.txt");
    // create file if it doesn't exist
    if (!fs.existsSync("server/stats.txt")) {
      logger.info("stats.txt doesn't exist, creating it...");
      let newStats = "";
      const data = fs
        .readFileSync("server/playerNames.txt", "utf-8")
        .trim()
        .split("\r\n")
        .sort();
      for (let player of data) {
        newStats += `${player}\t0\t0\t0\t0\t0\n`;
      }
      fs.writeFileSync("server/stats.txt", newStats);
      logger.info("created stats.txt with all 0 stats");
    }
    // read global stats
    let stats = {};
    const existingStats = fs
      .readFileSync("server/stats.txt", "utf-8")
      .trim()
      .split("\n");
    for (let line of existingStats) {
      let stat = line.split("\t");
      stats[stat[0]] = {};
      stats[stat[0]].turns = parseInt(stat[1]);
      stats[stat[0]].assists = parseInt(stat[2]);
      stats[stat[0]].goals = parseInt(stat[3]);
      stats[stat[0]].wins = parseInt(stat[4]);
      stats[stat[0]].losses = parseInt(stat[5]);
    }
    // update global stats
    for (let player in req.body) {
      stats[player].turns += req.body[player].turns;
      stats[player].assists += req.body[player].assists;
      stats[player].goals += req.body[player].goals;
      stats[player].wins += req.body[player].wins;
      stats[player].losses += req.body[player].losses;
    }
    // write updated stats
    let statsContent = "";
    for (let player in stats) {
      let turns = stats[player].turns;
      let assists = stats[player].assists;
      let goals = stats[player].goals;
      let wins = stats[player].wins;
      let losses = stats[player].losses;
      statsContent += `${player}\t${turns}\t${assists}\t${goals}\t${wins}\t${losses}\n`;
    }
    fs.writeFileSync("server/stats.txt", statsContent);
    logger.info("successfully updated stats.txt");
  } catch (error) {
    console.log(error);
    logger.error(`Error while updating stats.txt: ${error.message}`);
  }

  res.json({ error: 0, message: "Successfully received stats" });
});

app.listen(port, () => {
  console.log("App listening on port: ", port);
});
