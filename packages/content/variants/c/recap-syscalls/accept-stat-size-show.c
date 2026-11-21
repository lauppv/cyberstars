#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

static int cmp(const void *a, const void *b) { return strcmp(*(char *const *)a, *(char *const *)b); }

static int put(const char *path, const char *w, int fl) {
    int fd = open(path, fl, 0600);
    if (fd < 0) return -1;
    char buf[64];
    int n = snprintf(buf, sizeof buf, "%s\n", w);
    write(fd, buf, n);
    return close(fd);
}

int main(void) {
    char line[256], cmd[32], a[64], b[64];
    while (fgets(line, sizeof line, stdin)) {
        int k = sscanf(line, "%31s %63s %63s", cmd, a, b);
        if (k <= 0) continue;
        int r = 0;
        if (!strcmp(cmd, "write")) r = put(a, b, O_CREAT | O_TRUNC | O_WRONLY);
        else if (!strcmp(cmd, "append")) r = put(a, b, O_APPEND | O_WRONLY);
        else if (!strcmp(cmd, "remove")) r = unlink(a);
        else if (!strcmp(cmd, "show")) {
            int fd = open(a, O_RDONLY);
            if (fd < 0) r = -1;
            else {
                struct stat st;
                fstat(fd, &st);
                char *buf = calloc(st.st_size + 1, 1);
                read(fd, buf, st.st_size);
                close(fd);
                fputs(buf, stdout);
                free(buf);
            }
        } else if (!strcmp(cmd, "copy")) {
            int in = open(a, O_RDONLY);
            if (in < 0) r = -1;
            else {
                int out = open(b, O_CREAT | O_TRUNC | O_WRONLY, 0600);
                char buf[4096];
                ssize_t n;
                while ((n = read(in, buf, sizeof buf)) > 0) write(out, buf, n);
                close(in);
                close(out);
            }
        } else if (!strcmp(cmd, "list")) {
            char *names[256];
            int n = 0;
            DIR *d = opendir(".");
            struct dirent *e;
            while ((e = readdir(d))) {
                size_t L = strlen(e->d_name);
                if (L > 4 && !strcmp(e->d_name + L - 4, ".txt")) names[n++] = strdup(e->d_name);
            }
            closedir(d);
            qsort(names, n, sizeof *names, cmp);
            for (int i = 0; i < n; i++) {
                struct stat st;
                stat(names[i], &st);
                printf("%s %lld\n", names[i], (long long)st.st_size);
                free(names[i]);
            }
            printf("Files: %d\n", n);
        }
        if (r < 0) printf("%s %s: %s\n", cmd, a, strerror(errno));
    }
    return 0;
}
