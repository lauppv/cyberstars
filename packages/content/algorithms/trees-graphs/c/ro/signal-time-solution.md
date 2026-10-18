```c
#include <stdbool.h>

int timp_semnal(int s) {
    int distanta[MAX_N];
    bool facut[MAX_N] = {false};
    for (int v = 0; v < n; v++) {
        distanta[v] = -1;
    }
    distanta[s] = 0;
    int cel_mai_lent = 0;
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && distanta[v] != -1 && (u == -1 || distanta[v] < distanta[u])) {
                u = v;
            }
        }
        if (u == -1) {
            return -1;
        }
        facut[u] = true;
        cel_mai_lent = distanta[u];
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            int cost = costuri[u][i];
            if (distanta[v] == -1 || distanta[u] + cost < distanta[v]) {
                distanta[v] = distanta[u] + cost;
            }
        }
    }
    return cel_mai_lent;
}
```
