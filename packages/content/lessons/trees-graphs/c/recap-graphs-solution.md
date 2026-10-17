```c
#include <stdio.h>

int adj[8][8];
int weight[8][8];
int count[8];
int piece[8];

void dfs(int u, int p) {
    piece[u] = p;
    for (int i = 0; i < count[u]; i++) {
        int v = adj[u][i];
        if (piece[v] == 0) {
            dfs(v, p);
        }
    }
}

void print_line(const char *label, int values[], int n) {
    printf("%s", label);
    for (int v = 0; v < n; v++) {
        printf(" %d", values[v]);
    }
    printf("\n");
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        adj[u][count[u]] = v;
        weight[u][count[u]] = w;
        count[u]++;
        adj[v][count[v]] = u;
        weight[v][count[v]] = w;
        count[v]++;
    }
    int s;
    scanf("%d", &s);

    int pieces = 0;
    for (int v = 0; v < n; v++) {
        if (piece[v] == 0) {
            pieces++;
            dfs(v, pieces);
        }
    }

    int steps[8];
    for (int v = 0; v < n; v++) {
        steps[v] = -1;
    }
    steps[s] = 0;
    int queue[8];
    int head = 0;
    int tail = 0;
    queue[tail] = s;
    tail++;
    while (head < tail) {
        int u = queue[head];
        head++;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            if (steps[v] == -1) {
                steps[v] = steps[u] + 1;
                queue[tail] = v;
                tail++;
            }
        }
    }

    int dist[8];
    int done[8] = {0};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[s] = 0;
    for (int step = 0; step < n; step++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = 1;
        for (int i = 0; i < count[u]; i++) {
            int v = adj[u][i];
            int w = weight[u][i];
            if (dist[v] == -1 || dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    printf("Pieces: %d\n", pieces);
    print_line("Steps:", steps, n);
    print_line("Distances:", dist, n);
    return 0;
}
```
