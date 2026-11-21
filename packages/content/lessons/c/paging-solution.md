```c
#include <stdio.h>

int main(void) {
    unsigned size;
    int n;
    int table[64];
    scanf("%u %d", &size, &n);
    for (int p = 0; p < n; p++) {
        scanf("%d", &table[p]);
    }

    int shift = 0;
    while ((1u << shift) < size) {
        shift++;
    }
    unsigned mask = size - 1;

    unsigned address;
    int faults = 0;
    while (scanf("%u", &address) == 1) {
        unsigned page = address >> shift;
        unsigned offset = address & mask;
        printf("%u: page %u, offset %u -> ", address, page, offset);
        if (page >= (unsigned)n || table[page] == -1) {
            printf("page fault\n");
            faults++;
        } else {
            printf("%u\n", (unsigned)table[page] * size + offset);
        }
    }
    printf("Page faults: %d\n", faults);
    return 0;
}
```
