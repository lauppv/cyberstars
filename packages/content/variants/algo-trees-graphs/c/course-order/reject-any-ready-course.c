#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the courses that need u first.
int adj[MAX_N][MAX_N];
int count[MAX_N];

int course_order(int order[]) {
    int indeg[MAX_N] = {0};
    int queue[MAX_N];
    int head = 0;
    int tail = 0;
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < count[u]; i++) {
            indeg[adj[u][i]]++;
        }
    }
    for (int v = 0; v < n; v++) {
        if (indeg[v] == 0) {
            queue[tail++] = v;
        }
    }
    while (head < tail) {
        int u = queue[head++];
        order[head - 1] = u;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            indeg[v]--;
            if (indeg[v] == 0) {
                queue[tail++] = v;
            }
        }
    }
    if (tail < n) {
        return 0;
    }
    return n;
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
    }
    int order[MAX_N];
    int size = course_order(order);
    if (size == 0) {
        printf("-1\n");
        return 0;
    }
    for (int i = 0; i < size; i++) {
        if (i > 0) {
            printf(" ");
        }
        printf("%d", order[i]);
    }
    printf("\n");
    return 0;
}
