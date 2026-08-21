import { spawn, execSync } from 'node:child_process';
import { watch, statSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

// ANSI escape codes for styling
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const BOLD = '\x1b[1m';

let child = null;
let timeout = null;
const lastModified = new Map();

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
  const normalizedPath = normalize(filePath);

  try {
    if (!existsSync(normalizedPath)) return;

    const stats = statSync(normalizedPath);
    const prevMtime = lastModified.get(normalizedPath);

    if (!prevMtime || stats.mtimeMs > prevMtime) {
      lastModified.set(normalizedPath, stats.mtimeMs);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(`\n${GREEN}${BOLD}[watch] Confirmed change in: ${normalizedPath}. Restarting...${RESET}\n`);
        startApp();
      }, 400);
    }
  } catch {
    // Ignore transient file system errors
  }
}

// Initial start
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
  watch('.env', (eventType) => {
    handleFileChange('.env');
  });
}