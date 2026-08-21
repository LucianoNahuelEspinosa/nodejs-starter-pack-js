# Node.js Lightweight Express Boilerplate

A minimal, fast, and feature-rich Node.js starter template built with **Express** and **ES Modules (ESM)**. Designed to keep dependencies to a minimum while providing essential production-ready utilities like rate limiting, custom logging, environment configuration, and robust error handling.

---

## 📑 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Middleware Overview](#-middleware-overview)
  - [Global Error Handler](#global-error-handler)
  - [Rate Limiter](#rate-limiter)
  - [Logger](#logger)
- [API Routes](#-api-routes)
- [Scripts](#-scripts)
- [License](#-license)

---

## 🚀 Features

- **Lightweight & Modular:** Built on Express with minimal external dependencies.
- **Modern JavaScript:** Native support for ES Modules (`import`/`export`).
- **Path Aliases:** Uses Node.js native subpath imports (`#src/*`) for clean import statements.
- **Global Error Handling:** Centralized error handler with formatted timestamp logs and environment-based stack traces.
- **Rate Limiting:** Built-in IP-based rate limiting to prevent abuse.
- **Request Logging:** Custom timestamped console output for HTTP requests and system errors.
- **Environment Configuration:** Pre-configured with `.env` / `.env.example` setup.
- **Hot Reloading:** Custom watch script for fast local development.

---

## 📂 Project Structure

```text
.
├── .env                     # Local environment variables
├── .env.example             # Example environment template
├── .gitignore               # Git ignored files
├── .npmrc                   # NPM configuration
├── jsconfig.json            # Editor path aliasing & autocomplete setup
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── scripts/
│   └── watch.js             # Custom development watch script
└── src/
    ├── config.js            # Centralized configuration (CORS, PORT, etc.)
    ├── index.js             # Server entry point
    ├── helpers/
    │   └── consolePrintWithTimedate.js  # Formatting helper for console logs
    ├── middlewares/
    │   ├── errorHandler.js   # Global error handling middleware
    │   ├── logger.js         # HTTP request logger middleware
    │   └── rateLimiter.js    # Rate limiting middleware
    └── routes/
        └── index.js          # Main API routing definition
```

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or higher (v20+ recommended for native `--watch` support)
- **npm**: `v9.x` or higher

---

## 🛠️ Getting Started

### 1. Extract & Navigate

Extract the template archive and navigate into the project directory:

```bash
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file to create your local `.env`:

```bash
cp .env.example .env
```

Define your configuration values inside `.env`:

```env
PORT=4000
NODE_ENV=development
```

### 4. Run the Application

#### **Development Mode (Auto-reload)**
```bash
npm run dev
```

#### **Production Mode**
```bash
npm start
```

The server will start listening on `http://localhost:4000`.

---

## ⚙️ Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `number` | `4000` | The port on which the Express server runs. |
| `NODE_ENV` | `string` | `development` | App environment (`development` or `production`). Hides stack traces in production. |

---

## 🛡️ Middleware Overview

### Global Error Handler

Located at `src/middlewares/errorHandler.js`. Captures unhandled errors, formats the output with timestamped logs to the console, and returns formatted JSON responses.

#### **Usage in Controllers / Routes:**

To pass errors to the global error handler, invoke `next(error)`:

```javascript
// src/routes/index.js or any controller
router.get("/example", async (req, res, next) => {
  try {
    // Simulate an error
    throw new Error("Something went wrong!");
  } catch (error) {
    // Pass error to the global handler
    next(error);
  }
});
```

---

### Rate Limiter

Located at `src/middlewares/rateLimiter.js`. Protects your endpoints from brute-force attacks and excessive API calls.

```javascript
// Applied in src/index.js
const apiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 Minute
  max: 80,             // Max 80 requests per IP per windowMs
  message: 'Take it easy, wait a minute.'
});

app.use(apiLimiter);
```

---

### Logger

Located at `src/middlewares/logger.js`. Logs incoming HTTP requests to the console with accurate timestamps using `consolePrintWithTimedate.js`.

---

## 🛣️ API Routes

All base API routes are registered under the `/api` prefix in `src/index.js`. Add your custom endpoint modules in `src/routes/index.js`:

```javascript
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res, next) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default router;
```

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the production server (`node src/index.js`). |
| `npm run dev` | Runs the server in watch mode (`node scripts/watch.js` or `node --watch`). |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).