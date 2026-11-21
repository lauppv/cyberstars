```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#define MARIME 16

int main(void) {
    int n;
    scanf("%d", &n);

    int fd = open("drum.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        char rec[MARIME] = { 0 };
        scanf("%15s", rec);
        write(fd, rec, MARIME);
    }

    char comanda[8];
    int i;
    while (scanf("%7s %d", comanda, &i) == 2) {
        char rec[MARIME] = { 0 };
        if (strcmp(comanda, "set") == 0) {
            scanf("%15s", rec);
        }
        if (i >= n) {
            printf("Nu exista %d\n", i);
            continue;
        }
        lseek(fd, (off_t)i * MARIME, SEEK_SET);
        if (strcmp(comanda, "get") == 0) {
            read(fd, rec, MARIME);
            printf("%s\n", rec);
        } else {
            write(fd, rec, MARIME);
        }
    }

    printf("Marime: %ld bytes\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
```
