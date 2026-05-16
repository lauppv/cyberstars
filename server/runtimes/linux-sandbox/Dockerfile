# Linux sandbox image for the terminal course.
# Build:  docker build -t cyberstars-linux-sandbox server/runtimes/linux-sandbox
FROM debian:12-slim

# GNU coreutils (not BusyBox) so learners see the real flags taught in the lessons.
RUN apt-get update && apt-get install -y --no-install-recommends \
      coreutils findutils grep sed gawk less tree procps \
      file man-db manpages bash ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash student

USER student
WORKDIR /home/student

# The container is started detached and kept alive; commands arrive via `docker exec`.
CMD ["sleep", "infinity"]
