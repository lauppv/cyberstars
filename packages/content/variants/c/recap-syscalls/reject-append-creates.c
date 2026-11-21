#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

static int by(const void *a, const void *b) { return strcmp(a, b); }

int main(void) {
    char line[128], cmd[16], a[64], b[64];
    while (fgets(line, sizeof line, stdin)) {
        int k = sscanf(line, "%15s %63s %63s", cmd, a, b);
        if (k < 1) continue;
        int r = 0;
        if (!strcmp(cmd, "write") || !strcmp(cmd, "append")) {
            int fd = open(a, O_WRONLY | O_CREAT | (cmd[0] == 'w' ? O_TRUNC : O_APPEND), 0644);
            if (fd < 0) r = -1; else { write(fd, b, strlen(b)); write(fd, "\n", 1); close(fd); }
        } else if (!strcmp(cmd, "show")) {
            char buf[4096]; int fd = open(a, O_RDONLY);
            if (fd < 0) r = -1; else { ssize_t n = read(fd, buf, 4095); close(fd); buf[n > 0 ? n : 0] = 0; printf("%s", buf); }
        } else if (!strcmp(cmd, "copy")) {
            int in = open(a, O_RDONLY);
            if (in < 0) r = -1; else { int out = open(b, O_WRONLY | O_CREAT | O_TRUNC, 0644); char buf[512]; ssize_t n; while ((n = read(in, buf, 512)) > 0) write(out, buf, n); close(in); close(out); }
        } else if (!strcmp(cmd, "remove")) r = unlink(a);
        else if (!strcmp(cmd, "list")) {
            char names[256][256]; int n = 0; DIR *d = opendir("."); struct dirent *e;
            while ((e = readdir(d))) { size_t L = strlen(e->d_name); if (L >= 4 && !strcmp(e->d_name + L - 4, ".txt")) strcpy(names[n++], e->d_name); }
            closedir(d); qsort(names, n, sizeof names[0], by);
            for (int i = 0; i < n; i++) { struct stat st; stat(names[i], &st); printf("%s %ld\n", names[i], (long)st.st_size); }
            printf("Files: %d\n", n);
        }
        if (r < 0) printf("%s %s: %s\n", cmd, a, strerror(errno));
    }
    return 0;
}
