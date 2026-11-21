```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[128];
    char cel_mai_lung[128] = "";
    int numar = 0;

    fgets(linie, sizeof(linie), stdin);
    linie[strcspn(linie, "\n")] = '\0';

    char *cuvant = strtok(linie, " ,");
    while (cuvant != NULL) {
        printf("%s (%d)\n", cuvant, (int)strlen(cuvant));
        numar++;
        if (strlen(cuvant) > strlen(cel_mai_lung)) {
            strcpy(cel_mai_lung, cuvant);
        }
        cuvant = strtok(NULL, " ,");
    }

    printf("Cuvinte: %d\n", numar);
    printf("Cel mai lung: %s\n", cel_mai_lung);
    return 0;
}
```
