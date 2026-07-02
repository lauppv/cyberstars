```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("tura.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "Enescu 95\n");
    fprintf(f, "Vlad 82\n");
    fprintf(f, "Dobre 98\n");
    fclose(f);

    f = fopen("tura.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char nume[50];
    int incidente;
    while (fscanf(f, "%s %d", nume, &incidente) == 2) {
        printf("Tehnician: %s, Incidente: %d\n", nume, incidente);
    }
    fclose(f);

    return 0;
}
```
