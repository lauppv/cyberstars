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
