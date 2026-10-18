int count_groups(void) {
    int groups = 0;
    for (int u = 0; u < n; u++) {
        int lower = 0;
        for (int i = 0; i < count[u]; i++) {
            if (adj[u][i] < u) {
                lower = 1;
            }
        }
        if (!lower) {
            groups++;
        }
    }
    return groups;
}
