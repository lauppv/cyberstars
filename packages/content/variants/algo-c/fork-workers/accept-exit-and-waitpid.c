#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int k = 1;
    while (k <= n) {
        if (fork() == 0) {
            printf("Child %d ready\n", k);
            exit(0);
        }
        k++;
    }
    while (wait(NULL) > 0) {
    }
    puts("All children finished");
    return 0;
}
