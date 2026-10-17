#include <stdio.h>

int main(void) {
    int count, edges;
    scanf("%d %d", &count, &edges);
    int joined[8][8] = {0};
    for (int k = 0; k < edges; k++) {
        int a, b;
        scanf("%d %d", &a, &b);
        joined[a][b] = joined[b][a] = 1;
    }
    int source, target;
    scanf("%d %d", &source, &target);

    int steps[8], line[8], front = 0, back = 0;
    for (int v = 0; v < count; v++) steps[v] = -1;
    steps[source] = 0;
    line[back++] = source;
    while (front != back) {
        int here = line[front++];
        for (int there = 0; there < count; there++) {
            if (joined[here][there] && steps[there] < 0) {
                steps[there] = steps[here] + 1;
                line[back++] = there;
            }
        }
    }
    for (int v = 0; v < count; v++) printf("%d: %d\n", v, steps[v]);
    if (steps[target] < 0) printf("No way from %d to %d\n", source, target);
    else printf("Fewest steps from %d to %d: %d\n", source, target, steps[target]);
    return 0;
}
