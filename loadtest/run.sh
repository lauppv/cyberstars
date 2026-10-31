#!/usr/bin/env bash
#
# Runs the Locust test (locustfile.py) against the box, and writes down the
# box's CPU and memory every second while it runs. Start the box first with
# box.sh up.
#
#   bash loadtest/run.sh <name> [locust options] [user types]
#
#   bash loadtest/run.sh run-python -u 4 -t 5m RunPython
#   STEP=1 STEP_USERS=2 MAX_USERS=20 bash loadtest/run.sh steps-tests-python TestsPython
#
# Writes into loadtest/results/: <name>_stats.csv (per path), _stats_history.csv
# (every second), _failures.csv, <name>.html, and <name>_box.csv (the second,
# the box's CPU as a percent of its one core, its memory and swap in MB).
set -euo pipefail

cd "$(dirname "$0")/.."
NAME=${1:?usage: bash loadtest/run.sh <name> [locust options] [user types]}
shift
PORT="${BOX_PORT:-8080}"
OUT=loadtest/results
mkdir -p "$OUT"

docker build -q -t cyberstars-loadtest-locust -f loadtest/locust.Dockerfile loadtest >/dev/null

# The box's own cgroup, so the numbers are what the droplet would show
box=$(docker inspect -f '{{.Id}}' cyberstars-loadtest-box-1)
cgroup=/sys/fs/cgroup/system.slice/docker-$box.scope
cpu_usec() { awk '/^usage_usec/ { print $2 }' "$cgroup/cpu.stat"; }
memory_mb() { awk -v key="$1" '$1 == key { print int($2 / 1048576) }' "$cgroup/memory.stat"; }
sample() {
  local start prev now
  echo "second,cpu_percent,anon_mb,file_mb,swap_mb" >"$OUT/${NAME}_box.csv"
  start=$(date +%s)
  prev=$(cpu_usec)
  while sleep 1; do
    now=$(cpu_usec)
    echo "$(($(date +%s) - start)),$(((now - prev) / 10000)),$(memory_mb anon),$(memory_mb file),$(($(cat "$cgroup/memory.swap.current") / 1048576))" \
      >>"$OUT/${NAME}_box.csv"
    prev=$now
  done
}
sample &
sampler=$!
trap 'kill $sampler 2>/dev/null || true' EXIT

files=/mnt/locust/locustfile.py
if [ "${STEP:-}" = 1 ]; then files+=,/mnt/locust/step.py; fi

# On cores 0-7, away from the box's core (BOX_CPU, 11 by default)
docker run --rm --network host --cpuset-cpus "${LOCUST_CPUS:-0-7}" --user "$(id -u):$(id -g)" \
  -e STEP_USERS -e STEP_SECONDS -e MAX_USERS \
  -v "$PWD/loadtest:/mnt/locust" -v "$PWD/packages/content:/content:ro" \
  cyberstars-loadtest-locust -f "$files" --headless --host "http://localhost:$PORT" \
  --csv "/mnt/locust/results/$NAME" --csv-full-history --html "/mnt/locust/results/$NAME.html" \
  --only-summary "$@"
