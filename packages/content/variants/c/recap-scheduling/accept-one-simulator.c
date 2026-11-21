#include <stdio.h>
#include <string.h>

static int n, q, at[20], bt[20];
static char id[20][8];

/* mode 0 FCFS, 1 SJF, 2 RR: one event loop */
static int simulate(int mode) {
    int rem[20], in[20] = {0}, fin[20], qu[4096], h = 0, tl = 0, t = 0, left = n;
    for (int i = 0; i < n; i++) rem[i] = bt[i];
    while (left) {
        if (mode == 2) {
            for (;;) {
                int b = -1;
                for (int i = 0; i < n; i++) if (!in[i] && at[i] <= t && (b < 0 || at[i] < at[b])) b = i;
                if (b < 0) break;
                in[b] = 1;
                qu[tl++] = b;
            }
            if (h == tl) {
                int b = -1;
                for (int i = 0; i < n; i++) if (!in[i] && (b < 0 || at[i] < at[b])) b = i;
                t = at[b];
                continue;
            }
            int p = qu[h++], run = rem[p] < q ? rem[p] : q;
            t += run;
            rem[p] -= run;
            for (;;) {
                int b = -1;
                for (int i = 0; i < n; i++) if (!in[i] && at[i] <= t && (b < 0 || at[i] < at[b])) b = i;
                if (b < 0) break;
                in[b] = 1;
                qu[tl++] = b;
            }
            if (rem[p]) qu[tl++] = p; else { fin[p] = t; left--; }
            continue;
        }
        int b = -1;
        for (int i = 0; i < n; i++) {
            if (!rem[i] || at[i] > t) continue;
            if (b < 0) { b = i; continue; }
            if (mode == 0 ? at[i] < at[b] : (bt[i] < bt[b] || (bt[i] == bt[b] && at[i] < at[b]))) b = i;
        }
        if (b < 0) {
            for (int i = 0; i < n; i++) if (rem[i] && (b < 0 || at[i] < at[b])) b = i;
            t = at[b];
            continue;
        }
        t += rem[b];
        rem[b] = 0;
        fin[b] = t;
        left--;
    }
    int w = 0;
    for (int i = 0; i < n; i++) w += fin[i] - at[i] - bt[i];
    return w;
}

int fcfs(void) { return simulate(0); }
int sjf(void) { return simulate(1); }
int round_robin(void) { return simulate(2); }

int main(void) {
    scanf("%d%d", &n, &q);
    for (int i = 0; i < n; i++) scanf("%7s%d%d", id[i], &at[i], &bt[i]);
    int w[3] = { fcfs(), sjf(), round_robin() };
    const char *nm[3] = { "FCFS", "SJF", "RR" };
    int best = 0;
    for (int i = 0; i < 3; i++) {
        printf("%s: %.2f\n", nm[i], (double)w[i] / n);
        if (w[i] < w[best]) best = i;
    }
    printf("Best: %s\n", nm[best]);
    return 0;
}
