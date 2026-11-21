#include <stdio.h>

int main(void) {
    int n, q, at[20], bt[20], rem[20], end[20], order[20];
    char id[20][8];
    scanf("%d %d", &n, &q);
    for (int i = 0; i < n; i++) { scanf("%7s %d %d", id[i], &at[i], &bt[i]); rem[i] = bt[i]; order[i] = i; }
    for (int i = 1; i < n; i++)
        for (int j = i; j > 0 && at[order[j]] < at[order[j - 1]]; j--) { int t = order[j]; order[j] = order[j - 1]; order[j - 1] = t; }
    int ring[64], head = 0, size = 0, next = 0, t = 0, left = n;
    #define PUSH(x) (ring[(head + size++) % 64] = (x))
    while (next < n && at[order[next]] <= t) PUSH(order[next++]);
    while (left) {
        if (!size) {
            printf("%d-%d idle\n", t, at[order[next]]);
            t = at[order[next]];
            while (next < n && at[order[next]] <= t) PUSH(order[next++]);
            continue;
        }
        int p = ring[head];
        head = (head + 1) % 64;
        size--;
        int run = rem[p] < q ? rem[p] : q;
        printf("%d-%d %s\n", t, t + run, id[p]);
        t += run;
        rem[p] -= run;
        while (next < n && at[order[next]] <= t) PUSH(order[next++]);
        if (rem[p]) PUSH(p); else { end[p] = t; left--; }
    }
    double w = 0, ta = 0;
    for (int i = 0; i < n; i++) {
        int tr = end[i] - at[i];
        printf("%s: waiting %d, turnaround %d\n", id[i], tr - bt[i], tr);
        w += tr - bt[i];
        ta += tr;
    }
    printf("Average waiting: %.2f\nAverage turnaround: %.2f\n", w / n, ta / n);
    return 0;
}
