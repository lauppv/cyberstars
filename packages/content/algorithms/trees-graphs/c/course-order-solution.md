```c
#include <stdbool.h>

int course_order(int order[]) {
    int indeg[MAX_N] = {0};
    bool done[MAX_N] = {false};
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]++;
        }
    }
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && indeg[v] == 0) {
                u = v;
                break;
            }
        }
        if (u == -1) {
            return 0;
        }
        done[u] = true;
        order[step] = u;
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]--;
        }
    }
    return n;
}
```
