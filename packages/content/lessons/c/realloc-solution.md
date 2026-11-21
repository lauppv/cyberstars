```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2;
    int count = 0;
    int *v = malloc(capacity * sizeof(int));
    int x;

    while (scanf("%d", &x) == 1) {
        if (count == capacity) {
            capacity = capacity * 2;
            int *bigger = realloc(v, capacity * sizeof(int));
            if (bigger == NULL) {
                free(v);
                return 1;
            }
            v = bigger;
        }
        v[count] = x;
        count++;
    }

    long sum = 0;
    for (int i = 0; i < count; i++) {
        sum = sum + v[i];
    }
    double average = (double)sum / count;

    printf("Values: %d\n", count);
    printf("Capacity: %d\n", capacity);
    printf("Above average:");
    int shown = 0;
    for (int i = 0; i < count; i++) {
        if (v[i] > average) {
            printf(" %d", v[i]);
            shown++;
        }
    }
    if (shown == 0) {
        printf(" none");
    }
    printf("\n");

    free(v);
    return 0;
}
```
