import type { Trade } from '../types/trading';

export function exportTradesToCSV(trades: Trade[]): void {
  const headers = ['Coin', 'Action', 'Price', 'Time', 'Status'];
  const rows = trades.map(trade => [
    trade.coin,
    trade.action,
    trade.price.toString(),
    trade.time.toISOString(),
    trade.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `trades_${new Date().toISOString()}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}