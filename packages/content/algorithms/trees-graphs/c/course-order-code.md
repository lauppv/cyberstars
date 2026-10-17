#include <stdio.h>

#define MAX_N 500

int n, m;
// adj[u][0], ..., adj[u][count[u] - 1] are the courses that need u first.
int adj[MAX_N][MAX_N];
int count[MAX_N];

int course_order(int order[]) {
    // Write your code here
    return 0;
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
