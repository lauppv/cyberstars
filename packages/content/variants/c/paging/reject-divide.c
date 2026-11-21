#include <stdio.h>

int main(void) {
    unsigned size, address;
    int n, table[64], faults = 0;
    scanf("%u %d", &size, &n);
    for (int p = 0; p < n; p++) scanf("%d", &table[p]);
    while (scanf("%u", &address) == 1) {
        unsigned page = address / size, offset = address % size;
        printf("%u: page %u, offset %u -> ", address, page, offset);
        if (page >= (unsigned)n || table[page] == -1) { printf("page fault\n"); faults++; }
        else printf("%u\n", table[page] * size + offset);
    }
    printf("Page faults: %d\n", faults);
    return 0;
}
