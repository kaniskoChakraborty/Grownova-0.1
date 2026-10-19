export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  nodeEnv: process.env.NODE_ENV || 'development',

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',

    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  upi: {
    // Shared with the UPI provider to sign its payment callbacks.
    webhookSecret: process.env.UPI_WEBHOOK_SECRET || 'dev-upi-webhook-secret',
  },
});
