#include <stdbool.h>

int signal_time(int s) {
    int dist[MAX_N];
    bool done[MAX_N] = {false};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    int slowest = 0;
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
        done[u] = true;
        slowest = dist[u];
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            int w = weight[u][i];
            if (dist[v] == -1 || dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return slowest;
}
