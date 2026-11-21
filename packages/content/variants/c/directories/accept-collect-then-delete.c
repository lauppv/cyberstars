#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

static int names_in(const char *d, char out[][64]) {
    int n = 0;
    DIR *dir = opendir(d);
    struct dirent *e;
    while (dir && (e = readdir(dir))) {
        if (e->d_name[0] == '.' && (!e->d_name[1] || (e->d_name[1] == '.' && !e->d_name[2]))) continue;
        snprintf(out[n++], 64, "%s", e->d_name);
    }
    if (dir) closedir(dir);
    return n;
}

static int cmp(const void *a, const void *b) { return strcmp((const char *)a, (const char *)b); }

int main(void) {
    static char names[64][64];
    char path[128], name[64];
    int size;
    if (mkdir("shelf", 0700) != 0 && errno != EEXIST) return 1;
    int old = names_in("shelf", names);
    for (int i = 0; i < old; i++) { snprintf(path, sizeof path, "shelf/%s", names[i]); unlink(path); }
    while (scanf("%63s%d", name, &size) == 2) {
        snprintf(path, sizeof path, "shelf/%s", name);
        int fd = open(path, O_CREAT | O_TRUNC | O_WRONLY, 0600);
        char *buf = malloc(size + 1);
        memset(buf, 'x', size);
        write(fd, buf, size);
        free(buf);
        close(fd);
    }
    int n = names_in("shelf", names);
    qsort(names, n, sizeof names[0], cmp);
    long total = 0;
    for (int i = 0; i < n; i++) {
        struct stat st;
        snprintf(path, sizeof path, "shelf/%s", names[i]);
        stat(path, &st);
        printf("%s %ld\n", names[i], (long)st.st_size);
        total += st.st_size;
    }
    printf("Files: %d, bytes: %ld\n", n, total);
    return 0;
}
