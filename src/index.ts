import { TradingBot } from './bot/TradingBot';

const bot = new TradingBot();

// Command handlers
process.on('SIGINT', () => {
  bot.stop();
  process.exit(0);
});

// Start the bot
bot.start().catch(error => {
  console.error('Bot error:', error);
  process.exit(1);
});