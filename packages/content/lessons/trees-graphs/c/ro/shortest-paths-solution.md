```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int vecini[8][8];
    int costuri[8][8];
    int numar[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v, cost;
        scanf("%d %d %d", &u, &v, &cost);
        vecini[u][numar[u]] = v;
        costuri[u][numar[u]] = cost;
        numar[u]++;
        vecini[v][numar[v]] = u;
        costuri[v][numar[v]] = cost;
        numar[v]++;
    }
    int s;
    scanf("%d", &s);

    int distanta[8];
    int facut[8] = {0};
    for (int v = 0; v < n; v++) {
        distanta[v] = -1;
    }
    distanta[s] = 0;
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && distanta[v] != -1 && (u == -1 || distanta[v] < distanta[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        facut[u] = 1;
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            int cost = costuri[u][i];
            if (distanta[v] == -1 || distanta[u] + cost < distanta[v]) {
                distanta[v] = distanta[u] + cost;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d: %d\n", v, distanta[v]);
    }
    return 0;
}
```
