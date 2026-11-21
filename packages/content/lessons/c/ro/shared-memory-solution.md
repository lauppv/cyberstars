```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int e_prim(int x) {
    if (x < 2) {
        return 0;
    }
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int n;
    int limite[8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &limite[i]);
    }

    long *numere = mmap(NULL, n * sizeof(long), PROT_READ | PROT_WRITE,
                        MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (numere == MAP_FAILED) {
        return 1;
    }

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            long numar = 0;
            for (int x = 2; x <= limite[i]; x++) {
                numar = numar + e_prim(x);
            }
            numere[i] = numar;
            _exit(0);
        }
    }

    while (wait(NULL) > 0) {
    }

    long total = 0;
    for (int i = 0; i < n; i++) {
        printf("pana la %d: %ld\n", limite[i], numere[i]);
        total = total + numere[i];
    }
    printf("Total: %ld\n", total);

    munmap(numere, n * sizeof(long));
    return 0;
}
```
