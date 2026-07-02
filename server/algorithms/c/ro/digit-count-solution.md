```c
#include <stdio.h>

int main(void) {
    long numar;
    scanf("%ld", &numar);

    int numarCifre = 0;
    if (numar == 0) {
        numarCifre = 1;
    } else {
        while (numar > 0) {
            numarCifre++;
            numar /= 10;
        }
    }

    printf("%d\n", numarCifre);
    return 0;
}
```
