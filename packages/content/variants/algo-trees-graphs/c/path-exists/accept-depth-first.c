bool seen[MAX_N];

void visit(int u) {
    seen[u] = true;
    for (int i = 0; i < count[u]; i++) {
        if (!seen[adj[u][i]]) {
            visit(adj[u][i]);
        }
    }
}

bool path_exists(int s, int t) {
    visit(s);
    return seen[t];
}
