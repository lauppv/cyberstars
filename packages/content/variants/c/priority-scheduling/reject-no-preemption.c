#include <stdio.h>

int main(void) {
    int n, at[20], bt[20], pr[20], rem[20], fin[20];
    char id[20][8];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%7s%d%d%d", id[i], &at[i], &bt[i], &pr[i]); rem[i] = bt[i]; }
    int t = 0, done = 0, cur = -2, from = 0;
    while (done < n) {
        int best = -1;
        for (int i = 0; i < n; i++)
            if (rem[i] && at[i] <= t && (best < 0 || pr[i] < pr[best] || (pr[i] == pr[best] && at[i] < at[best]))) best = i;
        if (best != cur) {
            if (cur != -2 && t > from) printf("%d-%d %s\n", from, t, cur < 0 ? "idle" : id[cur]);
            cur = best;
            from = t;
        }
        if (best >= 0) { t += rem[best]; rem[best] = 0; fin[best] = t; done++; continue; }
        t++;
    }
    printf("%d-%d %s\n", from, t, id[cur]);
    double w = 0, ta = 0;
    for (int i = 0; i < n; i++) {
        int tr = fin[i] - at[i];
        printf("%s: waiting %d, turnaround %d\n", id[i], tr - bt[i], tr);
        w += tr - bt[i];
        ta += tr;
    }
    printf("Average waiting: %.2f\nAverage turnaround: %.2f\n", w / n, ta / n);
    return 0;
}
