```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
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
    int numere[8];
    pid_t pids[8];
    int rezultate[8];

    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit(e_prim(numere[i]));
        }
    }

    for (int k = 0; k < n; k++) {
        int stare;
        pid_t gata = wait(&stare);
        for (int i = 0; i < n; i++) {
            if (pids[i] == gata) {
                rezultate[i] = WEXITSTATUS(stare);
            }
        }
    }

    int prime = 0;
    for (int i = 0; i < n; i++) {
        printf("%d: %s\n", numere[i], rezultate[i] ? "prim" : "nu e prim");
        prime = prime + rezultate[i];
    }
    printf("Prime: %d\n", prime);
    return 0;
}
```
