```c
#include <stdbool.h>
#include <stdio.h>

#define MAX_N 500

int n, m;
// Cablurile din u merg la vecini[u][i] si dureaza costuri[u][i] minute, pentru i de la 0 la numar[u] - 1.
int vecini[MAX_N][MAX_N];
int costuri[MAX_N][MAX_N];
int numar[MAX_N];

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

int main(void) {
    scanf("%d %d", &n, &m);
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
    printf("%d\n", timp_semnal(s));
    return 0;
}
```
