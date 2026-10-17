#include <stdio.h>

int h[7], n = 0;

void swap(int i, int j) {
    int t = h[i];
    h[i] = h[j];
    h[j] = t;
}

void add(int x) {
    int k = n++;
    h[k] = x;
    while (k > 0 && h[(k - 1) / 2] > h[k]) {
        swap(k, (k - 1) / 2);
        k = (k - 1) / 2;
    }
}

int take(void) {
    int top = h[0];
    h[0] = h[--n];
    for (int k = 0;;) {
        int best = k;
        for (int c = 2 * k + 1; c <= 2 * k + 2; c++) {
            if (c < n && h[c] < h[best]) best = c;
        }
        if (best == k) break;
        swap(k, best);
        k = best;
    }
    return top;
}

void show(const char *label) {
    printf("%s", label);
    for (int i = 0; i < n; i++) printf(" %d", h[i]);
    printf("\n");
}

int main(void) {
    int count, x, pops;
    scanf("%d", &count);
    while (count--) {
        scanf("%d", &x);
        add(x);
    }
    scanf("%d", &pops);
    show("Heap:");
    printf("Popped:");
    while (pops--) printf(" %d", take());
    printf("\n");
    show("Left:");
    return 0;
}
