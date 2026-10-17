#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the neighbours of vertex u.
int adj[MAX_N][MAX_N];
int count[MAX_N];

int count_groups(void) {
    int groups = 0;
    for (int u = 0; u < n; u++) {
        int lower = 0;
        for (int i = 0; i < count[u]; i++) {
            if (adj[u][i] < u) {
                lower = 1;
            }
        }
        if (!lower) {
            groups++;
        }
    }
    return groups;
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }
    printf("%d\n", count_groups());
    return 0;
}
