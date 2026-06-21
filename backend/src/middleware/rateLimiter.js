import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  // If Upstash credentials are placeholders or missing, bypass rate limiter
  const hasUpstashConfig =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_URL !== "https://your-database-name.upstash.io" &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_TOKEN !== "your_upstash_redis_rest_token";

  if (!hasUpstashConfig) {
    return next();
  }

  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error (bypassing rate limiter):", error.message || error);
    next(); // Bypass and continue rather than failing the request
  }
};

export default rateLimiter;
