#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the neighbours of vertex u.
int adj[MAX_N][MAX_N];
int count[MAX_N];

int parent[MAX_N];

int find(int v) {
    while (parent[v] != v) {
        parent[v] = parent[parent[v]];
        v = parent[v];
    }
    return v;
}

int count_groups(void) {
    for (int v = 0; v < n; v++) {
        parent[v] = v;
    }
    int groups = n;
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < count[u]; i++) {
            int a = find(u);
            int b = find(adj[u][i]);
            if (a != b) {
                parent[a] = b;
                groups--;
            }
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
