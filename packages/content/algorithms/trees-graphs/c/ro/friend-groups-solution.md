```c
#include <stdbool.h>

int numara_grupuri(void) {
    bool vazut[MAX_N] = {false};
    int stiva[MAX_N];
    int grupuri = 0;
    for (int start = 0; start < n; start++) {
        if (vazut[start]) {
            continue;
        }
        grupuri++;
        int varf = 0;
        vazut[start] = true;
        stiva[varf++] = start;
        while (varf > 0) {
            int u = stiva[--varf];
            for (int i = 0; i < numar[u]; i++) {
                int v = vecini[u][i];
                if (!vazut[v]) {
                    vazut[v] = true;
                    stiva[varf++] = v;
                }
            }
        }
    }
    return grupuri;
}
```
