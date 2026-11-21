```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[128];
    fgets(linie, sizeof(linie), stdin);
    linie[strcspn(linie, "\n")] = '\0';

    int suma = 0;
    for (int i = 0; linie[i] != '\0'; i++) {
        if (linie[i] >= 'a' && linie[i] <= 'z') {
            linie[i] = linie[i] - ('a' - 'A');
        }
        if (linie[i] >= '0' && linie[i] <= '9') {
            suma = suma + (linie[i] - '0');
        }
    }

    printf("%s\n", linie);
    printf("Suma cifrelor: %d\n", suma);
    return 0;
}
```
