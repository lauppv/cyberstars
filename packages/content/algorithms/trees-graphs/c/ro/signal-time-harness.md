```c
#include <stdio.h>

#define MAX_N 500

int n, m;
// Cablurile din u merg la vecini[u][i] si dureaza costuri[u][i] minute, pentru i de la 0 la numar[u] - 1.
int vecini[MAX_N][MAX_N];
int costuri[MAX_N][MAX_N];
int numar[MAX_N];

#line 1 "main.c"
{{code: timp_semnal}}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v, cost;
        scanf("%d %d %d", &u, &v, &cost);
        vecini[u][numar[u]] = v;
        costuri[u][numar[u]] = cost;
        numar[u]++;
        vecini[v][numar[v]] = u;
        costuri[v][numar[v]] = cost;
        numar[v]++;
    }
    int s;
    scanf("%d", &s);
    printf("%d\n", timp_semnal(s));
    return 0;
}
```
