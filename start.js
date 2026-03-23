const { execSync, spawn } = require("child_process");
const path = require("path");
const os   = require("fs");
const fs   = require("fs");

const ROOT     = __dirname;
const BACKEND  = path.join(ROOT, "backend");
const FRONTEND = path.join(ROOT, "frontend");
const isWin    = process.platform === "win32";

function log(msg) { console.log(`\x1b[36m[ReActivate]\x1b[0m ${msg}`); }
function ok(msg)  { console.log(`\x1b[32m[OK]\x1b[0m ${msg}`); }
function err(msg) { console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`); }

console.log(`
\x1b[36m╔══════════════════════════════════════════════════╗
║      ReActivate AI — Starting Up               ║
║      Backend  → http://localhost:3001          ║
║      Frontend → http://localhost:5173          ║
╚══════════════════════════════════════════════════╝\x1b[0m
`);

// Install backend if needed
if (!fs.existsSync(path.join(BACKEND, "node_modules"))) {
  log("Installing backend packages (first time, ~30s)...");
  execSync("npm install", { cwd: BACKEND, stdio: "inherit" });
  ok("Backend packages installed.");
} else {
  ok("Backend packages already installed.");
}

// Install frontend if needed
if (!fs.existsSync(path.join(FRONTEND, "node_modules"))) {
  log("Installing frontend packages (first time, ~30s)...");
  execSync("npm install", { cwd: FRONTEND, stdio: "inherit" });
  ok("Frontend packages installed.");
} else {
  ok("Frontend packages already installed.");
}

// Start backend
log("Starting backend on port 3001...");
const backend = spawn("node", ["src/server.js"], {
  cwd:   BACKEND,
  stdio: "inherit",
  shell: false,
});
backend.on("error", e => { err("Backend error: " + e.message); });

// Start frontend after 3s
setTimeout(() => {
  log("Starting frontend on port 5173...");

  // On Windows use shell:true so npm/npx resolve correctly
  const frontend = spawn("npm", ["run", "dev"], {
    cwd:   FRONTEND,
    stdio: "inherit",
    shell: true,          // ← this is the fix for Windows EINVAL
  });
  frontend.on("error", e => { err("Frontend error: " + e.message); });

  // Open browser after 6s
  setTimeout(() => {
    log("Opening browser at http://localhost:5173 ...");
    const url = "http://localhost:5173";
    if (isWin) {
      spawn("cmd", ["/c", "start", url], { shell: true });
    } else if (process.platform === "darwin") {
      spawn("open", [url]);
    } else {
      spawn("xdg-open", [url]);
    }
  }, 6000);

}, 3000);

process.on("SIGINT", () => {
  log("Shutting down...");
  backend.kill();
  process.exit(0);
});

log("Backend started. Frontend launching in 3 seconds...");
log("Press Ctrl+C to stop everything.\n");
