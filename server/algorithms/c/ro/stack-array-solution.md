```c
#include <stdio.h>
#include <string.h>

int main(void) {
    int m;
    scanf("%d", &m);

    // Reprezentam stiva ca un tablou + un index "varf" care spune ultima pozitie ocupata.
    // varf = -1 inseamna stiva goala.
    int stiva[100];
    int varf = -1;

    for (int i = 0; i < m; i++) {
        char comanda[10];
        scanf("%9s", comanda);

        if (strcmp(comanda, "pune") == 0) {
            int x;
            scanf("%d", &x);
            varf++;
            stiva[varf] = x;
        } else if (strcmp(comanda, "scoate") == 0) {
            if (varf == -1) {
                printf("Goala\n");
            } else {
                printf("%d\n", stiva[varf]);
                varf--;
            }
        } else if (strcmp(comanda, "varf") == 0) {
            if (varf == -1) {
                printf("Goala\n");
            } else {
                printf("%d\n", stiva[varf]);
            }
        }
    }

    return 0;
}
```
