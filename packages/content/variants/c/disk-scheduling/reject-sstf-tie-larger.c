#include <stdio.h>
#include <stdlib.h>

int head;
int requests[100];
int n = 0;

void report(const char *name, int order[]) {
    int position = head;
    int moved = 0;
    printf("%s:", name);
    for (int i = 0; i < n; i++) {
        printf(" %d", order[i]);
        moved = moved + abs(order[i] - position);
        position = order[i];
    }
    printf(", moved %d\n", moved);
}

int by_value(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main(void) {
    scanf("%d", &head);
    while (n < 100 && scanf("%d", &requests[n]) == 1) {
        n++;
    }

    report("FCFS", requests);

    int sstf[100];
    int done[100] = { 0 };
    int position = head;
    for (int k = 0; k < n; k++) {
        int best = -1;
        for (int i = 0; i < n; i++) {
            if (done[i]) {
                continue;
            }
            int d = abs(requests[i] - position);
            int best_d = best == -1 ? 0 : abs(requests[best] - position);
            if (best == -1 || d < best_d || (d == best_d && requests[i] > requests[best])) {
                best = i;
            }
        }
        done[best] = 1;
        sstf[k] = requests[best];
        position = requests[best];
    }
    report("SSTF", sstf);

    int sorted[100];
    for (int i = 0; i < n; i++) {
        sorted[i] = requests[i];
    }
    qsort(sorted, n, sizeof(int), by_value);
    int look[100];
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (sorted[i] >= head) {
            look[k] = sorted[i];
            k++;
        }
    }
    for (int i = n - 1; i >= 0; i--) {
        if (sorted[i] < head) {
            look[k] = sorted[i];
            k++;
        }
    }
    report("LOOK", look);
    return 0;
}
