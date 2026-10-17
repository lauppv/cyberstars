#include <stdio.h>

int adj[8][8];
int count[8];
int piece[8];

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u][count[u]] = v;
        count[u]++;
        adj[v][count[v]] = u;
        count[v]++;
    }

    int pieces = 0;
    for (int v = 0; v < n; v++) {
        if (piece[v] == 0) {
            pieces++;
            piece[v] = pieces;
            int stack[64];
            int top = 0;
            stack[top++] = v;
            while (top > 0) {
                int u = stack[--top];
                for (int i = 0; i < count[u]; i++) {
                    int w = adj[u][i];
                    if (piece[w] == 0) {
                        piece[w] = pieces;
                        stack[top++] = w;
                    }
                }
            }
        }
    }

    printf("Pieces: %d\n", pieces);
    for (int p = 1; p <= pieces; p++) {
        printf("Piece %d:", p);
        for (int v = 0; v < n; v++) {
            if (piece[v] == p) {
                printf(" %d", v);
            }
        }
        printf("\n");
    }
    return 0;
}
