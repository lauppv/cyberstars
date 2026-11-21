#include <stdio.h>

int main(void) {
    int F, frame[7], born[7], n = 0, clock = 0, faults = 0, hits = 0, p;
    scanf("%d", &F);
    while (scanf("%d", &p) == 1) {
        int at = -1;
        for (int i = 0; i < n; i++) if (frame[i] == p) at = i;
        if (at >= 0) {
            hits++;
        } else {
            faults++;
            int slot;
            if (n < F) {
                slot = n++;
            } else {
                slot = 0;
                for (int i = 1; i < F; i++) if (born[i] < born[slot]) slot = i;
            }
            frame[slot] = p;
            born[slot] = clock++;
        }
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
