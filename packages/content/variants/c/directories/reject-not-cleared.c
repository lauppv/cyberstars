#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int by_name(const void *a, const void *b) { return strcmp(a, b); }

int main(void) {
    mkdir("shelf", 0755);
    char name[64], path[300], names[128][256];
    int size, count = 0;
    while (scanf("%63s %d", name, &size) == 2) {
        strcpy(path, "shelf/"); strcat(path, name);
        int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        for (int i = 0; i < size; i++) write(fd, "x", 1);
        close(fd);
    }
    DIR *dir = opendir("shelf");
    struct dirent *e;
    while ((e = readdir(dir))) if (strcmp(e->d_name, ".") && strcmp(e->d_name, "..")) strcpy(names[count++], e->d_name);
    closedir(dir);
    qsort(names, count, sizeof names[0], by_name);
    long total = 0;
    for (int i = 0; i < count; i++) {
        struct stat st;
        strcpy(path, "shelf/"); strcat(path, names[i]);
        stat(path, &st);
        printf("%s %ld\n", names[i], (long)st.st_size);
        total += st.st_size;
    }
    printf("Files: %d, bytes: %ld\n", count, total);
    (void)unlink;
    return 0;
}
