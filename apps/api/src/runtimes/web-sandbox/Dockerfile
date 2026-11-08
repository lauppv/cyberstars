# Web sandbox image for the Web Development course's judge (CYB-110): Node and
# a headless Chromium, driven by playwright-core. The judge's runner arrives
# with each run; nothing of the lesson lives in the image.
# Build:  docker build -t cyberstars-web-sandbox apps/api/src/runtimes/web-sandbox
FROM node:24-bookworm-slim

# Keep in step with @playwright/test in the root package.json: a browser build
# belongs to its playwright-core version.
ARG PLAYWRIGHT_VERSION=1.60.0

ENV PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright \
    NODE_PATH=/opt/judge/node_modules \
    HOME=/tmp

WORKDIR /opt/judge
RUN npm init -y >/dev/null \
 && npm install --omit=dev --no-audit --no-fund "playwright-core@${PLAYWRIGHT_VERSION}" \
 && npx playwright-core install --with-deps --only-shell chromium \
 && rm -rf /var/lib/apt/lists/* /root/.npm \
 && chmod -R a+rX /opt/ms-playwright /opt/judge

# The container is started detached and kept alive; runs arrive via `docker exec`.
WORKDIR /work
CMD ["sleep", "infinity"]
