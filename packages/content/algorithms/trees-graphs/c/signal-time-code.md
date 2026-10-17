#include <stdio.h>

#define MAX_N 500

int n, m;
// The cables at u go to adj[u][i] and take weight[u][i] minutes, for i from 0 to count[u] - 1.
int adj[MAX_N][MAX_N];
int weight[MAX_N][MAX_N];
int count[MAX_N];

int signal_time(int s) {
    // Write your code here
    return -1;
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
