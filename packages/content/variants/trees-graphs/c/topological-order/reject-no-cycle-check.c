#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int adj[8][8];
    int count[8] = {0};
    int indeg[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        indeg[v]++;
    }

    int done[8] = {0};
    int order[8];
    int size = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && indeg[v] == 0) {
                u = v;
                break;
            }
        }
        done[u] = 1;
        order[size] = u;
        size++;
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]--;
        }
    }

    {
        printf("Order:");
        for (int i = 0; i < size; i++) {
            printf(" %d", order[i]);
        }
        printf("\n");
    }
    return 0;
}
