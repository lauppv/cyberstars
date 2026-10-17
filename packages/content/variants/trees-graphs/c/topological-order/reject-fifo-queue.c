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

    int order[8];
    int size = 0;
    for (int v = 0; v < n; v++) {
        if (indeg[v] == 0) {
            order[size] = v;
            size++;
        }
    }
    for (int head = 0; head < size; head++) {
        int u = order[head];
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            indeg[v]--;
            if (indeg[v] == 0) {
                order[size] = v;
                size++;
            }
        }
    }

    if (size == n) {
        printf("Order:");
        for (int i = 0; i < size; i++) {
            printf(" %d", order[i]);
        }
        printf("\n");
    } else {
        printf("No order, there is a cycle\n");
    }
    return 0;
}
