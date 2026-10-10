```c
#include <stdio.h>

int main(void) {
    char cuvant[100001];
    char caracter;

    // %100000s limiteaza citirea la 100000 de caractere ca sa nu depasim buffer-ul.
    scanf("%100000s", cuvant);
    // Spatiul din " %c" spune scanf sa sara peste orice whitespace (inclusiv \n).
    scanf(" %c", &caracter);

    // Parcurgem cuvantul caracter cu caracter pana la terminatorul '\0'.
    int numar = 0;
    for (int i = 0; cuvant[i] != '\0'; i++) {
        if (cuvant[i] == caracter) {
            numar++;
        }
    }

    printf("%d\n", numar);
    return 0;
}
```
