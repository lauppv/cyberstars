```c
#include <stdio.h>

int vecini[8][8];
int numar[8];
int bucata[8];

void dfs(int u, int b) {
    bucata[u] = b;
    for (int i = 0; i < numar[u]; i++) {
        int v = vecini[u][i];
        if (bucata[v] == 0) {
            dfs(v, b);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    int bucati = 0;
    for (int v = 0; v < n; v++) {
        if (bucata[v] == 0) {
            bucati++;
            dfs(v, bucati);
        }
    }

    printf("Bucati: %d\n", bucati);
    for (int b = 1; b <= bucati; b++) {
        printf("Bucata %d:", b);
        for (int v = 0; v < n; v++) {
            if (bucata[v] == b) {
                printf(" %d", v);
            }
        }
        printf("\n");
    }
    return 0;
}
```
