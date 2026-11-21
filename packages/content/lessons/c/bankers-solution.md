```c
#include <stdio.h>

int n, m;
int available[4];
int max[8][4];
int allocation[8][4];
int need[8][4];

int fits(int a[], int b[]) {
    for (int j = 0; j < m; j++) {
        if (a[j] > b[j]) {
            return 0;
        }
    }
    return 1;
}

int safe(int order[]) {
    int work[4];
    int finished[8] = { 0 };
    for (int j = 0; j < m; j++) {
        work[j] = available[j];
    }
    for (int step = 0; step < n; step++) {
        int found = -1;
        for (int i = 0; i < n && found == -1; i++) {
            if (!finished[i] && fits(need[i], work)) {
                found = i;
            }
        }
        if (found == -1) {
            return 0;
        }
        for (int j = 0; j < m; j++) {
            work[j] = work[j] + allocation[found][j];
        }
        finished[found] = 1;
        order[step] = found;
    }
    return 1;
}

void give(int p, int request[], int sign) {
    for (int j = 0; j < m; j++) {
        available[j] = available[j] - sign * request[j];
        allocation[p][j] = allocation[p][j] + sign * request[j];
        need[p][j] = need[p][j] - sign * request[j];
    }
}

int main(void) {
    scanf("%d %d", &n, &m);
    for (int j = 0; j < m; j++) {
        scanf("%d", &available[j]);
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &max[i][j]);
        }
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &allocation[i][j]);
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }

    int order[8];
    if (!safe(order)) {
        printf("Unsafe\n");
        return 0;
    }
    printf("Safe:");
    for (int i = 0; i < n; i++) {
        printf(" P%d", order[i]);
    }
    printf("\n");

    int p;
    int request[4];
    while (scanf("%d", &p) == 1) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &request[j]);
        }
        printf("P%d", p);
        for (int j = 0; j < m; j++) {
            printf(" %d", request[j]);
        }

        if (!fits(request, need[p])) {
            printf(": error\n");
        } else if (!fits(request, available)) {
            printf(": wait\n");
        } else {
            give(p, request, 1);
            if (safe(order)) {
                printf(": granted\n");
            } else {
                give(p, request, -1);
                printf(": unsafe\n");
            }
        }
    }
    return 0;
}
```
