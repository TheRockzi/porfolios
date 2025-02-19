export const mockSystemActivity = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 300000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  value: Math.floor(Math.random() * 10) + 1
}));

export const mockThreatData = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 300000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  count: Math.floor(Math.random() * 5),
  type: 'malicious'
}));