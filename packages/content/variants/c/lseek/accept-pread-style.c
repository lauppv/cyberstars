#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

enum { REC = 16 };

int main(void) {
    int n, i;
    char cmd[16], rec[REC];
    if (scanf("%d", &n) != 1) return 0;
    int fd = open("drum.dat", O_CREAT | O_TRUNC | O_RDWR, 0644);
    for (int k = 0; k < n; k++) {
        memset(rec, 0, REC);
        scanf("%15s", rec);
        write(fd, rec, REC);
    }
    while (scanf("%15s %d", cmd, &i) == 2) {
        int set = cmd[0] == 's';
        memset(rec, 0, REC);
        if (set) scanf("%15s", rec);
        if (i < 0 || i >= n) { printf("No record %d\n", i); continue; }
        lseek(fd, i * REC, SEEK_SET);
        if (set) write(fd, rec, REC);
        else { read(fd, rec, REC); puts(rec); }
    }
    off_t end = lseek(fd, 0, SEEK_END);
    printf("Size: %ld bytes\n", (long)end);
    close(fd);
    return 0;
}
