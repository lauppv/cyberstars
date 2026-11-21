```c
#include <stdio.h>

int main(void) {
    int frames;
    scanf("%d", &frames);

    int slot[7];
    int used = 0;
    int oldest = 0;
    int faults = 0;
    int hits = 0;
    int page;

    while (scanf("%d", &page) == 1) {
        int found = 0;
        for (int s = 0; s < used; s++) {
            if (slot[s] == page) {
                found = 1;
            }
        }

        if (found) {
            hits++;
        } else {
            faults++;
            if (used < frames) {
                slot[used] = page;
                used++;
            } else {
                slot[oldest] = page;
                oldest = (oldest + 1) % frames;
            }
        }

        printf("%d:", page);
        for (int s = 0; s < frames; s++) {
            if (s < used) {
                printf(" %d", slot[s]);
            } else {
                printf(" -");
            }
        }
        printf(" %s\n", found ? "hit" : "fault");
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
```
