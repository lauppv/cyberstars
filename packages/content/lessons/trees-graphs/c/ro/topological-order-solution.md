```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int vecini[8][8];
    int numar[8] = {0};
    int grad[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        grad[v]++;
    }

    int facut[8] = {0};
    int ordine[8];
    int marime = 0;
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && grad[v] == 0) {
                u = v;
                break;
            }
        }
        if (u == -1) {
            break;
        }
        facut[u] = 1;
        ordine[marime] = u;
        marime++;
        for (int i = 0; i < numar[u]; i++) {
            grad[vecini[u][i]]--;
        }
    }

    if (marime == n) {
        printf("Ordine:");
        for (int i = 0; i < marime; i++) {
            printf(" %d", ordine[i]);
        }
        printf("\n");
    } else {
        printf("Nicio ordine, exista un ciclu\n");
    }
    return 0;
}
```
