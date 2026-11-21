#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2, count = 0, x;
    int *v = malloc(capacity * sizeof(int));
    while (scanf("%d", &x) == 1) {
        if (count == capacity) {
            capacity *= 2;
            v = realloc(v, capacity * sizeof(int));
        }
        v[count++] = x;
    }
    long sum = 0;
    for (int i = 0; i < count; i++) sum += v[i];
    long avg = sum / count;
    printf("Values: %d\nCapacity: %d\nAbove average:", count, capacity);
    int shown = 0;
    for (int i = 0; i < count; i++) if (v[i] > avg) { printf(" %d", v[i]); shown++; }
    printf(shown ? "\n" : " none\n");
    free(v);
    return 0;
}
