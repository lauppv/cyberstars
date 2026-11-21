#include <stdio.h>

int frame_of_page[70000];
int page_in_frame[8];
int last_used[8];

int main(void) {
    unsigned size;
    int frames;
    scanf("%u %d", &size, &frames);

    int shift = 0;
    while ((1u << shift) < size) {
        shift++;
    }
    unsigned mask = size - 1;

    for (int p = 0; p < 70000; p++) {
        frame_of_page[p] = -1;
    }
    for (int f = 0; f < frames; f++) {
        page_in_frame[f] = -1;
    }

    unsigned address;
    int clock = 0;
    int faults = 0;
    int hits = 0;
    while (scanf("%u", &address) == 1) {
        unsigned page = address >> shift;
        unsigned offset = address & mask;
        int frame = frame_of_page[page];
        printf("%u: page %u, ", address, page);

        if (frame != -1) {
            hits++;
            printf("hit, ");
        } else {
            faults++;
            printf("fault, ");
            frame = -1;
            for (int f = frames - 1; f >= 0 && frame == -1; f--) {
                if (page_in_frame[f] == -1) {
                    frame = f;
                }
            }
            if (frame == -1) {
                frame = 0;
                for (int f = 1; f < frames; f++) {
                    if (last_used[f] < last_used[frame]) {
                        frame = f;
                    }
                }
                printf("out page %d, ", page_in_frame[frame]);
                frame_of_page[page_in_frame[frame]] = -1;
            }
            page_in_frame[frame] = page;
            frame_of_page[page] = frame;
        }

        last_used[frame] = clock;
        clock++;
        printf("frame %d -> %u\n", frame, ((unsigned)frame << shift) | offset);
    }
    printf("Faults: %d, hits: %d\n", faults, hits);
    return 0;
}
