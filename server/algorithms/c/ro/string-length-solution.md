```c
#include <stdio.h>

int main(void) {
    char cuvant[1001];
    scanf("%1000s", cuvant);

    // In C, un sir se termina cu caracterul '\0'. Numaram cate caractere sunt
    // pana ajungem la el.
    int lungime = 0;
    while (cuvant[lungime] != '\0') {
        lungime++;
    }

    printf("%d\n", lungime);
    return 0;
}
```
