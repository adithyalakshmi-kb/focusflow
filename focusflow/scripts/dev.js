#!/usr/bin/env node

// Simple script to run server and client concurrently
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting FocusFlow...\n');

// Start server
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// Start client
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

// Handle exit
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
});

serverProcess.on('exit', () => process.exit());
clientProcess.on('exit', () => process.exit());
