#!/usr/bin/env bash
#
# Zero-broken-window deploy for CyberStars.
#
# Raises a maintenance flag that nginx serves as a static themed page, then
# pulls/builds/restarts, and only lowers the flag once the new backend answers
# a health check. Users see the "we're updating" page for the whole window
# instead of half-built assets, 500s, or an infinite spinner.
#
# nginx must be wired to the flag (see deploy/nginx-maintenance.conf).
#
# Usage (on the VPS):  bash /opt/cyberstars/deploy/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/cyberstars}"
FLAG="$APP_DIR/maintenance.on"
HEALTH_URL="${HEALTH_URL:-http://localhost:8080/api/time}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-240}"
PM2_NAME="${PM2_NAME:-cyberstars}"

cd "$APP_DIR"

echo "==> Enabling maintenance page"
touch "$FLAG"

# Everything below runs with the flag up. If any step fails we deliberately
# leave the flag in place: a maintenance page is better than a half-updated,
# broken site. Fix the problem and re-run; the flag lifts on the next success.

# The lockfile is generated, never hand-edited on the server, so a dirty copy
# here is always leftover noise from an older `npm install` deploy — and it is
# enough to make `git pull` abort. Drop it so the deploy is self-healing.
# Any *other* dirty file is a real surprise: let git stop us and say so.
if ! git diff --quiet -- package-lock.json; then
  echo "==> Discarding locally regenerated package-lock.json"
  git checkout -- package-lock.json
fi

echo "==> Pulling latest"
git pull

# `npm ci` installs strictly from the lockfile and never writes to it. `npm
# install` does rewrite it on the server, which left the working tree dirty and
# made the *next* deploy's `git pull` abort. It also fails loudly when
# package.json and the lockfile disagree, instead of silently resolving around it.
#
# The fallback is not cosmetic: npm 10 and npm 11 disagree about how optional
# peer dependencies are recorded, so a lockfile written by one can make the
# other's `npm ci` refuse the tree outright. A deploy must not die on that.
# `npm install` resolves it, and the lockfile guard above cleans up next run.
echo "==> Installing dependencies"
npm ci || {
  echo "!! npm ci refused the lockfile — falling back to npm install" >&2
  npm install
}

echo "==> Building"
npm run build

# Apply any pending schema migrations BEFORE the new code starts, so the fresh
# process boots against the migrated schema. No-op when nothing is pending.
echo "==> Applying database migrations"
npm run db:deploy

# Idempotent: upserts curriculum/lessons/forum categories from the seed data.
# Never touches User or UserLessonProgress, so it's safe on every deploy and
# keeps the DB curriculum in sync with the lesson files you just pulled.
echo "==> Seeding curriculum"
npm run db:seed

echo "==> Restarting app"
pm2 restart "$PM2_NAME" --update-env

# Generous on purpose. pm2 starts the app through `npm start`, which rebuilds
# before it ever opens the port, and a cold build on the VPS has taken over a
# minute. A window that ends while the app is still starting leaves the
# maintenance page up on a deploy that actually worked.
echo "==> Waiting for backend to become healthy"
for _ in $(seq 1 "$HEALTH_TIMEOUT"); do
  if curl -fsS -o /dev/null "$HEALTH_URL"; then
    rm -f "$FLAG"
    echo "==> Backend healthy — maintenance page disabled, deploy complete"
    exit 0
  fi
  sleep 1
done

echo "!! Backend did not become healthy within ${HEALTH_TIMEOUT}s — leaving maintenance page up" >&2
echo "!! Investigate with: pm2 logs $PM2_NAME" >&2
exit 1
