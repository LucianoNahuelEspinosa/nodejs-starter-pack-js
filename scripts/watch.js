import { spawn, execSync } from 'node:child_process';
import { watch, statSync, existsSync, readdirSync } from 'node:fs';
import { join, normalize } from 'node:path';

// ANSI escape codes for styling
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';

let child = null;
let timeout = null;
const lastModified = new Map();
const startTime = Date.now();

const preloadTimestamps = (dir) => {
  try {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = normalize(join(dir, file.name));
      if (file.isDirectory()) {
        preloadTimestamps(fullPath);
      } else if (file.name.endsWith('.js')) {
        const stats = statSync(fullPath);
        lastModified.set(fullPath, stats.mtimeMs);
      }
    }
  } catch {
    // Ignore read errors
  }
}

const startApp = () => {
  if (child) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${child.pid} /T`, { stdio: 'ignore' });
      } else {
        child.kill('SIGKILL');
      }
    } catch {
      // Ignore errors if process already exited
    }
  }

  child = spawn('node', ['--env-file=.env', 'src/index.js'], {
    stdio: 'inherit'
  });
}

const handleFileChange = (filePath) => {
  if (Date.now() - startTime < 3000) return;

  const normalizedPath = normalize(filePath);

  try {
    if (!existsSync(normalizedPath)) return;

    const stats = statSync(normalizedPath);
    const prevMtime = lastModified.get(normalizedPath);

    if (prevMtime && stats.mtimeMs > prevMtime + 50) {
      lastModified.set(normalizedPath, stats.mtimeMs);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(`\n${GREEN}${BOLD}[watch] Confirmed change in: ${normalizedPath}. Restarting...${RESET}\n`);
        startApp();
      }, 400);
    } else if (!prevMtime) {
      lastModified.set(normalizedPath, stats.mtimeMs);
    }
  } catch {
    // Ignore transient file system errors
  }
}

preloadTimestamps('./src');
if (existsSync('.env')) {
  try {
    lastModified.set('.env', statSync('.env').mtimeMs);
  } catch {}
}

console.log(`${GREEN}${BOLD}[watch] Starting application watcher...${RESET}\n`);
startApp();

// Watch src folder for JS modifications
watch('./src', { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.js')) {
    handleFileChange(join('src', filename));
  }
});

// Watch .env file for changes
if (existsSync('.env')) {
  watch('.env', () => {
    handleFileChange('.env');
  });
}