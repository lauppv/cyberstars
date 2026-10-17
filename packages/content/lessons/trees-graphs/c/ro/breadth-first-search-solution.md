```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int vecini[8][8];
    int numar[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }
    int s, t;
    scanf("%d %d", &s, &t);

    int distanta[8];
    for (int v = 0; v < n; v++) {
        distanta[v] = -1;
    }
    distanta[s] = 0;
    int coada[8];
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit] = s;
    sfarsit++;
    while (inceput < sfarsit) {
        int u = coada[inceput];
        inceput++;
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            if (distanta[v] == -1) {
                distanta[v] = distanta[u] + 1;
                coada[sfarsit] = v;
                sfarsit++;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d: %d\n", v, distanta[v]);
    }
    if (distanta[t] == -1) {
        printf("Niciun drum de la %d la %d\n", s, t);
    } else {
        printf("Cei mai putini pasi de la %d la %d: %d\n", s, t, distanta[t]);
    }
    return 0;
}
```
