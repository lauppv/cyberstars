bool path_exists(int s, int t) {
    if (s == t) {
        return true;
    }
    for (int i = 0; i < count[s]; i++) {
        if (adj[s][i] == t) {
            return true;
        }
    }
    return false;
}
