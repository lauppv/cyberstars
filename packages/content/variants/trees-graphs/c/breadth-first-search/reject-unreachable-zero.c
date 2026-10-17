#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int count[8] = {0};
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
        dist[v] = 0;
    }
    int seen[8] = {0};
    seen[s] = 1;
    dist[s] = 0;
    int queue[8];
    int head = 0;
    int tail = 0;
    queue[tail] = s;
    tail++;
    while (head < tail) {
        int u = queue[head];
        head++;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            if (!seen[v]) {
                seen[v] = 1;
                dist[v] = dist[u] + 1;
                queue[tail] = v;
                tail++;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d: %d\n", v, dist[v]);
    }
    printf("Fewest steps from %d to %d: %d\n", s, t, dist[t]);
    return 0;
}
