#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int weight[8][8];
    int count[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        adj[u][count[u]] = v;
        weight[u][count[u]] = w;
        count[u]++;
    }
    int s;
    scanf("%d", &s);

    int dist[8];
    int done[8] = {0};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = 1;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            int w = weight[u][i];
            if (dist[v] == -1 || dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d: %d\n", v, dist[v]);
    }
    return 0;
}
