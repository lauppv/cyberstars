```c
#include <stdbool.h>
#include <stdio.h>

#define MAX_N 500

int n, m;
// vecini[u][0], ..., vecini[u][numar[u] - 1] sunt vecinii nodului u.
int vecini[MAX_N][MAX_N];
int numar[MAX_N];

bool exista_drum(int s, int t) {
    bool vazut[MAX_N] = {false};
    int coada[MAX_N];
    int inceput = 0;
    int sfarsit = 0;
    vazut[s] = true;
    coada[sfarsit++] = s;
    while (inceput < sfarsit) {
        int u = coada[inceput++];
        if (u == t) {
            return true;
        }
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            if (!vazut[v]) {
                vazut[v] = true;
                coada[sfarsit++] = v;
            }
        }
    }
    return false;
}

int main(void) {
    scanf("%d %d", &n, &m);
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
    printf("%s\n", exista_drum(s, t) ? "true" : "false");
    return 0;
}
```
