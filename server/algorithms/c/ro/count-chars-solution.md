```c
#include <stdio.h>

int main(void) {
    char cuvant[1001];
    char caracter;

    scanf("%1000s", cuvant);
    scanf(" %c", &caracter);

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
