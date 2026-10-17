#include <stdio.h>

int main(void) {
    int n, pops, heap[7], size = 0;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) {
        int i = size++;
        scanf("%d", &heap[i]);
        while (i > 0 && heap[i] < heap[(i - 1) / 2]) {
            int p = (i - 1) / 2, t = heap[i];
            heap[i] = heap[p];
            heap[p] = t;
            i = p;
        }
    }
    scanf("%d", &pops);
    printf("Heap:");
    for (int i = 0; i < size; i++) printf(" %d", heap[i]);
    printf("\nPopped:");
    for (int k = 0; k < pops; k++) {
        printf(" %d", heap[0]);
        heap[0] = heap[--size];
        int i = 0;
        while (1) {
            int c = i;
            if (2 * i + 1 < size && heap[2 * i + 1] < heap[c]) c = 2 * i + 1;
            if (2 * i + 2 < size && heap[2 * i + 2] < heap[c]) c = 2 * i + 2;
            if (c == i) break;
            int t = heap[i];
            heap[i] = heap[c];
            heap[c] = t;
            i = c;
        }
    }
    printf("\nLeft:");
    for (int i = 0; i < size; i++) printf(" %d", heap[i]);
    printf("\n");
    return 0;
}
