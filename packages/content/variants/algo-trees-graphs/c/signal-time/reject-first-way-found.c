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
