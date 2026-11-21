```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[64];
    char nume[32];
    int minute;
    int lucrari = 0;
    int total = 0;

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        if (sscanf(linie, "%31s %d", nume, &minute) == 2) {
            lucrari++;
            total = total + minute;
        } else {
            printf("Cartela gresita: %s\n", linie);
        }
    }

    printf("Lucrari: %d\n", lucrari);
    printf("Minute: %d\n", total);
    return 0;
}
```
