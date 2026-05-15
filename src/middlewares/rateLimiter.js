/**
 * @typedef {Object} RateLimitOptions
 * @property {number | ((req: import('express').Request) => number)} windowMs - The time window in milliseconds.
 * @property {number | ((req: import('express').Request) => number)} max - The maximum number of requests allowed within the windowMs.
 * @property {((req: import('express').Request) => string)} [keyGenerator] - Custom function to generate keys (defaults to IP).
 * @property {string} [message] - Response message when the limit is exceeded.
 */

/**
 * @typedef {Object} RateLimitRecord
 * @property {number} count - Number of requests made in the current window.
 * @property {number} resetTime - Timestamp when the current window expires.
 */

/**
 * Creates a dynamic rate limiting middleware.
 * 
 * @param {RateLimitOptions} options - Configuration options for the rate limiter.
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} Express middleware function.
 */
const rateLimiter = (options) => {
    /** @type {Map<string, RateLimitRecord>} */
    const store = new Map();

    // Periodic cleanup to prevent memory leaks from old IP addresses
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of store.entries()) {
            if (now > record.resetTime) {
                store.delete(key);
            }
        }
    }, 60000); // Runs every 1 minute

    return (req, res, next) => {
        // Resolve dynamic or static values for windowMs and max
        const windowMs = typeof options.windowMs === 'function' ? options.windowMs(req) : options.windowMs;
        const max = typeof options.max === 'function' ? options.max(req) : options.max;
        
        // Resolve key (defaults to IP address)
        const key = options.keyGenerator 
            ? options.keyGenerator(req) 
            : req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const message = options.message || 'Too many requests, please try again later.';
        const currentTime = Date.now();

        // If the key is new, initialize its record
        if (!store.has(key)) {
            store.set(key, { count: 1, resetTime: currentTime + windowMs });
            return next();
        }

        const record = store.get(key);

        // If the window has expired, reset the counter and time window
        if (currentTime > record.resetTime) {
            record.count = 1;
            record.resetTime = currentTime + windowMs;
            store.set(key, record);
            return next();
        }

        // Increment request count
        record.count += 1;
        store.set(key, record);

        // Calculate remaining requests
        const remaining = Math.max(0, max - record.count);

        // Set standard rate limiting headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

        // Check if limit is exceeded
        if (record.count > max) {
            return res.status(429).json({
                status: 429,
                error: 'Too Many Requests',
                message: message
            });
        }

        next();
    };
}

export default rateLimiter;