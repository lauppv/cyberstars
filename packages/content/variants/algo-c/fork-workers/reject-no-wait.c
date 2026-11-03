#include <stdio.h>
#include <unistd.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        if (fork() == 0) {
            printf("Child %d ready\n", i);
            return 0;
        }
    }
    printf("All children finished\n");
    return 0;
}
