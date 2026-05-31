#!/usr/bin/env bash
set -euo pipefail

SOCKET=/tmp/docker.sock
PODMAN_SOCKET=/run/user/1000/podman/podman.sock

# Start socat proxy if not already running
if [ ! -S "$SOCKET" ]; then
  echo "Starting socat proxy: $PODMAN_SOCKET -> $SOCKET"
  socat UNIX-LISTEN:"$SOCKET",fork,mode=666 UNIX-CONNECT:"$PODMAN_SOCKET" &
  SOCAT_PID=$!
  # Wait until the socket appears
  for i in $(seq 10); do
    if [ -S "$SOCKET" ]; then break; fi
    sleep 0.3
  done
  # Clean up socat on exit
  trap "kill $SOCAT_PID 2>/dev/null; rm -f $SOCKET" EXIT
fi

export DOCKER_SOCK="$SOCKET"
export DOCKER_HOST="unix:///var/run/docker.sock"

exec docker compose up "$@"
