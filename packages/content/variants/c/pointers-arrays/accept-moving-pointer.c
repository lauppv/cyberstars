#include <stdio.h>

long sum_array(const int *p, int size) {
    long acc = 0;
    const int *end = p + size;
    while (p < end) acc += *p++;
    return acc;
}

int main(void) {
    int count;
    scanf("%d", &count);
    int buffer[100];
    for (int k = 0; k < count; k++) scanf("%d", buffer + k);
    printf("%ld\n", sum_array(buffer, count));
    return 0;
}
