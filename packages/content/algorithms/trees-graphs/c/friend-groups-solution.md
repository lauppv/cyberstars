```c
#include <stdbool.h>

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
```
