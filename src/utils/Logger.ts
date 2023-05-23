import winston, { format } from "winston"

const { combine, label, timestamp, prettyPrint, printf } = format

export const logger = winston.createLogger({
  level: "info", // logging level
  format: combine(timestamp(), label({ label: "right meow!" }), winston.format.json()), // log format
  transports: [
    new winston.transports.Console(), // console output
    new winston.transports.File({ filename: "logs/logs.log" }), // log file output
  ],
})
