#include <stdio.h>

typedef struct { char id[8]; int at, bt, wt, done; } Job;

int main(void) {
    int n;
    Job j[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%7s %d %d", j[i].id, &j[i].at, &j[i].bt); j[i].done = 0; }
    int t = 0, left = n;
    while (left > 0) {
        Job *best = NULL;
        for (int i = 0; i < n; i++) {
            Job *c = &j[i];
            if (c->done || c->at > t) continue;
            if (!best || c->at < best->at || (c->at == best->at && c->bt < best->bt)) best = c;
        }
        if (!best) {
            int soon = 1 << 30;
            for (int i = 0; i < n; i++) if (!j[i].done && j[i].at < soon) soon = j[i].at;
            printf("%d-%d idle\n", t, soon);
            t = soon;
            continue;
        }
        printf("%d-%d %s\n", t, t + best->bt, best->id);
        best->wt = t - best->at;
        t += best->bt;
        best->done = 1;
        left--;
    }
    double w = 0, ta = 0;
    for (int i = 0; i < n; i++) {
        printf("%s: waiting %d, turnaround %d\n", j[i].id, j[i].wt, j[i].wt + j[i].bt);
        w += j[i].wt;
        ta += j[i].wt + j[i].bt;
    }
    printf("Average waiting: %.2f\nAverage turnaround: %.2f\n", w / n, ta / n);
    return 0;
}
