#include <stdbool.h>
#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the neighbours of vertex u.
int adj[MAX_N][MAX_N];
int count[MAX_N];

bool path_exists(int s, int t) {
    // Write your code here
    return false;
}

int main(void) {
    scanf("%d %d", &n, &m);
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
    printf("%s\n", path_exists(s, t) ? "true" : "false");
    return 0;
}
