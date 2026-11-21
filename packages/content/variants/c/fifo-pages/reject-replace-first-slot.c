#include <stdio.h>

int main(void) {
    int F, slot[7], used = 0, faults = 0, hits = 0, p;
    scanf("%d", &F);
    while (scanf("%d", &p) == 1) {
        int found = 0;
        for (int s = 0; s < used; s++) if (slot[s] == p) found = 1;
        if (found) hits++;
        else { faults++; if (used < F) slot[used++] = p; else slot[0] = p; }
        printf("%d:", p);
        for (int s = 0; s < F; s++) s < used ? printf(" %d", slot[s]) : printf(" -");
        printf(" %s\n", found ? "hit" : "fault");
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
