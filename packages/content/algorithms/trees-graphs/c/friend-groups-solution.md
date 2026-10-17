```c
#include <stdbool.h>
#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the neighbours of vertex u.
int adj[MAX_N][MAX_N];
int count[MAX_N];

int count_groups(void) {
    bool seen[MAX_N] = {false};
    int stack[MAX_N];
    int groups = 0;
    for (int start = 0; start < n; start++) {
        if (seen[start]) {
            continue;
        }
        groups++;
        int top = 0;
        seen[start] = true;
        stack[top++] = start;
        while (top > 0) {
            int u = stack[--top];
            for (int i = 0; i < count[u]; i++) {
                int v = adj[u][i];
                if (!seen[v]) {
                    seen[v] = true;
                    stack[top++] = v;
                }
            }
        }
    }
    return groups;
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
    printf("%d\n", count_groups());
    return 0;
}
```
