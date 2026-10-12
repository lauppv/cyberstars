#include <stdio.h>

int main(void) {
    int count;
    scanf("%d", &count);
    int values[100];
    long sum = 0;
    for (int k = 0; k < count; k++) {
        scanf("%d", &values[k]);
        sum += values[k];
    }
    for (int k = 0; k < count; k++)
        printf("%d\n", values[k]);
    printf("%ld\n", sum);
    printf("%lf\n", (double) sum / count);
    return 0;
}
