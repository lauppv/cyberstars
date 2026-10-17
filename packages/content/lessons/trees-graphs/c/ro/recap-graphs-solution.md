```c
#include <stdio.h>

int vecini[8][8];
int costuri[8][8];
int numar[8];
int bucata[8];

void dfs(int u, int b) {
    bucata[u] = b;
    for (int i = 0; i < numar[u]; i++) {
        int v = vecini[u][i];
        if (bucata[v] == 0) {
            dfs(v, b);
        }
    }
}

void afiseaza_linie(const char *eticheta, int valori[], int n) {
    printf("%s", eticheta);
    for (int v = 0; v < n; v++) {
        printf(" %d", valori[v]);
    }
    printf("\n");
}

int main(void) {
    int n, m;
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

    int bucati = 0;
    for (int v = 0; v < n; v++) {
        if (bucata[v] == 0) {
            bucati++;
            dfs(v, bucati);
        }
    }

    int pasi[8];
    for (int v = 0; v < n; v++) {
        pasi[v] = -1;
    }
    pasi[s] = 0;
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
            if (pasi[v] == -1) {
                pasi[v] = pasi[u] + 1;
                coada[sfarsit] = v;
                sfarsit++;
            }
        }
    }

    int dist[8];
    int facut[8] = {0};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        facut[u] = 1;
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            int cost = costuri[u][i];
            if (dist[v] == -1 || dist[u] + cost < dist[v]) {
                dist[v] = dist[u] + cost;
            }
        }
    }

    printf("Bucati: %d\n", bucati);
    afiseaza_linie("Pasi:", pasi, n);
    afiseaza_linie("Distante:", dist, n);
    return 0;
}
```
