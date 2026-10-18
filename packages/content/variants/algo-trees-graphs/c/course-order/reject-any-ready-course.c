int course_order(int order[]) {
    int indeg[MAX_N] = {0};
    int queue[MAX_N];
    int head = 0;
    int tail = 0;
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]++;
        }
    }
    for (int v = 0; v < n; v++) {
        if (indeg[v] == 0) {
            queue[tail++] = v;
        }
    }
    while (head < tail) {
        int u = queue[head++];
        order[head - 1] = u;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            indeg[v]--;
            if (indeg[v] == 0) {
                queue[tail++] = v;
            }
        }
    }
    if (tail < n) {
        return 0;
    }
    return n;
}
