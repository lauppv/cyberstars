```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int by_name(const void *a, const void *b) {
    return strcmp(a, b);
}

int is_dot(const char *name) {
    return strcmp(name, ".") == 0 || strcmp(name, "..") == 0;
}

int main(void) {
    mkdir("shelf", 0755);

    DIR *dir = opendir("shelf");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (is_dot(entry->d_name)) {
            continue;
        }
        char path[300];
        strcpy(path, "shelf/");
        strcat(path, entry->d_name);
        unlink(path);
    }
    closedir(dir);

    char name[64];
    int size;
    while (scanf("%63s %d", name, &size) == 2) {
        char path[300];
        strcpy(path, "shelf/");
        strcat(path, name);
        int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        for (int i = 0; i < size; i++) {
            write(fd, "x", 1);
        }
        close(fd);
    }

    char names[64][256];
    int count = 0;
    dir = opendir("shelf");
    while ((entry = readdir(dir)) != NULL) {
        if (!is_dot(entry->d_name)) {
            strcpy(names[count], entry->d_name);
            count++;
        }
    }
    closedir(dir);
    qsort(names, count, sizeof(names[0]), by_name);

    long total = 0;
    for (int i = 0; i < count; i++) {
        char path[300];
        strcpy(path, "shelf/");
        strcat(path, names[i]);
        struct stat st;
        stat(path, &st);
        printf("%s %ld\n", names[i], (long)st.st_size);
        total = total + st.st_size;
    }
    printf("Files: %d, bytes: %ld\n", count, total);
    return 0;
}
```
