```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[128];
    int linii = 0;
    int goale = 0;

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        linii++;
        if (strlen(linie) == 0) {
            goale++;
            continue;
        }
        printf("%d: %s\n", linii, linie);
    }

    printf("Linii: %d\n", linii);
    printf("Goale: %d\n", goale);
    return 0;
}
```
