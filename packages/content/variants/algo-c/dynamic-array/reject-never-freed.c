#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int *values = malloc(n * sizeof(int));
    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
        sum += values[i];
    }
    printf("%d\n%.2f\n", sum, (double)sum / n);
    return 0;
}
