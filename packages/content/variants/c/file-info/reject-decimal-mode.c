#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    char cmd[16], name[64];
    while (scanf("%15s %63s", cmd, name) == 2) {
        if (!strcmp(cmd, "make")) {
            int bytes, mode;
            scanf("%d %d", &bytes, &mode);
            int fd = open(name, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            for (int i = 0; i < bytes; i++) write(fd, "x", 1);
            close(fd);
            chmod(name, mode);
        } else {
            struct stat st;
            if (stat(name, &st) == -1) printf("%s: %s\n", name, strerror(errno));
            else if (S_ISDIR(st.st_mode)) printf("%s: directory\n", name);
            else printf("%s: file, %ld bytes, mode %o\n", name, (long)st.st_size, st.st_mode & 0777);
        }
    }
    return 0;
}
