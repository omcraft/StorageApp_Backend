import { createClient } from "redis";

const redisClient = createClient({
  password: "212005",
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
  process.exit(1);
});

await redisClient.connect();

export default redisClient;
