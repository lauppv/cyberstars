```c
#include <stdio.h>

int main(void) {
    char cuvant[1001];
    scanf("%1000s", cuvant);

    int lungime = 0;
    while (cuvant[lungime] != '\0') {
        lungime++;
    }

    printf("%d\n", lungime);
    return 0;
}
```
