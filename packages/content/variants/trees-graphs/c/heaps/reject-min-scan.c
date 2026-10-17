#include <stdio.h>

void heap_push(int heap[], int *size, int value) {
    heap[*size] = value;
    int i = *size;
    *size = *size + 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] < heap[parent]) {
            int temp = heap[i];
            heap[i] = heap[parent];
            heap[parent] = temp;
            i = parent;
        } else {
            break;
        }
    }
}

int heap_pop(int heap[], int *size) {
    int smallest = heap[0];
    *size = *size - 1;
    heap[0] = heap[*size];
    int i = 0;
    while (1) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int child = i;
        if (left < *size && heap[left] < heap[child]) {
            child = left;
        }
        if (right < *size && heap[right] < heap[child]) {
            child = right;
        }
        if (child == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[child];
        heap[child] = temp;
        i = child;
    }
    return smallest;
}

void print_heap(const char *label, int heap[], int size) {
    printf("%s", label);
    for (int i = 0; i < size; i++) {
        printf(" %d", heap[i]);
    }
    printf("\n");
}

int main(void) {
    int n;
    scanf("%d", &n);
    int heap[7];
    int size = 0;
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        heap_push(heap, &size, value);
    }
    int pops;
    scanf("%d", &pops);

    print_heap("Heap:", heap, size);

    printf("Popped:");
    for (int i = 0; i < pops; i++) {
        int best = 0;
        for (int j = 1; j < size; j++) {
            if (heap[j] < heap[best]) {
                best = j;
            }
        }
        printf(" %d", heap[best]);
        for (int j = best; j < size - 1; j++) {
            heap[j] = heap[j + 1];
        }
        size--;
    }
    printf("\n");

    print_heap("Left:", heap, size);
    return 0;
}
