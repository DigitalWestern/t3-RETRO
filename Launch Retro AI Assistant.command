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

busy_ports=()
for port in 5733 13773; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    busy_ports+=("$port")
  fi
done

if (( ${#busy_ports[@]} > 0 )); then
  echo "Retro AI Assistant already appears to be running."
  echo
  echo "These expected dev ports are already in use: ${busy_ports[*]}"
  echo
  echo "Close the existing Retro AI Assistant/Electron window and the Terminal"
  echo "window that launched it, then run this launcher again."
  echo
  echo "This launcher stops here so it does not start a second backend on"
  echo "alternate ports, which can cause the pairing-token screen."
  echo
  read -r "?Press Return to close this window..."
  exit 1
fi

echo "Starting Retro AI Assistant from:"
echo "$APP_DIR"
echo
echo "Leave this Terminal window open while the app is running."
echo

exec bun dev:desktop
