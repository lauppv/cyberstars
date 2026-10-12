#include <stdio.h>
#include <stdlib.h>

static int *read_batch(int size) {
    int *arr = malloc(size * sizeof(int));
    for (int k = 0; k < size; k++) scanf("%d", arr + k);
    return arr;
}

int main(void) {
    int size;
    scanf("%d", &size);
    int *batch = read_batch(size);
    for (int k = 0; k < size; k++) printf("%d\n", batch[k]);
    free(batch);
    return 0;
}
