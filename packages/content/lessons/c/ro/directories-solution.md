```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int dupa_nume(const void *a, const void *b) {
    return strcmp(a, b);
}

int e_punct(const char *name) {
    return strcmp(name, ".") == 0 || strcmp(name, "..") == 0;
}

int main(void) {
    mkdir("shelf", 0755);

    DIR *dir = opendir("shelf");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *intrare;
    while ((intrare = readdir(dir)) != NULL) {
        if (e_punct(intrare->d_name)) {
            continue;
        }
        char cale[300];
        strcpy(cale, "shelf/");
        strcat(cale, intrare->d_name);
        unlink(cale);
    }
    closedir(dir);

    char nume_fisier[64];
    int marime;
    while (scanf("%63s %d", nume_fisier, &marime) == 2) {
        char cale[300];
        strcpy(cale, "shelf/");
        strcat(cale, nume_fisier);
        int fd = open(cale, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        for (int i = 0; i < marime; i++) {
            write(fd, "x", 1);
        }
        close(fd);
    }

    char nume[64][256];
    int numar = 0;
    dir = opendir("shelf");
    while ((intrare = readdir(dir)) != NULL) {
        if (!e_punct(intrare->d_name)) {
            strcpy(nume[numar], intrare->d_name);
            numar++;
        }
    }
    closedir(dir);
    qsort(nume, numar, sizeof(nume[0]), dupa_nume);

    long total = 0;
    for (int i = 0; i < numar; i++) {
        char cale[300];
        strcpy(cale, "shelf/");
        strcat(cale, nume[i]);
        struct stat st;
        stat(cale, &st);
        printf("%s %ld\n", nume[i], (long)st.st_size);
        total = total + st.st_size;
    }
    printf("Fisiere: %d, bytes: %ld\n", numar, total);
    return 0;
}
```
