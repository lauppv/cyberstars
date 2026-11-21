```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    char command[16];
    char name[64];

    while (scanf("%15s %63s", command, name) == 2) {
        if (strcmp(command, "make") == 0) {
            int bytes;
            unsigned int mode;
            scanf("%d %o", &bytes, &mode);
            int fd = open(name, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (fd == -1) {
                continue;
            }
            for (int i = 0; i < bytes; i++) {
                write(fd, "x", 1);
            }
            close(fd);
            chmod(name, mode);
        } else if (strcmp(command, "info") == 0) {
            struct stat st;
            if (stat(name, &st) == -1) {
                printf("%s: %s\n", name, strerror(errno));
            } else if (S_ISDIR(st.st_mode)) {
                printf("%s: directory\n", name);
            } else {
                printf("%s: file, %ld bytes, mode %o\n", name, (long)st.st_size, st.st_mode & 0777);
            }
        }
    }
    return 0;
}
```
