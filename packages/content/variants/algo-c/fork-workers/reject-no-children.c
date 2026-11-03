#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) printf("Child %d ready\n", i);
    printf("All children finished\n");
    return 0;
}
