#include <stdio.h>

int adj[8][8];
int count[8];

void walk(int u, int d, int dist[]) {
    dist[u] = d;
    for (int i = 0; i < count[u]; i++) {
        int v = adj[u][i];
        if (dist[v] == -1) {
            walk(v, d + 1, dist);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }
    int s, t;
    scanf("%d %d", &s, &t);

    int dist[8];
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    walk(s, 0, dist);

    for (int v = 0; v < n; v++) {
        printf("%d: %d\n", v, dist[v]);
    }
    if (dist[t] == -1) {
        printf("No way from %d to %d\n", s, t);
    } else {
        printf("Fewest steps from %d to %d: %d\n", s, t, dist[t]);
    }
    return 0;
}
