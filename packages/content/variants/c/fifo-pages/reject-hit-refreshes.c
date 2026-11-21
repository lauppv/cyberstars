#include <stdio.h>

int main(void) {
    int F, slot[7], age[7], used = 0, t = 0, faults = 0, hits = 0, p;
    scanf("%d", &F);
    while (scanf("%d", &p) == 1) {
        int found = -1;
        for (int s = 0; s < used; s++) if (slot[s] == p) found = s;
        if (found >= 0) { hits++; age[found] = t++; }
        else {
            faults++;
            int s = used;
            if (used < F) used++;
            else { s = 0; for (int i = 1; i < F; i++) if (age[i] < age[s]) s = i; }
            slot[s] = p; age[s] = t++;
        }
        printf("%d:", p);
        for (int s = 0; s < F; s++) s < used ? printf(" %d", slot[s]) : printf(" -");
        printf(" %s\n", found >= 0 ? "hit" : "fault");
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
