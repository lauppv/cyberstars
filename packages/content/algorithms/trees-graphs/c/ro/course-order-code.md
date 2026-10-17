#include <stdio.h>

#define MAX_N 500

int n, m;
// vecini[u][0], ..., vecini[u][numar[u] - 1] sunt cursurile care au nevoie intai de u.
int vecini[MAX_N][MAX_N];
int numar[MAX_N];

int ordine_cursuri(int ordine[]) {
    // Scrie codul tau aici
    return 0;
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
    }
    int ordine[MAX_N];
    int marime = ordine_cursuri(ordine);
    if (marime == 0) {
        printf("-1\n");
        return 0;
    }
    for (int i = 0; i < marime; i++) {
        if (i > 0) {
            printf(" ");
        }
        printf("%d", ordine[i]);
    }
    printf("\n");
    return 0;
}
