#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int i = 1;
    while (i <= n) {
        int j = 1;
        while (j <= i) {
            printf("%d ", j);
            j++;
        }
        printf("\n");
        i++;
    }
    return 0;
}
