```c
#include <stdio.h>

int ia_bon(char ghiseu) {
    static int rulari = 0;
    static int listari = 0;
    if (ghiseu == 'R') {
        rulari++;
        return rulari;
    }
    listari++;
    return listari;
}

int main(void) {
    char linie[64];
    scanf("%s", linie);

    for (int i = 0; linie[i] != '\0'; i++) {
        printf("%c%d\n", linie[i], ia_bon(linie[i]));
    }
    return 0;
}
```
