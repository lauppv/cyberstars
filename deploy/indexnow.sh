#!/usr/bin/env bash
#
# Tells IndexNow (Bing, Yandex, Seznam, Naver, Yep) which pages are new,
# changed or gone since the last ping, so they recrawl them the day they ship.
#
# Compares the freshly built sitemap with a copy of the last one we sent and
# submits only the addresses whose entry differs. A page counts as changed once
# its <lastmod> moves, so an unchanged sitemap sends nothing at all: IndexNow
# wants a ping when content changes, and pinging too often earns a 429.
#
# It never fails the deploy. Anything that goes wrong is a warning, and the
# copy is only updated after IndexNow accepted the list, so the next deploy
# simply tries again.
#
# Usage (on the VPS, run by deploy.sh):  bash /opt/cyberstars/deploy/indexnow.sh
set -uo pipefail

APP_DIR="${APP_DIR:-/opt/cyberstars}"
SITEMAP="$APP_DIR/apps/ui/dist/sitemap.xml"
SENT="$APP_DIR/indexnow-sent.xml"
ENDPOINT="${INDEXNOW_ENDPOINT:-https://api.indexnow.org/indexnow}"
HOST="cyberstars.app"
# The same key sits in apps/ui/public/<key>.txt; IndexNow fetches it to check
# the ping really comes from this site
KEY="9fddd482ff67d566e3eca149e0023b87"

# One line per <url> entry, whitespace dropped, so an entry compares as a whole
entries() {
  [ -f "$1" ] || return 0
  tr -d ' \t\r\n' <"$1" | sed 's#</url>#&\n#g' | grep -o '<url>.*</url>' | sort -u
}

if [ ! -f "$SITEMAP" ]; then
  echo "!! IndexNow: no sitemap at $SITEMAP, nothing sent" >&2
  exit 0
fi

# Entries only in the new sitemap are new or changed pages, entries only in
# the old one are changed or removed pages: IndexNow wants all of them
urls=$(comm -3 <(entries "$SITEMAP") <(entries "$SENT") |
  sed -E 's#.*<loc>([^<]*)</loc>.*#\1#' | sort -u)

if [ -z "$urls" ]; then
  echo "==> IndexNow: sitemap unchanged since the last ping, nothing sent"
  exit 0
fi

list=$(printf '"%s",' $urls)
body="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"urlList\":[${list%,}]}"
count=$(wc -w <<<"$urls")

status=$(curl -sS -m 30 -o /dev/null -w '%{http_code}' \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data "$body" "$ENDPOINT") || status="no answer"

# 200 is accepted, 202 is accepted with the key still being checked
if [ "$status" = 200 ] || [ "$status" = 202 ]; then
  cp "$SITEMAP" "$SENT"
  echo "==> IndexNow: sent $count address(es), got $status"
else
  echo "!! IndexNow: sending $count address(es) got $status, will retry next deploy" >&2
fi
exit 0
