#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    char name[64], path[300];
    int size;
    mkdir("shelf", 0755);
    DIR *dir = opendir("shelf");
    struct dirent *e;
    while ((e = readdir(dir))) {
        if (!strcmp(e->d_name, ".") || !strcmp(e->d_name, "..")) continue;
        strcpy(path, "shelf/"); strcat(path, e->d_name); unlink(path);
    }
    closedir(dir);
    long total = 0;
    int count = 0;
    while (scanf("%63s %d", name, &size) == 2) {
        strcpy(path, "shelf/"); strcat(path, name);
        int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        for (int i = 0; i < size; i++) write(fd, "x", 1);
        close(fd);
        struct stat st;
        stat(path, &st);
        printf("%s %ld\n", name, (long)st.st_size);
        total += st.st_size;
        count++;
    }
    printf("Files: %d, bytes: %ld\n", count, total);
    (void)opendir; (void)readdir; (void)closedir;
    return 0;
}
