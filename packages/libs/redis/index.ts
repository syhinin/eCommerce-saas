import Redis from 'ioredis';

const redis = new Redis(
  `rediss://default:${process.env.REDIS_TOKEN}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`
);

export default redis;
