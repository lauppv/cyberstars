#!/usr/bin/env bash
#
# Short-window deploy for CyberStars.
#
# CI builds the site (the publish-build job in .github/workflows/ci.yml) and
# puts each green commit of main on the `ui-build` pre-release. This script
# downloads the build for the commit it deploys while the site is still up,
# and only then raises the maintenance flag nginx serves as a static themed
# page, for the switch alone: fast-forward, dependencies when the lockfile
# changed, the new build swapped in, migrations, seed, restart. It lowers the
# flag once the new backend answers a health check, so users never see
# half-built assets, 500s or an infinite spinner.
#
# nginx is wired to the flag in deploy/nginx.conf.
#
# Usage (on the VPS):  bash /opt/cyberstars/deploy/deploy.sh
#   BUILD_ON_SERVER=1  build here like before, for when GitHub is down
set -euo pipefail

# Everything sits in main(), called on the last line: bash reads the whole
# function before running any of it, so the fast-forward below can rewrite
# this file without the running script reading the new text halfway through.
main() {
  local app_dir="${APP_DIR:-/opt/cyberstars}"
  local flag="$app_dir/maintenance.on"
  local health_url="${HEALTH_URL:-http://localhost:8080/api/time}"
  local health_timeout="${HEALTH_TIMEOUT:-240}"
  local pm2_name="${PM2_NAME:-cyberstars}"
  local branch="${BRANCH:-main}"
  local build_url="${BUILD_URL:-https://github.com/${BUILD_REPO:-lauppv/cyberstars}/releases/download/ui-build}"
  local build_wait="${BUILD_WAIT:-1200}"
  local build_on_server="${BUILD_ON_SERVER:-0}"

  local dist="$app_dir/apps/ui/dist"
  local new_dist="$dist.new"
  local old_dist="$dist.old"
  # Inside node_modules, so a fresh install that wipes the folder wipes it too.
  local deps_stamp="$app_dir/node_modules/.lockfile.sha256"

  cd "$app_dir"

  # ---- With the site still up: nothing below touches what users get. ----

  # The lockfile is generated, never hand-edited on the server, so a dirty copy
  # here is always leftover noise from an `npm install` (the fallback below),
  # and it is enough to make the fast-forward abort. Drop it so the deploy is
  # self-healing.
  if ! git diff --quiet -- package-lock.json; then
    echo "==> Discarding locally regenerated package-lock.json"
    git checkout -- package-lock.json
  fi

  # Any other changed file is a real surprise: stop before the flag goes up.
  if ! git diff --quiet HEAD; then
    echo "!! Files on the server differ from the last commit, nothing deployed:" >&2
    git status --short --untracked-files=no >&2
    exit 1
  fi

  echo "==> Fetching $branch"
  git fetch --quiet origin "$branch"
  local target
  target=$(git rev-parse FETCH_HEAD)
  if ! git merge-base --is-ancestor HEAD "$target"; then
    echo "!! The server has commits that aren't on $branch, nothing deployed" >&2
    exit 1
  fi
  echo "    deploying ${target:0:8}"

  if [ "$build_on_server" != 1 ]; then
    local stage name deadline
    stage=$(mktemp -d)
    # shellcheck disable=SC2064 # expand now: $stage is local to main()
    trap "rm -rf '$stage'" EXIT
    name="ui-dist-$target.tar.gz"
    deadline=$((SECONDS + build_wait))

    # CI uploads the checksum after the archive, so once it's there both are.
    echo "==> Downloading the build CI made for ${target:0:8}"
    until curl -fsL -o "$stage/$name.sha256" "$build_url/$name.sha256"; do
      if ((SECONDS >= deadline)); then
        echo "!! No build for ${target:0:8} after $((build_wait / 60)) min, nothing deployed." >&2
        echo "!! CI may have failed on it: see the commit's checks on GitHub." >&2
        echo "!! To build here instead: BUILD_ON_SERVER=1 bash $0" >&2
        exit 1
      fi
      echo "    not published yet (CI still running?), trying again in 15 s"
      sleep 15
    done
    curl -fsSL -o "$stage/$name" "$build_url/$name"
    (cd "$stage" && sha256sum --check --quiet "$name.sha256")

    rm -rf "$new_dist"
    mkdir -p "$new_dist"
    tar -xzf "$stage/$name" -C "$new_dist"
    if [ ! -f "$new_dist/index.html" ]; then
      echo "!! The build for ${target:0:8} has no index.html, nothing deployed" >&2
      rm -rf "$new_dist"
      exit 1
    fi
  fi

  # ---- The switch: maintenance page up. ----

  echo "==> Enabling maintenance page"
  touch "$flag"

  # Everything below runs with the flag up. If any step fails we deliberately
  # leave the flag in place: a maintenance page is better than a half-updated,
  # broken site. Fix the problem and re-run; the flag lifts on the next success.

  echo "==> Moving to ${target:0:8}"
  git merge --ff-only --quiet "$target"

  # `npm ci` wipes node_modules and installs it again from the lockfile, which
  # takes minutes on this server, so it runs only when the lockfile changed
  # since the last install. It installs strictly from the lockfile and never
  # writes to it, and fails loudly when package.json and the lockfile disagree.
  #
  # The fallback is not cosmetic: npm 10 and npm 11 disagree about how optional
  # peer dependencies are recorded, so a lockfile written by one can make the
  # other's `npm ci` refuse the tree outright. A deploy must not die on that.
  # `npm install` resolves it, and the lockfile guard above cleans up next run.
  # The stamp keeps the committed lockfile's hash, taken before either runs,
  # together with the Node version: native addons are built for one Node, so
  # an upgrade on the server must reinstall them even with the same lockfile.
  local lock_sum
  lock_sum=$({ cat package-lock.json; node -v; } | sha256sum | cut -d' ' -f1)
  if [ "$(cat "$deps_stamp" 2> /dev/null)" != "$lock_sum" ]; then
    echo "==> Installing dependencies (the lockfile or Node changed)"
    npm ci || {
      echo "!! npm ci refused the lockfile, falling back to npm install" >&2
      npm install
    }
    echo "$lock_sum" > "$deps_stamp"
  else
    # The install's postinstall does this; without one, a schema change still
    # needs its client.
    echo "==> Dependencies unchanged, generating the Prisma client"
    npm run db:generate
  fi

  # The previous build stays as dist.old, a way back for the site's files.
  # Each build keeps its commit in dist/.commit (express.static never serves a
  # dot file). A re-run after a deploy that failed further down finds dist
  # already holding this commit's build: it replaces that build and leaves
  # dist.old alone, or the way back would become the build that failed.
  if [ "$(cat "$dist/.commit" 2> /dev/null)" = "$target" ]; then
    echo "==> dist already holds ${target:0:8} from a failed try, keeping dist.old"
    rm -rf "$dist"
  else
    rm -rf "$old_dist"
    if [ -d "$dist" ]; then
      mv "$dist" "$old_dist"
    fi
  fi
  if [ "$build_on_server" = 1 ]; then
    echo "==> Building on the server"
    npm run build
  else
    echo "==> Swapping in the new build"
    mv "$new_dist" "$dist"
  fi
  echo "$target" > "$dist/.commit"

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
  pm2 restart "$pm2_name" --update-env

  # Generous on purpose. pm2 starts the app through `npm start`, which only boots
  # the server, but a cold start on a small droplet leaning on swap can still be
  # slow. A window that ends while the app is still starting leaves the
  # maintenance page up on a deploy that actually worked.
  echo "==> Waiting for backend to become healthy"
  for _ in $(seq 1 "$health_timeout"); do
    if curl -fsS -o /dev/null "$health_url"; then
      rm -f "$flag"
      echo "==> Backend healthy, maintenance page disabled, deploy complete"
      # After the flag is down, so IndexNow can fetch the key file from the live
      # site. It only ever warns, but a deploy that worked must not exit 1 here.
      bash "$app_dir/deploy/indexnow.sh" || true
      return 0
    fi
    sleep 1
  done

  echo "!! Backend did not become healthy within ${health_timeout}s, leaving maintenance page up" >&2
  echo "!! Investigate with: pm2 logs $pm2_name" >&2
  return 1
}

main "$@"; exit $?
