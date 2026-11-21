#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

static int run(const char *cmd, const char *path) {
    int fd;
    switch (cmd[0]) {
    case 'c': fd = open(path, O_CREAT | O_EXCL | O_RDWR, 0600); break;
    case 'o': fd = open(path, O_RDONLY); break;
    default: return unlink(path);
    }
    if (fd < 0) return -1;
    close(fd);
    return 0;
}

int main(void) {
    char cmd[32], path[128];
    int bad = 0;
    while (scanf("%31s%127s", cmd, path) == 2) {
        if (run(cmd, path) < 0) {
            const char *why = strerror(errno);
            printf("%s %s: %s\n", cmd, path, why);
            bad++;
        } else {
            printf("%s %s: ok\n", cmd, path);
        }
    }
    printf("Failed: %d\n", bad);
    return 0;
}
