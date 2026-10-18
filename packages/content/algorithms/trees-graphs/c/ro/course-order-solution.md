```c
#include <stdbool.h>

int ordine_cursuri(int ordine[]) {
    int grad[MAX_N] = {0};
    bool facut[MAX_N] = {false};
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < numar[u]; i++) {
            grad[vecini[u][i]]++;
        }
    }
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && grad[v] == 0) {
                u = v;
                break;
            }
        }
        if (u == -1) {
            return 0;
        }
        facut[u] = true;
        ordine[pas] = u;
        for (int i = 0; i < numar[u]; i++) {
            grad[vecini[u][i]]--;
        }
    }
    return n;
}
```
