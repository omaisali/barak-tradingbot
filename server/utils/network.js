export function getServerIp() {
  return process.env.NETLIFY ? 'Netlify Function' : 'localhost';
}