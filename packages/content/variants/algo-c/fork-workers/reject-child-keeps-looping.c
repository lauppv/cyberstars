#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        if (fork() == 0) {
            printf("Child %d ready\n", i);
            fflush(stdout);
        }
    }
    while (wait(NULL) > 0) {
    }
    printf("All children finished\n");
    return 0;
}
