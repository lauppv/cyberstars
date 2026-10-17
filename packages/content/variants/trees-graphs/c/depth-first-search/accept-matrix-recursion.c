#include <stdio.h>

int size;
int joined[8][8];
int group[8];

void mark(int v, int id) {
    group[v] = id;
    for (int w = 0; w < size; w++)
        if (joined[v][w] && !group[w]) mark(w, id);
}

int main(void) {
    int edges;
    scanf("%d %d", &size, &edges);
    while (edges--) {
        int a, b;
        scanf("%d %d", &a, &b);
        joined[a][b] = joined[b][a] = 1;
    }
    int groups = 0;
    for (int v = 0; v < size; v++)
        if (!group[v]) mark(v, ++groups);
    printf("Pieces: %d\n", groups);
    for (int id = 1; id <= groups; id++) {
        printf("Piece %d:", id);
        for (int v = 0; v < size; v++)
            if (group[v] == id) printf(" %d", v);
        printf("\n");
    }
    return 0;
}
