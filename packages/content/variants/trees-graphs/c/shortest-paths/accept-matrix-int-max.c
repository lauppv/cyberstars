#include <limits.h>
#include <stdio.h>

int main(void) {
    int size, edges;
    scanf("%d %d", &size, &edges);
    int length[8][8] = {0};
    while (edges--) {
        int a, b, l;
        scanf("%d %d %d", &a, &b, &l);
        length[a][b] = length[b][a] = l;
    }
    int source;
    scanf("%d", &source);
    int best[8], settled[8] = {0};
    for (int v = 0; v < size; v++) best[v] = INT_MAX;
    best[source] = 0;
    while (1) {
        int here = -1;
        for (int v = 0; v < size; v++)
            if (!settled[v] && best[v] != INT_MAX && (here < 0 || best[v] < best[here])) here = v;
        if (here < 0) break;
        settled[here] = 1;
        for (int there = 0; there < size; there++)
            if (length[here][there] && best[here] + length[here][there] < best[there])
                best[there] = best[here] + length[here][there];
    }
    for (int v = 0; v < size; v++) printf("%d: %d\n", v, best[v] == INT_MAX ? -1 : best[v]);
    return 0;
}
