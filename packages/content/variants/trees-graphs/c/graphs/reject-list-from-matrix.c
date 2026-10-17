#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int matrix[8][8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        matrix[u][v] = 1;
        matrix[v][u] = 1;
    }

    printf("Matrix:\n");
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            printf("%d ", matrix[u][v]);
        }
        printf("\n");
    }

    printf("List:\n");
    for (int u = 0; u < n; u++) {
        printf("%d:", u);
        for (int v = 0; v < n; v++) {
            if (matrix[u][v] == 1) {
                printf(" %d", v);
            }
        }
        printf("\n");
    }
    return 0;
}
