#include <stdio.h>

int main(void) {
    int count, edge_count;
    scanf("%d %d", &count, &edge_count);
    int from[64], to[64];
    for (int k = 0; k < edge_count; k++) {
        scanf("%d %d", &from[k], &to[k]);
    }
    puts("Matrix:");
    for (int a = 0; a < count; a++) {
        for (int b = 0; b < count; b++) {
            int joined = 0;
            for (int k = 0; k < edge_count; k++) {
                if ((from[k] == a && to[k] == b) || (from[k] == b && to[k] == a)) joined = 1;
            }
            printf(b == 0 ? "%d" : " %d", joined);
        }
        putchar('\n');
    }
    puts("List:");
    for (int a = 0; a < count; a++) {
        printf("%d:", a);
        for (int k = 0; k < edge_count; k++) {
            if (from[k] == a) printf(" %d", to[k]);
            if (to[k] == a) printf(" %d", from[k]);
        }
        putchar('\n');
    }
    return 0;
}
