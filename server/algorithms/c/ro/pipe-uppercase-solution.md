```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char cuvant[128];
    scanf("%127s", cuvant);

    // Cream un pipe: p[0] e capatul de citire, p[1] e capatul de scriere.
    int p[2];
    pipe(p);

    pid_t pid = fork();
    if (pid == 0) {
        // Copil: inchidem capatul de scriere (nu-l folosim).
        close(p[1]);
        char tampon[128];
        int n = read(p[0], tampon, sizeof(tampon) - 1);
        tampon[n] = '\0';
        // Convertim fiecare litera la uppercase.
        for (int i = 0; tampon[i]; i++) {
            tampon[i] = toupper((unsigned char)tampon[i]);
        }
        printf("%s\n", tampon);
        close(p[0]);
    } else {
        // Parinte: inchidem capatul de citire, trimitem cuvantul prin pipe,
        // apoi inchidem capatul de scriere ca sa semnalam sfarsitul fluxului.
        close(p[0]);
        write(p[1], cuvant, strlen(cuvant));
        close(p[1]);
        wait(NULL);
    }

    return 0;
}
```
