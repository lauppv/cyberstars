#include <stdio.h>

int main(void) {
    unsigned size, address;
    int n, table[64] = {0}, faults = 0;
    scanf("%u %d", &size, &n);
    for (int p = 0; p < n; p++) scanf("%d", &table[p]);
    int shift = 0;
    while ((1u << shift) < size) shift++;
    while (scanf("%u", &address) == 1) {
        unsigned page = address >> shift, offset = address & (size - 1);
        printf("%u: page %u, offset %u -> ", address, page, offset);
        if (table[page & 63] == -1) { printf("page fault\n"); faults++; }
        else printf("%u\n", table[page & 63] * size + offset);
    }
    printf("Page faults: %d\n", faults);
    return 0;
}
