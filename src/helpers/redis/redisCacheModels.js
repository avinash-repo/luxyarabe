import Redis from "ioredis";
import RedisAdaptor from "sequelize-transparent-cache-ioredis";
import sequelizeCache from "sequelize-transparent-cache";

const redis = new Redis({ password: process.env.REDIS_PASS });
const redisAdaptor = new RedisAdaptor({
  client: redis,
  namespace: "model",
  lifetime: 60 * 60 * 60,
});

const { withCache } = sequelizeCache(redisAdaptor);

// export const redisCache = redis;
