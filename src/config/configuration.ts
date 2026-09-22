
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  nodeEnv: process.env.NODE_ENV || 'development',

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});
