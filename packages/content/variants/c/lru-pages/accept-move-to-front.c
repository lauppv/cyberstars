#include <stdio.h>

int main(void) {
    int F, frame[7], recent[7], n = 0, faults = 0, hits = 0, p;
    /* recent[0] is the most recently used slot, recent[n-1] the least */
    scanf("%d", &F);
    while (scanf("%d", &p) == 1) {
        int at = -1;
        for (int i = 0; i < n; i++) if (frame[i] == p) at = i;
        int slot;
        if (at >= 0) { hits++; slot = at; }
        else {
            faults++;
            if (n < F) { slot = n; recent[n] = n; n++; }
            else slot = recent[n - 1];
            frame[slot] = p;
        }
        int pos = 0;
        while (recent[pos] != slot) pos++;
        for (; pos > 0; pos--) recent[pos] = recent[pos - 1];
        recent[0] = slot;
        printf("%d:", p);
        for (int i = 0; i < F; i++) {
            if (i < n) printf(" %d", frame[i]);
            else printf(" -");
        }
        printf(" %s\n", at >= 0 ? "hit" : "fault");
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
