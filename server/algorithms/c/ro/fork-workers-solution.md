```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Fork intr-o bucla: fiecare iteratie creeaza un copil nou.
    // Copilul iese imediat dupa printf, altfel ar continua bucla si ar
    // crea si el forkuri (numarul de procese ar creste exponential).
    for (int i = 1; i <= n; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            printf("Copil %d gata\n", i);
            return 0;
        }
    }

    // Asteptam pe toti n copiii, unul cate unul.
    for (int i = 0; i < n; i++) {
        wait(NULL);
    }

    printf("Toti copiii au terminat\n");
    return 0;
}
```
