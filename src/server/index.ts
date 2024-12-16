import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { TradingBot } from "./services/TradingBot";
import { BTCTurkAPI } from "./services/BTCTurkAPI";
import { tradingConfig, supportedCoins } from "../config/tradingConfig";
import { logger } from "./utils/logger";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const api = new BTCTurkAPI();
const tradingBot = new TradingBot(tradingConfig, Object.keys(supportedCoins));

io.on("connection", (socket) => {
  logger.info("Client connected");

  socket.emit("status", {
    status: tradingBot.isRunning ? "started" : "stopped",
  });

  socket.on("get-balance", async () => {
    try {
      const balanceData = await api.getBalance();
      // Ensure we're sending an array of balances
      socket.emit("balance", Array.isArray(balanceData) ? balanceData : []);
    } catch (error) {
      logger.error("Failed to fetch balance:", error);
      socket.emit("error", "Failed to fetch account balance");
      // Send empty array on error to maintain data structure
      socket.emit("balance", []);
    }
  });

  socket.on("start-bot", () => {
    tradingBot.start().catch((error) => {
      logger.error("Failed to start bot:", error);
      socket.emit("error", "Failed to start trading bot");
    });
  });

  socket.on("stop-bot", () => {
    tradingBot.stop();
  });

  socket.on("update-config", (config) => {
    try {
      tradingBot.updateConfig(config);
      logger.info("Configuration updated:", config);
    } catch (error) {
      logger.error("Failed to update config:", error);
      socket.emit("error", "Failed to update configuration");
    }
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected");
  });
});

tradingBot.on("trade", (trade) => {
  io.emit("trade", trade);
  logger.info("Trade executed:", trade);
});

tradingBot.on("status", (status) => {
  io.emit("status", status);
  logger.info("Status updated:", status);
});

tradingBot.on("error", (error) => {
  io.emit("error", error.message);
  logger.error("Bot error:", error);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
