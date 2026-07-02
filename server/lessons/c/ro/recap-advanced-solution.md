```c
#include <stdio.h>

#define PERM_READ    (1 << 0)
#define PERM_WRITE   (1 << 1)
#define PERM_EXECUTE (1 << 2)

void afiseaza_permisiuni(const char *nume, int permisiuni) {
    printf("%s:", nume);
    if (permisiuni & PERM_READ) {
        printf(" READ");
    }
    if (permisiuni & PERM_WRITE) {
        printf(" WRITE");
    }
    if (permisiuni & PERM_EXECUTE) {
        printf(" EXECUTE");
    }
    printf("\n");
}

int main(void) {
    char nume[50];
    int permisiuni;

    FILE *f = fopen("config.txt", "w");
    if (f == NULL) {
        return 1;
    }
    while (scanf("%s %d", nume, &permisiuni) == 2) {
        fprintf(f, "%s %d\n", nume, permisiuni);
    }
    fclose(f);

    f = fopen("config.txt", "r");
    if (f == NULL) {
        return 1;
    }
    while (fscanf(f, "%s %d", nume, &permisiuni) == 2) {
        afiseaza_permisiuni(nume, permisiuni);
    }
    fclose(f);

    return 0;
}
```
