```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#define SIZE 16

int main(void) {
    int n;
    scanf("%d", &n);

    int fd = open("drum.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        char rec[SIZE] = { 0 };
        scanf("%15s", rec);
        write(fd, rec, SIZE);
    }

    char command[8];
    int i;
    while (scanf("%7s %d", command, &i) == 2) {
        char rec[SIZE] = { 0 };
        if (strcmp(command, "set") == 0) {
            scanf("%15s", rec);
        }
        if (i >= n) {
            printf("No record %d\n", i);
            continue;
        }
        lseek(fd, (off_t)i * SIZE, SEEK_SET);
        if (strcmp(command, "get") == 0) {
            read(fd, rec, SIZE);
            printf("%s\n", rec);
        } else {
            write(fd, rec, SIZE);
        }
    }

    printf("Size: %ld bytes\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
```
