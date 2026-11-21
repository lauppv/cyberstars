#include <stdio.h>
#include <stdlib.h>

static int cmp(const void *a, const void *b) { return *(const int *)a - *(const int *)b; }

static void show(const char *tag, int start, const int *seq, int n) {
    int at = start, total = 0;
    printf("%s:", tag);
    for (int i = 0; i < n; i++) { printf(" %d", seq[i]); total += abs(seq[i] - at); at = seq[i]; }
    printf(", moved %d\n", total);
}

int main(void) {
    int head, r[100], n = 0;
    scanf("%d", &head);
    while (n < 100 && scanf("%d", &r[n]) == 1) n++;
    show("FCFS", head, r, n);
    int s[100], out[100];
    for (int i = 0; i < n; i++) s[i] = r[i];
    qsort(s, n, sizeof *s, cmp);
    int hi = 0;
    while (hi < n && s[hi] < head) hi++;
    int lo = hi - 1, at = head;
    for (int k = 0; k < n; k++) {
        int pick_lo = lo >= 0 && (hi >= n || at - s[lo] <= s[hi] - at);
        out[k] = pick_lo ? s[lo--] : s[hi++];
        at = out[k];
    }
    show("SSTF", head, out, n);
    int k = 0;
    for (int i = 0; i < n; i++) if (s[i] >= head) out[k++] = s[i];
    for (int i = n - 1; i >= 0; i--) if (s[i] < head) out[k++] = s[i];
    show("LOOK", head, out, n);
    return 0;
}
