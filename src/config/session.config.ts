import { registerAs } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import RedisStore from 'connect-redis';
import redisConfig from '@config/redis.config';

export default registerAs('session', () => ({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  store: createRedisStore(),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
  },
}));

function createRedisStore() {
  const redisOptions: RedisOptions = {
    host: redisConfig().host,
    port: redisConfig().port,
    password: redisConfig().password,
  };

  const client = new Redis(redisOptions);

  return new RedisStore({ client });
}
