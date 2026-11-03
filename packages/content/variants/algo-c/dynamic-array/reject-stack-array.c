#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int values[20000];
    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
        sum += values[i];
    }
    printf("%d\n%.2f\n", sum, (double)sum / n);
    return 0;
}
