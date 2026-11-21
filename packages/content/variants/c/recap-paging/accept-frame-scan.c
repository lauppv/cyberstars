#include <stdio.h>

int main(void) {
    unsigned sz, a;
    int F, pg[8], when[8], t = 0, faults = 0, hits = 0;
    scanf("%u %d", &sz, &F);
    unsigned bits = 0;
    while ((sz >> bits) > 1) bits++;
    for (int i = 0; i < F; i++) pg[i] = -1;
    while (scanf("%u", &a) == 1) {
        int p = (int)(a >> bits), f = -1, free_f = -1, lru = 0;
        for (int i = 0; i < F; i++) {
            if (pg[i] == p) f = i;
            if (pg[i] == -1 && free_f < 0) free_f = i;
            if (pg[i] != -1 && when[i] < when[lru]) lru = i;
        }
        printf("%u: page %d, ", a, p);
        if (f >= 0) { hits++; printf("hit, "); }
        else {
            faults++;
            printf("fault, ");
            if (free_f >= 0) f = free_f;
            else { f = lru; printf("out page %d, ", pg[f]); }
            pg[f] = p;
        }
        when[f] = t++;
        printf("frame %d -> %u\n", f, ((unsigned)f << bits) + (a & (sz - 1)));
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
