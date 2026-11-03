#include <stdio.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        if (fork() == 0) {
            printf("Child %d ready\n", i);
            return 0;
        }
    }
    for (int i = 0; i < n; i++) wait(NULL);
    printf("All children finished\n");
    return 0;
}
