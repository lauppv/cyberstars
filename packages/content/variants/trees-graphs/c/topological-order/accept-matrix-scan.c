#include <stdio.h>

int main(void) {
    int count, edges;
    scanf("%d %d", &count, &edges);
    int before[8][8] = {0};
    for (int k = 0; k < edges; k++) {
        int first, then;
        scanf("%d %d", &first, &then);
        before[first][then] = 1;
    }
    int placed[8] = {0}, plan[8], total = 0;
    while (total < count) {
        int pick = -1;
        for (int v = 0; v < count && pick < 0; v++) {
            if (placed[v]) continue;
            int free = 1;
            for (int w = 0; w < count; w++)
                if (before[w][v] && !placed[w]) free = 0;
            if (free) pick = v;
        }
        if (pick < 0) break;
        placed[pick] = 1;
        plan[total++] = pick;
    }
    if (total < count) {
        puts("No order, there is a cycle");
        return 0;
    }
    printf("Order:");
    for (int i = 0; i < total; i++) printf(" %d", plan[i]);
    printf("\n");
    return 0;
}
