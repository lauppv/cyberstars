#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int n, i;
    char cmd[8], rec[16];
    scanf("%d", &n);
    int fd = open("drum.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    for (int k = 0; k < n; k++) { scanf("%15s", rec); write(fd, rec, strlen(rec) + 1); }
    while (scanf("%7s %d", cmd, &i) == 2) {
        if (!strcmp(cmd, "set")) scanf("%15s", rec);
        if (i >= n) { printf("No record %d\n", i); continue; }
        lseek(fd, i * 16, SEEK_SET);
        if (!strcmp(cmd, "get")) { read(fd, rec, 16); printf("%s\n", rec); }
        else write(fd, rec, 16);
    }
    printf("Size: %ld bytes\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
