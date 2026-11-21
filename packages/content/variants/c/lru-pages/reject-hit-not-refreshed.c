#include <stdio.h>

int main(void) {
    int frames;
    scanf("%d", &frames);

    int slot[7];
    int last_used[7];
    int used = 0;
    int clock = 0;
    int faults = 0;
    int hits = 0;
    int page;

    while (scanf("%d", &page) == 1) {
        int found = -1;
        for (int s = 0; s < used; s++) {
            if (slot[s] == page) {
                found = s;
            }
        }

        if (found != -1) {
            hits++;

        } else {
            faults++;
            int target;
            if (used < frames) {
                target = used;
                used++;
            } else {
                target = 0;
                for (int s = 1; s < frames; s++) {
                    if (last_used[s] < last_used[target]) {
                        target = s;
                    }
                }
            }
            slot[target] = page;
            last_used[target] = clock;
        }
        clock++;

        printf("%d:", page);
        for (int s = 0; s < frames; s++) {
            if (s < used) {
                printf(" %d", slot[s]);
            } else {
                printf(" -");
            }
        }
        printf(" %s\n", found != -1 ? "hit" : "fault");
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
