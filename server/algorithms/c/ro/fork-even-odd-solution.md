```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int numere[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }

    // Cream pipe-ul pentru a trimite numarul de pare de la copil la parinte.
    int p[2];
    pipe(p);

    pid_t pid = fork();
    if (pid == 0) {
        // Copil: numaram parele si trimitem rezultatul prin pipe.
        close(p[0]);
        int pare = 0;
        for (int i = 0; i < n; i++) {
            if (numere[i] % 2 == 0) {
                pare++;
            }
        }
        write(p[1], &pare, sizeof(int));
        close(p[1]);
        return 0;
    }

    // Parinte: numaram imparele in paralel cu copilul.
    close(p[1]);
    int impare = 0;
    for (int i = 0; i < n; i++) {
        if (numere[i] % 2 != 0) {
            impare++;
        }
    }

    // Asteptam copilul si citim numarul de pare din pipe.
    wait(NULL);
    int pare;
    read(p[0], &pare, sizeof(int));
    close(p[0]);

    printf("Pare: %d\n", pare);
    printf("Impare: %d\n", impare);
    return 0;
}
```
