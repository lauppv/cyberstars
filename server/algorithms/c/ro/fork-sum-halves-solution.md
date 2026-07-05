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

    int p[2];
    pipe(p);

    // Impartim vectorul: primele n/2 elemente merg la copil, restul la parinte.
    int mij = n / 2;

    pid_t pid = fork();
    if (pid == 0) {
        // Copil: suma primei jumatati.
        close(p[0]);
        int suma1 = 0;
        for (int i = 0; i < mij; i++) {
            suma1 += numere[i];
        }
        write(p[1], &suma1, sizeof(int));
        close(p[1]);
        return 0;
    }

    // Parinte: suma jumatatii a doua, in paralel cu copilul.
    close(p[1]);
    int suma2 = 0;
    for (int i = mij; i < n; i++) {
        suma2 += numere[i];
    }

    // Asteptam copilul si citim partea lui de suma.
    wait(NULL);
    int suma1;
    read(p[0], &suma1, sizeof(int));
    close(p[0]);

    printf("Suma: %d\n", suma1 + suma2);
    return 0;
}
```
