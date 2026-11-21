#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int v[10000], count = 0, x, capacity = 2;
    while (scanf("%d", &x) == 1) {
        if (count == capacity) capacity *= 2;
        v[count++] = x;
    }
    long sum = 0;
    for (int i = 0; i < count; i++) sum += v[i];
    double avg = (double)sum / count;
    printf("Values: %d\nCapacity: %d\nAbove average:", count, capacity);
    int shown = 0;
    for (int i = 0; i < count; i++) if (v[i] > avg) { printf(" %d", v[i]); shown++; }
    printf(shown ? "\n" : " none\n");
    return 0;
}
