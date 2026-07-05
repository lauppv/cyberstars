```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int n;
    scanf("%d", &n);
    int nums[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }

    // Create the pipe used to send the even count from child to parent.
    int p[2];
    pipe(p);

    pid_t pid = fork();
    if (pid == 0) {
        // Child: count evens and send the result through the pipe.
        close(p[0]);
        int evens = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i] % 2 == 0) {
                evens++;
            }
        }
        write(p[1], &evens, sizeof(int));
        close(p[1]);
        return 0;
    }

    // Parent: count odds in parallel with the child.
    close(p[1]);
    int odds = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] % 2 != 0) {
            odds++;
        }
    }

    // Wait for the child, then read the even count from the pipe.
    wait(NULL);
    int evens;
    read(p[0], &evens, sizeof(int));
    close(p[0]);

    printf("Evens: %d\n", evens);
    printf("Odds: %d\n", odds);
    return 0;
}
```
