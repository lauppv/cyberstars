```c
#include <stdio.h>
#include <string.h>

int main(void) {
    int m;
    scanf("%d", &m);

    int stiva[100];
    int varf = -1;

    for (int i = 0; i < m; i++) {
        char comanda[10];
        scanf("%9s", comanda);

        if (strcmp(comanda, "push") == 0) {
            int x;
            scanf("%d", &x);
            stiva[++varf] = x;
        } else if (strcmp(comanda, "pop") == 0) {
            if (varf == -1) {
                printf("Goala\n");
            } else {
                printf("%d\n", stiva[varf--]);
            }
        } else if (strcmp(comanda, "peek") == 0) {
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
