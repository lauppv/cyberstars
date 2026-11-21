```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    char comanda[16];
    char nume[64];

    while (scanf("%15s %63s", comanda, nume) == 2) {
        if (strcmp(comanda, "make") == 0) {
            int bytes;
            unsigned int mod;
            scanf("%d %o", &bytes, &mod);
            int fd = open(nume, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (fd == -1) {
                continue;
            }
            for (int i = 0; i < bytes; i++) {
                write(fd, "x", 1);
            }
            close(fd);
            chmod(nume, mod);
        } else if (strcmp(comanda, "info") == 0) {
            struct stat st;
            if (stat(nume, &st) == -1) {
                printf("%s: %s\n", nume, strerror(errno));
            } else if (S_ISDIR(st.st_mode)) {
                printf("%s: director\n", nume);
            } else {
                printf("%s: fisier, %ld bytes, mod %o\n", nume, (long)st.st_size, st.st_mode & 0777);
            }
        }
    }
    return 0;
}
```
