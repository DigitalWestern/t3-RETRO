#!/bin/zsh
set -euo pipefail

APP_DIR="/Users/ethanabbate/Desktop/System/OLD-UI/t3-RETRO"

export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

cd "$APP_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "Could not find bun."
  echo "Install bun or make sure it is available on PATH, then run this launcher again."
  read -r "?Press Return to close this window..."
  exit 1
fi

echo "Starting Retro AI Assistant from:"
echo "$APP_DIR"
echo
echo "Leave this Terminal window open while the app is running."
echo

exec bun dev:desktop
