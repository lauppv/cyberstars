#include <stdio.h>

#define MAX_N 500

int n, m;
// vecini[u][0], ..., vecini[u][numar[u] - 1] sunt vecinii nodului u.
int vecini[MAX_N][MAX_N];
int numar[MAX_N];

int numara_grupuri(void) {
    // Scrie codul tau aici
    return 0;
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
