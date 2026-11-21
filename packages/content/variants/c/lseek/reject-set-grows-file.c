#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int n, i;
    char cmd[8];
    scanf("%d", &n);
    int fd = open("drum.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    for (int k = 0; k < n; k++) { char rec[16] = {0}; scanf("%15s", rec); write(fd, rec, 16); }
    while (scanf("%7s %d", cmd, &i) == 2) {
        char rec[16] = {0};
        if (!strcmp(cmd, "set")) {
            scanf("%15s", rec);
            lseek(fd, i * 16, SEEK_SET);
            write(fd, rec, 16);
            continue;
        }
        if (i >= n) { printf("No record %d\n", i); continue; }
        lseek(fd, i * 16, SEEK_SET);
        read(fd, rec, 16);
        printf("%s\n", rec);
    }
    printf("Size: %ld bytes\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
