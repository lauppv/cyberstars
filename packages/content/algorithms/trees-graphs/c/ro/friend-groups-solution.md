```c
#include <stdbool.h>
#include <stdio.h>

#define MAX_N 500

int n, m;
// vecini[u][0], ..., vecini[u][numar[u] - 1] sunt vecinii nodului u.
int vecini[MAX_N][MAX_N];
int numar[MAX_N];

int numara_grupuri(void) {
    bool vazut[MAX_N] = {false};
    int stiva[MAX_N];
    int grupuri = 0;
    for (int start = 0; start < n; start++) {
        if (vazut[start]) {
            continue;
        }
        grupuri++;
        int varf = 0;
        vazut[start] = true;
        stiva[varf++] = start;
        while (varf > 0) {
            int u = stiva[--varf];
            for (int i = 0; i < numar[u]; i++) {
                int v = vecini[u][i];
                if (!vazut[v]) {
                    vazut[v] = true;
                    stiva[varf++] = v;
                }
            }
        }
    }
    return grupuri;
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }
    printf("%d\n", numara_grupuri());
    return 0;
}
```
