```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char comanda[16];
    char nume[64];
    int esuate = 0;

    while (scanf("%15s %63s", comanda, nume) == 2) {
        int rezultat = -1;
        if (strcmp(comanda, "create") == 0) {
            rezultat = open(nume, O_WRONLY | O_CREAT | O_EXCL, 0644);
            if (rezultat != -1) {
                close(rezultat);
            }
        } else if (strcmp(comanda, "open") == 0) {
            rezultat = open(nume, O_RDONLY);
            if (rezultat != -1) {
                close(rezultat);
            }
        } else if (strcmp(comanda, "remove") == 0) {
            rezultat = unlink(nume);
        }

        if (rezultat == -1) {
            printf("%s %s: %s\n", comanda, nume, strerror(errno));
            esuate++;
        } else {
            printf("%s %s: ok\n", comanda, nume);
        }
    }

    printf("Esuate: %d\n", esuate);
    return 0;
}
```
