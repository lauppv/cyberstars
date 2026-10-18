int course_order(int order[]) {
    int indeg[MAX_N] = {0};
    int ready[MAX_N];
    int size = 0;
    int placed = 0;
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]++;
        }
    }
    for (int v = n - 1; v >= 0; v--) {
        if (indeg[v] == 0) {
            ready[size++] = v;
        }
    }
    while (size > 0) {
        int u = ready[--size];
        order[placed++] = u;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            indeg[v]--;
            if (indeg[v] == 0) {
                int j = size++;
                while (j > 0 && ready[j - 1] < v) {
                    ready[j] = ready[j - 1];
                    j--;
                }
                ready[j] = v;
            }
        }
    }
    if (placed < n) {
        return 0;
    }
    return placed;
}
