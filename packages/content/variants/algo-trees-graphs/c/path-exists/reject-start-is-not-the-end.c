bool path_exists(int s, int t) {
    bool seen[MAX_N] = {false};
    int queue[MAX_N];
    int head = 0;
    int tail = 0;
    seen[s] = true;
    queue[tail++] = s;
    while (head < tail) {
        int u = queue[head++];
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            if (v == t) {
                return true;
            }
            if (!seen[v]) {
                seen[v] = true;
                queue[tail++] = v;
            }
        }
    }
    return false;
}
