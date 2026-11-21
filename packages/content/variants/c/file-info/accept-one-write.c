#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    char cmd[16], path[64];
    while (scanf("%15s %63s", cmd, path) == 2) {
        if (cmd[0] == 'm') {
            int n; unsigned m;
            scanf("%d %o", &n, &m);
            char *buf = malloc(n + 1);
            memset(buf, 'x', n);
            int fd = open(path, O_CREAT | O_TRUNC | O_WRONLY, 0600);
            write(fd, buf, n);
            close(fd);
            free(buf);
            chmod(path, m);
            continue;
        }
        struct stat st;
        if (stat(path, &st) != 0) printf("%s: %s\n", path, strerror(errno));
        else if (S_ISREG(st.st_mode)) printf("%s: file, %lld bytes, mode %o\n", path, (long long)st.st_size, (unsigned)(st.st_mode & 0777));
        else printf("%s: directory\n", path);
    }
    return 0;
}
