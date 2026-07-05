```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Fork in a loop: each iteration creates a new child.
    // The child exits right after printf, otherwise it would keep
    // running the loop and fork its own children (exponential blow-up).
    for (int i = 1; i <= n; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            printf("Child %d ready\n", i);
            return 0;
        }
    }

    // Wait for all n children, one by one.
    for (int i = 0; i < n; i++) {
        wait(NULL);
    }

    printf("All children finished\n");
    return 0;
}
```
