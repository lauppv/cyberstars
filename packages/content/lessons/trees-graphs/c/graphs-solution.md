```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int matrix[8][8] = {0};
    int adj[8][8];
    int count[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        matrix[u][v] = 1;
        matrix[v][u] = 1;
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    printf("Matrix:\n");
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            printf("%d ", matrix[u][v]);
        }
        printf("\n");
    }

    printf("List:\n");
    for (int v = 0; v < n; v++) {
        printf("%d:", v);
        for (int i = 0; i < count[v]; i++) {
            printf(" %d", adj[v][i]);
        }
        printf("\n");
    }
    return 0;
}
```
