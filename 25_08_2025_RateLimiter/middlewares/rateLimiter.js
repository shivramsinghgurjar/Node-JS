// Simple rate limiter middleware
const requests = {}; // { ip: count }

function rateLimiter(req, res, next) {
  const ip = req.ip;  // identify client by IP

  if (!requests[ip]) {
    requests[ip] = 1;
  } else {
    requests[ip]++;
  }

  if (requests[ip] > 499) {
    return res.status(429).json({
      success: false,
      message: "Error: Request limit exceeded (499 max allowed)."
    });
  }

  next();
}

module.exports = rateLimiter;
