```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int matrice[8][8] = {0};
    int vecini[8][8];
    int numar[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        matrice[u][v] = 1;
        matrice[v][u] = 1;
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    printf("Matrice:\n");
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            printf("%d ", matrice[u][v]);
        }
        printf("\n");
    }

    printf("Lista:\n");
    for (int v = 0; v < n; v++) {
        printf("%d:", v);
        for (int i = 0; i < numar[v]; i++) {
            printf(" %d", vecini[v][i]);
        }
        printf("\n");
    }
    return 0;
}
```
