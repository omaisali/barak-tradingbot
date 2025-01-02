export function getServerInfo() {
  return {
    ip: process.env.NETLIFY ? 'Netlify Function' : 'localhost',
    hostname: process.env.SITE_NAME || 'localhost',
    platform: 'netlify',
    uptime: 0 // Serverless functions don't have meaningful uptime
  };
}