#include <stdio.h>

#define MAX_N 500

int n, m;
// The cables at u go to adj[u][i] and take weight[u][i] minutes, for i from 0 to count[u] - 1.
int adj[MAX_N][MAX_N];
int weight[MAX_N][MAX_N];
int count[MAX_N];

int signal_time(int s) {
    int dist[MAX_N];
    int queue[MAX_N];
    int head = 0;
    int tail = 0;
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    queue[tail++] = s;
    while (head < tail) {
        int u = queue[head++];
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            if (dist[v] == -1) {
                dist[v] = dist[u] + weight[u][i];
                queue[tail++] = v;
            }
        }
    }
    int slowest = 0;
    for (int v = 0; v < n; v++) {
        if (dist[v] == -1) {
            return -1;
        }
        if (dist[v] > slowest) {
            slowest = dist[v];
        }
    }
    return slowest;
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        adj[u][count[u]] = v;
        weight[u][count[u]] = w;
        count[u]++;
        adj[v][count[v]] = u;
        weight[v][count[v]] = w;
        count[v]++;
    }
    int s;
    scanf("%d", &s);
    printf("%d\n", signal_time(s));
    return 0;
}
