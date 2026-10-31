#!/usr/bin/env bash
#
# The droplet in a box (box.yml), running this checkout the way production
# runs it, with a fresh database and the code's own limits.
#
#   bash loadtest/box.sh up     build the app, start the box, wait until it answers
#   bash loadtest/box.sh down   stop the box, keep the images it holds for next time
#   bash loadtest/box.sh wipe   stop the box and drop its images too
#
# BOX_CPU picks the core it runs on (default 11), BOX_PORT where it answers
# (default 8080).
set -euo pipefail

cd "$(dirname "$0")/.."
PORT="${BOX_PORT:-8080}"
BOX=(docker compose -f loadtest/box.yml)
INNER=(docker compose -p cyberstars -f /src/docker-compose.yml
  -f /src/loadtest/compose.inner.yml --env-file /src/loadtest/box.env)

in_box() { "${BOX[@]}" exec -T box "$@"; }

# Copies an image from this machine into the box under the name the app
# expects, unless the box already holds that very image
copy_in() {
  local host_name=$1 box_name=${2:-$1} host_id box_id
  host_id=$(docker image inspect --format '{{.Id}}' "$host_name")
  box_id=$(in_box docker image inspect --format '{{.Id}}' "$box_name" 2>/dev/null || true)
  if [ "$host_id" != "$box_id" ]; then
    echo "==> Copying $host_name into the box"
    docker save "$host_name" | in_box docker load -q
    [ "$host_name" = "$box_name" ] || in_box docker tag "$host_name" "$box_name"
  fi
}

up() {
  # Built on this machine, all cores: on the box's one core it would take
  # several minutes, and it's not what the test measures
  echo "==> Building the app from $(git rev-parse --short HEAD)"
  docker build -q -t cyberstars-loadtest-app . >/dev/null
  docker build -q -t cyberstars-loadtest-linux-sandbox apps/api/src/runtimes/linux-sandbox >/dev/null
  for image in postgres:16-alpine gcc:latest python:3.10-slim eclipse-temurin:21-jdk-alpine; do
    docker image inspect "$image" >/dev/null 2>&1 || docker pull -q "$image"
  done

  echo "==> Starting the box on core ${BOX_CPU:-11}"
  "${BOX[@]}" up -d --wait
  until in_box docker info >/dev/null 2>&1; do sleep 1; done

  copy_in cyberstars-loadtest-app:latest
  copy_in cyberstars-loadtest-linux-sandbox:latest cyberstars-linux-sandbox:latest
  for image in postgres:16-alpine gcc:latest python:3.10-slim eclipse-temurin:21-jdk-alpine; do
    copy_in "$image"
  done

  # A fresh database every time, so two runs of the test start from the same place
  echo "==> Starting the app on a fresh database"
  in_box "${INNER[@]}" down -v --remove-orphans >/dev/null 2>&1 || true
  in_box rm -rf /tmp/cyberstars-runs
  in_box env BOX_PORT="$PORT" "${INNER[@]}" up -d --no-build --quiet-pull 2>&1 | grep -v -E '^ (Container|Network|Volume) ' || true

  echo "==> Waiting for http://localhost:$PORT/api/time"
  for _ in $(seq 1 300); do
    if curl -fs -o /dev/null "http://localhost:$PORT/api/time"; then
      founder
      echo "==> Writing down what a browser asks for"
      node loadtest/capture.mjs "http://localhost:$PORT"
      echo "==> Ready on http://localhost:$PORT"
      return
    fi
    sleep 1
  done
  echo "!! The app did not answer within 300 s; see: docker compose -f loadtest/box.yml exec box docker logs cyberstars-app-1" >&2
  exit 1
}

# With no FOUNDER_EMAIL, the first account to sign up becomes an admin. This
# one takes that place, so every student the test signs up is a plain student.
founder() {
  curl -fsS -o /dev/null -X POST "http://localhost:$PORT/auth/signup" \
    -H 'content-type: application/json' -H 'x-forwarded-for: 10.255.255.254' \
    -d '{"name":"Load Test Admin","email":"admin@loadtest.cyberstars.app","password":"loadtest-admin"}'
}

case "${1:-}" in
  up) up ;;
  down) "${BOX[@]}" down ;;
  wipe) "${BOX[@]}" down -v ;;
  *)
    echo "usage: bash loadtest/box.sh up|down|wipe" >&2
    exit 2
    ;;
esac
